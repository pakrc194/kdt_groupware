package vfive.gw.home.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.HomeMapper;

@Service
public class GetUserProfileService {

	@Resource
	private HomeMapper mapper;
	
	public EmpPrvc execute(int empId) {
		return mapper.selectUserProfileByEmpId(empId);
	}
	
}
