package vfive.gw;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import vfive.gw.attendance.mapper.AtdcMapper;

@Component
public class AtdcDataInitializer implements CommandLineRunner {

    @Resource
    private AtdcMapper mapper;

    @Override
    public void run(String... args) throws Exception {
    	System.out.println("=== 서버 시작: 데이터 체크 실행 ===");

      // 근태 기본 데이터 체크 (오늘자 출근부 생성)
      int atdcCnt = mapper.insertAtdcHistData();
      System.out.println("> 금일 근태 기록 생성: " + atdcCnt + "건");

      // 연차 부여 체크 (올해 연차 기록이 없는 사원 대상)
      int leaveCnt = mapper.insertYearlyLeaveData();
      System.out.println("> 신규 연차 부여 완료: " + leaveCnt + "명 (기준 연도: " + java.time.LocalDate.now().getYear() + ")");
      
      // 신입 월차 부여 체크 (근속 1년 미만 사원 대상)
      int monthLeaveCnt = mapper.updateNewEmpLeave();
      System.out.println("> 신입 월차 부여 완료: " + monthLeaveCnt + "명 (기준 연도: " + java.time.LocalDate.now().getYear() + ")");
      
      System.out.println("=== 데이터 체크 완료 ===");
    }
}
