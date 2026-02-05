package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedListService {
	
	@Resource
	DutyMapper mapper;
	
	public List<DutySkedListDTO> execute(EmpAtdcRequestDTO req){
		
		return mapper.selectDutyScheListByDept(req);
	}

}
