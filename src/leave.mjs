// No network, credentials or sensitive logging in the validation layer.
export function validateLeave(input) {
  const keys=['type','date','start','end','reason','approvalLine'];
  if (!input || keys.some(k=>typeof input[k]!=='string'||!input[k].trim())) throw Error('MISSING_FIELDS');
  if (!['조퇴','외출','출장'].includes(input.type)) throw Error('UNSUPPORTED_TYPE');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || !Number.isFinite(Date.parse(input.date)) || new Date(input.date).toISOString().slice(0,10)!==input.date) throw Error('INVALID_DATE');
  for (const t of [input.start,input.end]) if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) throw Error('INVALID_TIME');
  if(input.start>=input.end) throw Error('INVALID_INTERVAL');
  return Object.fromEntries(keys.map(k=>[k,input[k].trim()]));
}
export function koreaToday(now=new Date()) {
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
// Deliberately restricted to the synthetic fixture. Never guess live NEIS selectors.
export async function prepareFixture(page, input) {
  const data=validateLeave(input);
  if(await page.locator('[data-fixture="neis-leave-v1"]').count()!==1) throw Error('UNVERIFIED_SCREEN');
  if(await page.getByRole('row',{name:'기존 신청'}).count()) throw Error('DUPLICATE_REQUIRES_REVIEW');
  const labels={type:'복무 종류',date:'신청일',start:'시작 시간',end:'종료 시간',reason:'사유',approvalLine:'개인결재선'};
  for(const [key,label] of Object.entries(labels)) {
    const field=page.getByLabel(label,{exact:true});
    if(key==='type'||key==='approvalLine') await field.selectOption({label:data[key]});
    else await field.fill(data[key]);
    if(await field.inputValue()!==data[key]) throw Error('READBACK_MISMATCH');
  }
  return {status:'awaiting_user_review',data,submitted:false};
}
export async function prepareLive() {
  throw Error('LIVE_ADAPTER_NOT_VERIFIED: Windows 로그인 및 실제 화면 확인 필요');
}
