package vfive.gw.attendance.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedDetailService {
	@Resource
	private DutyMapper mapper;
	
	public Map<String, Object> execute(DutyRequestDTO req){
		
		Map<String, Object> res = new HashMap<>();
		
		res.put("master", mapper.selectDutySkedMaster(req));
		
		res.put("details", mapper.selectDutySkedDetailList(req));
		
		return res;
		
	}
	
}
