package vfive.gw.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;
import vfive.gw.attendance.service.DutySkedDetailService;
import vfive.gw.attendance.service.DutySkedListService;
import vfive.gw.attendance.service.DutySkedViewService;
import vfive.gw.home.controller.HomeController;

@RestController
@RequestMapping("/gw/duty")
public class DutyController {
	
	@Resource
	DutySkedListService dutySkedListService;
	
	@Resource
	DutySkedDetailService dutySkedDetailService;
	
	@Resource
	DutySkedViewService dutySkedViewService;

	// 근무표 리스트
	@GetMapping("list")
	List<DutySkedListDTO> list(EmpAtdcRequestDTO req) {
		
		List<DutySkedListDTO> res = dutySkedListService.execute(req); 
		
		return res;
	}
	
	// 근무표 상세(수정포함)
	@GetMapping("detail")
	Map<String, Object> detail(DutyRequestDTO req) {
		Map<String, Object> res = dutySkedDetailService.execute(req);
		System.out.println("duty/detail 들어옴");
		
		return res;
	}
	
	@GetMapping("insertForm")
	List<EmpDTO> insertForm(DutyRequestDTO req) {
		
//		List<EmpDTO> res = 
		
		return null;
	}
	
	// 근무표 조회(팀원)
	@GetMapping("view")
	Map<String, Object> view(DutyRequestDTO req) {
		
		Map<String, Object> res = dutySkedViewService.execute(req);
		
		return res;
	}
	
}
