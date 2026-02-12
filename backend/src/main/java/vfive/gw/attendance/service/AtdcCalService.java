package vfive.gw.attendance.service;

import java.util.List;

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
	
	public List<AtdcDTO> execute(HttpServletRequest request, HttpServletResponse response) {
		String yearMonth = request.getParameter("yearMonth");
		int empId = Integer.parseInt(request.getParameter("empId"));
		if (yearMonth == null || yearMonth.isEmpty()) {
      yearMonth = java.time.LocalDate.now().toString().substring(0, 7);
		}
		
		return mapper.selectAtdcHistory(empId, yearMonth);
	}
	
	
	
}
