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
        System.out.println("서버가 시작되었습니다. 미등록 데이터를 체크합니다.");
        int cnt = mapper.insertAtdcHistData();
        System.out.println("근태 "+cnt+"개 데이터 등록 완료");
    }
}
