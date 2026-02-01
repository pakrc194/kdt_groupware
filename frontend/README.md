# 그릅웨어 프로젝트

### fecth 사용법
#### GET
```
fetcher('/gw/home/1').then(setEmpData);
```
#### POST 
```
fetcher('/gw/home/test', {
    method: 'POST',
    body: { test: 'ok' },
}).then(setEmpData)
```
#### Button / Modal 사용법
#### HomeMain.js에 모든 예제 작성해둠

#### .env.local 파일             # 본인 url 설정  - 한번 설정후 .gitignore에 .env.local 추가


#### api 확인 (spring 실행 必)
#### swagger url  : http://localhost:8080/swagger-ui/index.html#/

## project structure
### react
```text
src/
 ├─ app/
 │   ├─ routes/              # 라우터 정의
 │   └─ store/               # 전역 상태(zustand/redux 등)
 │
 ├─ shared/                  # 전역 공통 (⚠️ 여기 중요)
 │   ├─ api/
 │   │   └─ fetcher.js       # ✅ 공통 fetch 래퍼 (baseURL, 에러 처리)
 │   │
 │   ├─ components/          # 공통 UI 컴포넌트
 │   │   ├─ Button.js
 │   │   └─ Modal.js
 │   ├─ layout/              # 공통 레이아웃
 │   │   ├─ Layout.js        # 상단바, 사이드바
 │   └─  └─ sideConfig.js    # 사이드바 메뉴 구성
 ├─ features/                # 기능(도메인) 단위
 │   ├─ Home/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  # 사이드바 및 기능에 필요한 페이지들
 │   │   └─ components/      # 기능에 필요한 Modal 창 또는 각종 컴포넌트
 │   ├─ approval/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  
 │   │   └─ components/      
 │   ├─ schedule/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  
 │   │   └─ components/    
 │   ├─ attendance/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  
 │   │   └─ components/    
 │   ├─ board/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  
 │   │   └─ components/    
 │   ├─ orgchart/
 │   │   ├─ pages/
 │   │   │   └─ HomeMain.js  
 │   │   └─ components/    
 ├─  └─ dashboard/
 │       ├─ pages/
 │       │   └─ HomeMain.js  
 │       └─ components/    
 ├─ assets/                 # 이미지 폴더
 ├─ .env                    # 기본 포트번호 설정
 └─ .env.local              # 본인 url 설정  - 한번 설정후 .gitignore에 .env.local 추가