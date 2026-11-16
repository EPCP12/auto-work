# 검증 결과

Linux 클라우드, Node 24.22.1, 기존 Playwright 1.62.1, 시스템 Chromium 156.
`PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium npm test`: 4 passed, 0 failed, 0 skipped.

- 필수값·날짜·시간 오류 차단
- Asia/Seoul 날짜 경계
- 미검증 실제 서비스 어댑터 차단
- 가상 브라우저 입력 후 필드 재확인, 상신하지 않음, 기존 신청 표시 및 화면 변경 시 차단

초기 가상 화면 select 레이블 오류를 수정하고 재실행하여 통과했습니다.
실제 NEIS, Windows, EVPN, 개인결재선 조회, 서버 중복 검사, 승인 후 상신, K-에듀파인은 미검증·미구현입니다. 가상 중복 표시는 실제 서버 중복 검사 구현이 아닙니다.
