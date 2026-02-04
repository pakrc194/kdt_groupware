package vfive.gw.attendance.controller;

import java.util.List;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.dto.AtdcCalDTO;
import vfive.gw.attendance.dto.MyAtdcStatDTO;
import vfive.gw.attendance.service.AtdcCal;
import vfive.gw.attendance.service.MyAtdcStat;

@RestController
@RequestMapping("/gw/atdc")
public class AttendacneController {
	
	@Resource
	private AtdcCal atdcCal;
	
	@Resource
	private MyAtdcStat myAtdcStat;
	
	// 근태 관리 캘린더 (메인)
	@GetMapping("atdcCal")
	List<AtdcCalDTO> atdcCal(HttpServletRequest request, HttpServletResponse response) {
		List<AtdcCalDTO> res = atdcCal.execute(request, response);
		return res;
	}
	
	// 개인 근태 통계
	@GetMapping("myAtSt")
	MyAtdcStatDTO myAtdcStat(HttpServletRequest request, HttpServletResponse response) {
		MyAtdcStatDTO res = myAtdcStat.execute(request, response);
		
		return res;
	}
	
	
}
