import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {validateLeave,prepareFixture,prepareLive,koreaToday} from '../src/leave.mjs';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const data={type:'조퇴',date:'2026-11-20',start:'15:00',end:'16:30',reason:'가상 테스트',approvalLine:'테스트 결재선'};
const html=`<main data-fixture="neis-leave-v1"><label>복무 종류<select aria-label="복무 종류"><option>조퇴</option><option>외출</option><option>출장</option></select></label><label>신청일<input type=date></label><label>시작 시간<input type=time></label><label>종료 시간<input type=time></label><label>사유<input></label><label>개인결재선<select aria-label="개인결재선"><option>테스트 결재선</option></select></label><button onclick="document.body.dataset.submitted='yes'">상신</button></main>`;
test('필수값, 날짜, 시간 검증',()=>{
 assert.deepEqual(validateLeave(data),data);
 for(const patch of [{reason:''},{date:'2026-02-30'},{start:'25:00'},{end:'14:00'},{type:'임의'}]) assert.throws(()=>validateLeave({...data,...patch}));
});
test('한국 날짜 경계',()=>assert.equal(koreaToday(new Date('2026-11-16T16:00:00Z')),'2026-11-17'));
test('미검증 실서비스 차단',async()=>assert.rejects(prepareLive(),/LIVE_ADAPTER_NOT_VERIFIED/));
test('브라우저 입력·재확인·미상신·중복 및 화면변경 차단',async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH}:{})});
 try {
 const page=await browser.newPage();
 await page.setContent(html);
 const result=await prepareFixture(page,data);
 assert.equal(result.status,'awaiting_user_review');
 assert.equal(await page.locator('body').getAttribute('data-submitted'),null);
 await page.setContent(html+'<table><tr aria-label="기존 신청"><td>가상 중복</td></tr></table>');
 await assert.rejects(prepareFixture(page,data),/DUPLICATE/);
 await page.setContent('<main>변경된 화면</main>');
 await assert.rejects(prepareFixture(page,data),/UNVERIFIED_SCREEN/);
 } finally {await browser.close();}
});
