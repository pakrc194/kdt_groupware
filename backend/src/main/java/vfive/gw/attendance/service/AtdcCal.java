package vfive.gw.attendance.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class AtdcCal implements AtdcAction {
	
	@Resource
	AtdcMapper mapper;
	
	@Override
	public Object execute(HttpServletRequest request, HttpServletResponse response) {
		String yearMonth = request.getParameter("yearMonth");
		if (yearMonth == null || yearMonth.isEmpty()) {
      yearMonth = java.time.LocalDate.now().toString().substring(0, 7);
  }
		
		return mapper.myAtdcMon(2, yearMonth);
	}
	
	
	
}
