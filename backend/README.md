# 그릅웨어 프로젝트

#### swagger url  : http://localhost:8080/swagger-ui/index.html#/

## project structure
### spring
```text
vfive.gw/
 ├─ global/
 │   ├─ config/
 │   │   └─ CorsConfig.java  # CORS 허용 도메인/헤더/메서드 설정(환경별 분리 권장)
 │   ├─ exception/           # 공통 예외/에러코드/GlobalExceptionHandler(@RestControllerAdvice)
 │   └─ response/            # 공통 응답 포맷(ApiResponse), 페이징 응답 등
 │
 ├─ home/
 │   ├─ controller/          # API 엔드포인트(요청/응답만) — 비즈니스 로직 금지
 │   ├─ service/             # 비즈니스 로직/트랜잭션 경계(재사용의 중심)
 │   ├─ mapper/              # MyBatis @Mapper 인터페이스(SQL은 애노테이션로 관리)
 │   └─ dto/
 │       ├─ request/         # 요청 DTO(검증 어노테이션 @Valid/@NotNull 등 위치)
 │       └─ response/        # 응답 DTO(외부 노출 데이터만, DB 컬럼 그대로 노출 지양)
 │
 ├─ approval/
 │   ├─ controller/          # 결재 API(권한/역할 체크는 필터/시큐리티 or 서비스에서 정리)
 │   ├─ service/             # 결재 규칙(상신/승인/반려) 로직 + 트랜잭션 처리
 │   ├─ mapper/              # 결재 관련 DB 접근(쿼리 메서드 네이밍 규칙 통일)
 │   └─ dto/
 │       ├─ request/         # 상신/승인/반려 요청 DTO
 │       └─ response/        # 결재 문서/상태 응답 DTO
 │
 ├─ schedule/
 │   ├─ controller/          # 일정 CRUD API
 │   ├─ service/             # 일정 충돌/권한 등 핵심 규칙 처리
 │   ├─ mapper/              # 일정 조회/등록/수정/삭제 쿼리 인터페이스
 │   └─ dto/
 │       ├─ request/         # 일정 생성/수정 요청 DTO(시간/기간 검증 중요)
 │       └─ response/        # 일정 상세/목록 응답 DTO
 │
 ├─ attendance/
 │   ├─ controller/          # 출퇴근/근태 API
 │   ├─ service/             # 지각/조퇴/근무시간 계산 등 비즈니스 로직
 │   ├─ mapper/              # 근태 데이터 접근(집계 쿼리 늘어날 수 있음)
 │   └─ dto/
 │       ├─ request/         # 출근/퇴근/정정 요청 DTO
 │       └─ response/        # 근태 현황/집계 응답 DTO
 │
 ├─ board/
 │   ├─ controller/          # 게시판 API(검색/페이징/첨부가 있으면 분리 고려)
 │   ├─ service/             # 게시글/댓글/권한/공지 규칙 처리
 │   ├─ mapper/              # 게시판 쿼리(페이징/검색 조건 표준화)
 │   └─ dto/
 │       ├─ request/         # 글작성/수정/검색 요청 DTO
 │       └─ response/        # 글목록/상세 응답 DTO
 │
 ├─ orgchart/
 │   ├─ controller/          # 조직도 API(부서/직원 조회)
 │   ├─ service/             # 조직 트리 구성/필터링 로직
 │   ├─ mapper/              # 조직/사원 조회 쿼리(계층 쿼리 고려)
 │   └─ dto/
 │       ├─ request/         # 검색/필터 요청 DTO
 │       └─ response/        # 조직 트리/사원 정보 응답 DTO
 │
 └─ dashboard/
     ├─ controller/          # 대시보드 API(여러 도메인 데이터 조합)
     ├─ service/             # 집계/요약 로직(캐시/성능 고려 포인트)
     ├─ mapper/              # 대시보드용 조회 쿼리(복잡해지면 전용 쿼리 분리)
     └─ dto/
         ├─ request/         # 기간/조건 요청 DTO
         └─ response/        # 위젯별 응답 DTO(프론트 요구에 맞춘 형태)

resources/
 └─ application.yml          # 환경별 설정은 application-{profile}.yml로 분리 권장
```