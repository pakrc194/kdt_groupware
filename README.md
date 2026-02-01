# kdt_groupware


## 1. 초기 설정
### clone 은 vscode에서 프로젝트 폴더 지정해서 뜨기
### 각 폴더마다 README.md 읽기바람~
#### 폴더구조 피드백 환영. 저도 잘 모름

## 2. spring 주의사항
#### 다른 workspace 선택 후에 new - file - import - new gradle project? 로 
#### clone 한 프로젝트 폴더 내 backend 폴더 선택

## 3. git 업로드 방법
#### git에 올릴 땐 스프링 서버, 리액트 서버 꼭 끄고 vscode에서 push하면됨! 
#### (backend 코드수정도 vscode에서 인식해서 알아서해줌)

## 4. 사용전에 확인해야할 사항

### 리액트
```
> .env.local 에 본인 백엔드 주소 기입후 .gitignore 에 .env.local 한 줄 추가
```

### 스프링
```
> vfive.gw.config 하위 CorsConfig.java에서 본인 리액트 주소 추가
> application.yml 에서 강의실이 아니라면 db주소 외부로 설정
```

## 5. 정상 연결 확인법
### 스프링 : 백엔드 주소/gw/home/1 정상 데이터 출력
### 리액트 : 프론트엔드 주소 이동시 스프링과 일치한 데이터 나오는지 확인

## 6. 등록된 api 확인
#### api 확인(sping 서버 실행 必)
#### swagger url  : http://localhost:8080/swagger-ui/index.html#/