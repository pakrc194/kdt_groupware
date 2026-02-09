package vfive.gw.home.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.HomeMapper;

@Service
public class GetModFormService {

	@Resource
	private HomeMapper mapper;
	
	public EmpPrvc execute(EmpPrvc req) {
		return mapper.selectModFormByEmpId(req);
	}
	
}
