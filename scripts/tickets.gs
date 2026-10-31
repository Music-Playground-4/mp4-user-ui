/**
 * 밴드할래? 관객 예매 시트 — Google Apps Script 웹 앱
 * ─────────────────────────────────────────────────────────────
 * 사이트 서버(lib/ticketStore.ts)가 이 웹 앱을 부릅니다.
 *
 * 저장소가 공개라서 운영진 아이디·비밀번호는 저장소가 아니라 이 스크립트 안에만 둡니다.
 * (붙여넣은 뒤 ADMIN_ID / ADMIN_PASSWORD 를 바꾸세요.)
 *
 * 설치
 *  1. 구글 시트에서  확장 프로그램 → Apps Script
 *  2. 이 파일 내용을 통째로 붙여넣고 저장
 *  3. 배포 → 새 배포 → 유형: 웹 앱 / 실행: 나 / 액세스: 모든 사용자 → 배포
 *  4. 나온 웹 앱 URL(…/exec)을 lib/ticketStore.ts 의 SCRIPT_URL 에 넣기
 *
 * 코드를 고친 뒤에는 배포 → 배포 관리 → 수정(연필) → 버전: 새 버전 으로 다시 배포해야 반영됩니다.
 *
 * 누가 무엇을 할 수 있나
 *  - 예매 신청(create): 누구나 (사이트 예매 폼과 같음)
 *  - 티켓 보기(get): 예매번호 + 토큰을 아는 사람(= 티켓 링크를 가진 사람)
 *  - 예매 조회(lookup): 이름 + 연락처가 모두 맞는 사람
 *  - 목록·상태 변경(list/update): 운영진 로그인(login)으로 받은 세션
 *
 * 시트의 '상태' 칸은 입금대기 / 입금확인 / 입장완료 / 취소 중 하나입니다.
 * 운영진이 시트에서 직접 바꿔도 사이트 티켓 화면에 바로 반영됩니다.
 */

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'CHANGE_ME';

const SHEET_NAME = '예매';
const SESSION_SECONDS = 6 * 60 * 60; // CacheService 최대 보관 시간
const MAX_FAILS = 10; // 비밀번호를 이만큼 틀리면
const LOCK_SECONDS = 30 * 60; // 이 시간 동안 로그인을 막습니다

const HEADERS = [
  '예매번호', '토큰', '신청시각', '공연', '이름', '연락처', '매수', '금액',
  '입금자명', '보러 온 팀', '상태', '입금확인시각', '입장시각', '메모',
];
const KEYS = [
  'code', 'token', 'createdAt', 'show', 'name', 'phone', 'qty', 'amount',
  'depositor', 'team', 'status', 'paidAt', 'enteredAt', 'memo',
];
const COL = {};
KEYS.forEach(function (k, i) { COL[k] = i + 1; });

const STATUSES = ['입금대기', '입금확인', '입장완료', '취소'];
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false, error: 'bad_json' });
  }
  if (!body) return out({ ok: false, error: 'bad_json' });

  var sheet = getSheet();
  switch (body.action) {
    case 'create':
      return out(create(sheet, body.data || {}));
    case 'get':
      return out({
        ok: true,
        rows: readRows(sheet).filter(function (r) {
          return r.code === String(body.code) && r.token === String(body.token);
        }),
      });
    case 'lookup':
      return out({ ok: true, rows: lookup(sheet, body.name, body.phone) });
    case 'login':
      return out(login(body.id, body.password));
    case 'list':
      if (!isSession(body.session)) return out({ ok: false, error: 'unauthorized' });
      return out({ ok: true, rows: readRows(sheet) });
    case 'update':
      if (!isSession(body.session)) return out({ ok: false, error: 'unauthorized' });
      return out(update(sheet, body.code, body.status));
    default:
      return out({ ok: false, error: 'unknown_action' });
  }
}

/* ── 운영진 로그인 ─────────────────────────────────────────── */
function login(id, password) {
  var cache = CacheService.getScriptCache();
  var fails = Number(cache.get('login_fails') || 0);
  if (fails >= MAX_FAILS) return { ok: false, error: 'locked' };
  if (ADMIN_PASSWORD === 'CHANGE_ME' || id !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    cache.put('login_fails', String(fails + 1), LOCK_SECONDS);
    return { ok: false, error: 'wrong_password' };
  }
  cache.remove('login_fails');
  var session = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
  cache.put('session_' + session, '1', SESSION_SECONDS);
  return { ok: true, session: session };
}

