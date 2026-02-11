package vfive.gw.login.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;
import vfive.gw.login.mapper.LoginMapper;

@Service
public class ClkInService {

	@Resource
	private LoginMapper mapper;
	
	@Transactional
	public void loginClkIn(LoginResponse res) {
		int result = mapper.updateClkIn(res);
		
	if (result > 0) {
    System.out.println("사원 : [" + res.getEmpNm() + "] : 금일 출근 처리 완료");
  } else {
    // 이미 출근했거나, 오늘자 근태 데이터(ABSENT)가 미리 생성되지 않은 경우
    System.out.println("사원 : [" + res.getEmpNm() + "] : 이미 출근 기록 있음");
  }
		
	}
	
	
	
}
