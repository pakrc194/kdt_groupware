package vfive.gw.home.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.HomeMapper;

@Service
public class UpdateEmpProfService {

	@Resource
	private HomeMapper mapper;
	
	@Transactional
	public void updateProfile(EmpPrvc req) {
		
		int res = mapper.updateEmployeeProfile(req);
		
		if(res == 0) {
			throw new RuntimeException("수정 실패");
		}
		
		
	}
	
	
}
