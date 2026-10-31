/**
 * 밴드할래? 관객 예매 시트 — Google Apps Script 웹 앱
 * ─────────────────────────────────────────────────────────────
 * 사이트 서버(lib/ticketStore.ts)만 이 웹 앱을 부릅니다. 브라우저는 직접 부르지 않습니다.
 *
 * 설치
 *  1. 구글 시트를 새로 만들고  확장 프로그램 → Apps Script
 *  2. 이 파일 내용을 통째로 붙여넣고 SECRET 을 긴 임의 문자열로 바꾼 뒤 저장
 *  3. 배포 → 새 배포 → 유형: 웹 앱
 *     - 다음 사용자 인증 정보로 실행: 나
 *     - 액세스 권한이 있는 사용자: 모든 사용자
 *  4. 나온 웹 앱 URL(…/exec)을 Vercel 환경변수 TICKETS_SCRIPT_URL 에,
 *     SECRET 값을 TICKETS_SCRIPT_SECRET 에 넣고 Redeploy
 *
 * 코드를 고친 뒤에는 배포 → 배포 관리 → 수정 → 버전: 새 버전 으로 다시 배포해야 반영됩니다.
 *
 * 시트의 '상태' 칸은 입금대기 / 입금확인 / 입장완료 / 취소 중 하나입니다.
 * 운영진이 시트에서 직접 바꿔도 사이트 티켓 화면에 바로 반영됩니다.
 */

const SECRET = 'CHANGE_ME';
const SHEET_NAME = '예매';

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
  if (!body || body.secret !== SECRET || SECRET === 'CHANGE_ME') {
    return out({ ok: false, error: 'unauthorized' });
  }

  var sheet = getSheet();
  switch (body.action) {
    case 'create':
      return out(create(sheet, body.data || {}));
    case 'list':
      return out({ ok: true, rows: readRows(sheet) });
    case 'get':
      return out({
        ok: true,
        rows: readRows(sheet).filter(function (r) { return r.code === body.code; }),
      });
    case 'update':
      return out(update(sheet, body.code, body.status));
    default:
      return out({ ok: false, error: 'unknown_action' });
  }
}

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

function create(sheet, data) {
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
      String(data.showSlug || ''),
      String(data.name || ''),
      String(data.phone || ''),
      Number(data.qty) || 0,
      Number(data.amount) || 0,
      String(data.depositor || ''),
      String(data.team || ''),
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