function isSession(session) {
  if (!session) return false;
  return CacheService.getScriptCache().get('session_' + String(session)) === '1';
}

/* ── 시트 ──────────────────────────────────────────────────── */

/** 시트가 없으면 머리글·서식·상태 드롭다운까지 갖춰서 만듭니다. */
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  sheet = ss.insertSheet(SHEET_NAME, 0);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  // 연락처·예매번호가 숫자로 바뀌어 앞자리 0이 사라지지 않도록 텍스트로 고정합니다.
  sheet.getRange(2, COL.phone, sheet.getMaxRows() - 1, 1).setNumberFormat('@');
  sheet.getRange(2, COL.code, sheet.getMaxRows() - 1, 1).setNumberFormat('@');
  var rule = SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build();
  sheet.getRange(2, COL.status, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
  // 토큰은 사람이 볼 일이 없어서 숨겨 둡니다.
  sheet.hideColumns(COL.token);
  return sheet;
}

function readRows(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var values = sheet.getRange(2, 1, last - 1, KEYS.length).getValues();
  return values.filter(function (row) { return row[0] !== ''; }).map(toObject);
}

function toObject(row) {
  var obj = {};
  KEYS.forEach(function (k, i) {
    var v = row[i];
    obj[k] = v instanceof Date ? v.toISOString() : v === '' ? '' : String(v);
  });
  return obj;
}

const digits = function (s) { return String(s || '').replace(/\D/g, ''); };

function lookup(sheet, name, phone) {
  var n = String(name || '').trim();
  var p = digits(phone);
  if (!n || p.length < 10) return [];
  return readRows(sheet).filter(function (r) {
    return r.name.trim() === n && digits(r.phone) === p;
  });
}

function create(sheet, data) {
  // 사이트를 거치지 않고 직접 들어오는 요청도 있을 수 있어서 한 번 더 확인합니다.
  var name = String(data.name || '').trim();
  var phone = String(data.phone || '');
  var qty = Number(data.qty);
  if (!name || name.length > 20) return { ok: false, error: 'bad_input' };
  if (!/^01\d{8,9}$/.test(digits(phone))) return { ok: false, error: 'bad_input' };
  if (!(qty >= 1 && qty <= 10)) return { ok: false, error: 'bad_input' };

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var existing = {};
    readRows(sheet).forEach(function (r) { existing[r.code] = true; });
    var code;
    do {
      code = 'BH-' + randomString(CODE_CHARS, 4);
    } while (existing[code]);
    var token = Utilities.getUuid().replace(/-/g, '').slice(0, 20);

    sheet.appendRow([
      code,
      token,
      new Date(),
      String(data.showSlug || '').slice(0, 40),
      name,
      phone.slice(0, 20),
      qty,
      Number(data.amount) || 0,
      String(data.depositor || name).slice(0, 20),
      String(data.team || '').slice(0, 40),
      '입금대기',
      '',
      '',
      '',
    ]);
    return { ok: true, code: code, token: token };
  } finally {
    lock.releaseLock();
  }
}

function update(sheet, code, status) {
  if (STATUSES.indexOf(status) < 0) return { ok: false, error: 'bad_status' };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var last = sheet.getLastRow();
    if (last < 2) return { ok: true, row: null };
    var codes = sheet.getRange(2, COL.code, last - 1, 1).getValues();
    for (var i = 0; i < codes.length; i++) {
      if (String(codes[i][0]) !== code) continue;
      var r = i + 2;
      var now = new Date();
      sheet.getRange(r, COL.status).setValue(status);
      if ((status === '입금확인' || status === '입장완료') && !sheet.getRange(r, COL.paidAt).getValue()) {
        sheet.getRange(r, COL.paidAt).setValue(now);
      }
      if (status === '입장완료') sheet.getRange(r, COL.enteredAt).setValue(now);
      // 입장 처리를 되돌리면 입장시각도 비웁니다.
      if (status === '입금확인' || status === '입금대기') sheet.getRange(r, COL.enteredAt).setValue('');
      return { ok: true, row: toObject(sheet.getRange(r, 1, 1, KEYS.length).getValues()[0]) };
    }
    return { ok: true, row: null };
  } finally {
    lock.releaseLock();
  }
}

function randomString(chars, length) {
  var s = '';
  for (var i = 0; i < length; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
