package vfive.gw.attendance.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.dto.domain.AtdcDTO;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class AtdcCalService {
	
	@Resource
	AtdcMapper mapper;
	
	public Map<String, Object> execute(HttpServletRequest request, HttpServletResponse response) {
		String yearMonth = request.getParameter("yearMonth");
		int empId = Integer.parseInt(request.getParameter("empId"));
		if (yearMonth == null || yearMonth.isEmpty()) {
      yearMonth = java.time.LocalDate.now().toString().substring(0, 7);
		}
		
		Map<String, Object> result = new HashMap<>();
		List<AtdcDTO> atdcList = mapper.selectAtdcHistory(empId, yearMonth);
		List<Map<String, Object>> dutyList = mapper.selectMyDuty(empId, yearMonth.replace("-", ""));
		
		result.put("atdcList", atdcList);
		result.put("dutyList", dutyList);
		
		return result;
	}
	
	
	
}
