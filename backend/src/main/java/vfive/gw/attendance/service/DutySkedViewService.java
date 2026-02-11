package vfive.gw.attendance.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedDetailDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedViewService {
	
	@Resource
	private DutyMapper mapper;
	
	public Map<String, Object> execute(DutyRequestDTO req) {
		
		Map<String, Object> res = new HashMap<>();
		
		DutySkedListDTO master = mapper.selectConfirmedMasterByDept(req);
		
		
		if(master == null) {
			System.out.println("null 인가?");
			return null;
		}
		
		req.setDutyId(master.getDutyId());
		List<DutySkedDetailDTO> details = mapper.selectDutySkedDetailList(req);
		
		res.put("master", master);
		res.put("details", details);
		
		return res;
		
	}
	
	

}
