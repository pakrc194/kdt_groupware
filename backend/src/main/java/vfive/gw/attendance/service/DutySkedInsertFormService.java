package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedInsertFormService {
	
	@Resource
	DutyMapper mapper;
	
	public List<EmpDTO> execute(EmpAtdcRequestDTO req){
		
		return null;
	}
	
	
}
