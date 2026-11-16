# 교원 행정업무 자동화 — 1단계

현재는 Linux 클라우드의 가상 복무 화면에서 입력·검증하는 기반 구현입니다. Windows PC 및 실제 NEIS 연결, 개인결재선 조회, 최종 상신, 실제 신청 중복 조회는 아직 구현하지 않았습니다. 다른 세 업무는 Skill 골격만 있습니다. 별도 사용자용 앱은 없습니다.

## 구조
Codex 자연어 해석 → `.agents/skills/neis-leave/SKILL.md` → 필수값 질문 → `src/leave.mjs` 검증 → 검증된 화면 어댑터 → 입력 재확인 → 사용자 승인 → 상신 결과 확인.
현재 구현은 가상 화면 입력 재확인까지입니다. 실제 어댑터는 명시적으로 실패합니다. 승인과 제출의 결합은 실제 화면을 확인한 후 구현해야 합니다.

## 현재 실행
저장소 루트에서 `npm run doctor`로 설치 상태를 확인합니다.
현재 클라우드는 Node 24.22.1, Playwright 1.62.1, 시스템 Chromium을 이미 제공합니다.
Linux 검증: `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium npm test`.
가상 화면은 테스트 내부에서만 생성합니다. 인증정보, 브라우저 프로필, 화면 캡처를 보관하지 않습니다.

## Windows로 이어서 진행
Windows의 Codex에서 이 저장소를 열고 `node --version`, `npm --version`, `codex --version`, `npm run doctor`를 실행하여 중복 설치 여부를 확인합니다. 저장소의 `.agents/skills/<name>/SKILL.md`를 이용하는 프로젝트 Skill 구조입니다. 현재 Codex 세션에서 자동 발견 여부는 검증하지 않았습니다.
Playwright가 없으면 사용자 승인 후 안정 버전을 개발 의존성으로 설치하고 lockfile을 생성합니다. 현재 npm 공식 레지스트리의 latest는 1.65.1이며 Node >=20을 요구합니다. 실제 설치 시 공식 문서와 버전을 재확인합니다. 설치는 아직 수행하지 않았습니다.
브라우저 설치 역시 기존 Edge/Chrome 사용 가능성을 확인한 뒤 별도 승인합니다. EVPN·공동인증서·보안프로그램 및 로그인은 사용자가 수행합니다. 비밀번호나 인증서 암호를 입력 파일에 저장하지 않습니다.

## 다음 검증
기관에서 자동화를 허용하는 Windows 환경에서 가상 또는 시험 계정으로 실제 복무 화면과 프레임, 팝업, 개인결재선, 조회 범위를 확인해야 합니다. 실제 입력은 DOM이 아니라 서버에 즉시 반영될 수도 있어 화면 조사와 쓰기 동작을 구분합니다. 상신 직전 내용과 결재자를 보여 주고 사용자 승인을 받습니다. 상신 후 접수번호·상태를 재조회하며 결과가 불명확하면 자동 재시도하지 않습니다.
화면 변경 시 선택자와 실제 필드 의미를 다시 확인하고 가상 테스트 및 시험 환경 테스트를 수행합니다. 스크린샷·trace는 기본 비활성화하고 필요 시 비식별 자료만 사용합니다.

공식 참고: https://developers.openai.com/codex/skills , https://playwright.dev/docs/intro , https://playwright.dev/docs/browsers . 현재 클라우드에서 문서 HTTPS 열람이 실패하여 최신 문서 본문 확인은 보류했습니다. 공식 npm 레지스트리 조회는 성공했습니다.
