# kdt_groupware


## 초기 설정
### clone 은 vscode에서 프로젝트 폴더 지정해서 뜨기
### spring 은 다른 workspace 설정후에 new - file - import - new gradle project? 로 프로젝트 폴더내  backend 폴더 선택
### git에 올릴 땐 스프링 서버, 리액트 서버 꼭 끄고 vscode에서 push하면됨! (backend 코드수정도 vscode에서 인식해서 알아서해줌)

## 사용전에 확인해야할 사항

### 리액트
### > fecth 주소 : 백엔드 주소

### 스프링
### > vfive.gw.config 하위 CorsConfig.java에서 본인 리액트 주소 추가
### > application.yml 에서 강의실이 아니라면 db주소 외부로 설정


### 정상 연결 확인
### 스프링 : 백엔드 주소/gw/main 
### 리액트 : 프론트엔드 주소/gw/main/aaa
### 두 값이 일치하면 정상 연결됨

#### api 확인
#### swagger url  : http://localhost/swagger-ui/index.html#/