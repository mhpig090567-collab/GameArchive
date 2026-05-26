# TODO.md

> 기준 문서: `Agent/AI/PLAN.md` (2026-05-26)
> 브랜치: `feature/main-page`

---

## Step 1. 프로젝트 기반 설정

- [x] Git 브랜치 생성 (`feature/main-page`)
- [x] 디렉토리 구조 생성 (`css/`, `js/`, `data/`, `assets/images/`)
- [x] `data/games.json` — 샘플 게임 메타데이터 작성 (8개)
- [x] `index.html` — 생성
- [x] `css/style.css` — 생성
- [x] `js/main.js` — 생성
- [x] 검증: `git status`로 파일 확인

## Step 2. CSS 디자인 시스템 구축

- [x] CSS Reset / Box-sizing 정의
- [x] CSS Custom Properties 정의 (색상, 폰트, 간격, 반응형 브레이크포인트)
- [x] Google Fonts (Inter) 로드 설정
- [x] 기본 body 스타일 (다크 배경, 기본 타이포그래피)
- [x] 유틸리티 클래스 (container, sr-only 등)
- [x] 검증: 브라우저에서 다크 배경 + Inter 폰트 적용 확인

## Step 3. HTML 구조 작성

- [x] `<head>` — meta, title, favicon, CSS/Font 링크
- [x] `<header>` — 로고, 내비게이션 탭, 검색 바, 프로필 영역
- [x] `<section id="hero">` — 히어로 배너 슬라이더 구조
- [x] `<section id="categories">` — 카테고리 필터 버튼 목록
- [x] `<section id="games">` — 게임 카드 그리드 컨테이너
- [x] `<footer>` — 저작권, 소셜 링크
- [x] 검증: 정적 HTML이 시맨틱하게 렌더링되는지 확인

## Step 4. CSS 컴포넌트 스타일링

- [x] Header — Sticky 고정, Glassmorphism 배경, 로고/탭/검색 레이아웃
- [x] Hero Section — 풀 와이드 배너, 그래디언트 오버레이, CTA 버튼
- [x] 카테고리 필터 바 — 수평 스크롤, pill 버튼, 활성 상태 글로우
- [x] 게임 카드 — 썸네일 비율, Glassmorphism 카드, 호버 확대/글로우 애니메이션
- [x] 게임 그리드 — CSS Grid 반응형 (1열→2열→4열)
- [x] Footer — 레이아웃, 링크 스타일
- [x] 페이지 진입 애니메이션 — fade-in + slide-up keyframes
- [x] 검증: 데스크톱/모바일 뷰 정상 표시, 호버 애니메이션 동작

## Step 5. JavaScript 동적 기능 구현

- [x] `games.json` fetch → 게임 카드 동적 렌더링
- [x] 카테고리 필터 클릭 → 게임 목록 필터링 (활성 카테고리 토글)
- [x] 히어로 배너 자동 슬라이드 (5초 간격, 수동 전환 버튼)
- [x] 페이지 진입 시 카드 순차 애니메이션 (stagger delay)
- [x] 검색 바 입력 → 게임명 실시간 필터링
- [x] 검증: 필터, 슬라이더, 검색, 카드 애니메이션 모두 정상 동작

## Step 6. 게임 썸네일 이미지 생성 및 최종 통합

- [x] generate_image로 게임 썸네일 이미지 8개 생성
- [x] `assets/images/`에 이미지 배치 및 games.json 경로 연결
- [/] 전체 통합 테스트: 탐색 → 필터 → 호버 → 클릭 플로우
- [ ] 검증: 모든 이미지 정상 로드, 전체 플로우 동작 확인

---

## 최종 단계 (B-6)

- [ ] `Agent/Project/REPORT.md` 작성
- [ ] Git commit (모든 변경사항)
- [ ] 사용자 평가 요청
