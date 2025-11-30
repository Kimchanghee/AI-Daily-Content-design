# 보험사 데일리 메시지

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/k931103-1667s-projects/v0-saa-s-landing-page-9x)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/tKHXwT4ZMDr)

## Overview

보험사 고객에게 최신 뉴스를 전달하는 데일리 메시지 서비스입니다. 
네이버 뉴스를 자동으로 스크랩하고 다양한 템플릿으로 제공합니다.

## 환경 변수 설정 (필수)

프로젝트를 실행하기 전에 다음 환경 변수를 설정해야 합니다:

### Gemini API Key 설정

1. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 Gemini API Key를 발급받으세요
2. v0 채팅창 왼쪽의 **Vars** 섹션을 열어주세요
3. 다음 환경 변수를 추가하세요:

\`\`\`
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

또는 Vercel 대시보드에서:
1. 프로젝트 Settings → Environment Variables로 이동
2. `GEMINI_API_KEY` 추가
3. 프로젝트 재배포

## 주요 기능

- 네이버 뉴스 자동 스크랩 (정치, 경제, 사회, 생활/문화, IT/과학, 세계)
- 오전 9시 ~ 오후 11:59분 사이 1시간마다 자동 업데이트
- 3가지 템플릿 선택 (클래식, 모던, 프리미엄)
- 미리보기 및 이미지 다운로드
- 모바일 최적화 (반응형 디자인)

## Deployment

Your project is live at:

**[https://vercel.com/k931103-1667s-projects/v0-saa-s-landing-page-9x](https://vercel.com/k931103-1667s-projects/v0-saa-s-landing-page-9x)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/tKHXwT4ZMDr](https://v0.app/chat/tKHXwT4ZMDr)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
