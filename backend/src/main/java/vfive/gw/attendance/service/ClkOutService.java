package vfive.gw.attendance.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.mapper.AtdcMapper;
import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;
import vfive.gw.login.mapper.LoginMapper;

@Service
public class ClkOutService {

	@Resource
	private AtdcMapper mapper;
	
	@Transactional
	public boolean processClkOut(EmpAtdcRequestDTO req) {
		int result = mapper.updateClkOut(req);
		
	if (result > 0) {
    System.out.println("사원 : [" + req.getEmpNm() + "] : 금일 퇴근 처리 완료");
    return true;
  } else {
    // 이미 출근했거나, 오늘자 근태 데이터(ABSENT)가 미리 생성되지 않은 경우
    System.out.println("사원 : [" + req.getEmpNm() + "] : 이미 퇴근 기록 있음");
    return false;
  }
		
	}
	
	
	
}
