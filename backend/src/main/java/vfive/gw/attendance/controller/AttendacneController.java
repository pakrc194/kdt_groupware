package vfive.gw.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.dto.domain.AtdcDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.EmpAtdcDetailDTO;
import vfive.gw.attendance.dto.response.EmpAtdcListDTO;
import vfive.gw.attendance.dto.response.MyAtdcStatDTO;
import vfive.gw.attendance.service.AtdcCalService;
import vfive.gw.attendance.service.ClkOutService;
import vfive.gw.attendance.service.DeptAtdcStatusService;
import vfive.gw.attendance.service.EmpAtdcDetailService;
import vfive.gw.attendance.service.EmpAtdcListService;
import vfive.gw.attendance.service.MyAtdcStatService;
import vfive.gw.home.controller.HomeController;

@RestController
@RequestMapping("/gw/atdc")
public class AttendacneController {
	
	@Resource
	private AtdcCalService atdcCal;
	
	@Resource
	private MyAtdcStatService myAtdcStat;
	
	@Resource
	private EmpAtdcListService empAtdcList;
	
	@Resource
	private EmpAtdcDetailService empAtdcDetail;
	
	@Resource
	private ClkOutService clkOutService;
	
	@Resource
	private DeptAtdcStatusService deptAtdcStatusService;

	// 근태 관리 캘린더 (메인)
	@GetMapping("atdcCal")
	List<AtdcDTO> atdcCal(HttpServletRequest request, HttpServletResponse response) {
		List<AtdcDTO> res = atdcCal.execute(request, response);
		return res;
	}
	
	// 개인 근태 통계
	@GetMapping("myAtSt")
	MyAtdcStatDTO myAtdcStat(HttpServletRequest request, HttpServletResponse response) {
		MyAtdcStatDTO res = myAtdcStat.execute(request, response);
		
		return res;
	}
	
	// 사원 근태 리스트
	@GetMapping("empAtdcList")
	List<EmpAtdcListDTO> empAtdcList(EmpAtdcRequestDTO req) {
		List<EmpAtdcListDTO> res = empAtdcList.execute(req);
		
		return res;
	}
	
	// 사원 근태 상세
	@GetMapping("empAtdcList/detail")
	List<EmpAtdcDetailDTO> empAtdcDetail(EmpAtdcRequestDTO req) {
		List<EmpAtdcDetailDTO> res = empAtdcDetail.execute(req);
		System.out.println(req);
		System.out.println(res);
		
		return res;
	}
	
	@PostMapping("clkOut")
	public Map<String, Object> clockOut(@RequestBody EmpAtdcRequestDTO req) {
    boolean isSuccess = clkOutService.processClkOut(req);
    
    return Map.of(
        "success", isSuccess,
        "message", isSuccess ? "퇴근 처리가 완료되었습니다." : "이미 퇴근 기록이 있습니다."
    );
	}
	
	@GetMapping("deptStatus")
	public List<Map<String, Object>> getDeptEmpStatus(EmpAtdcRequestDTO req) {
		System.out.println(deptAtdcStatusService.getDeptAtdcStatus(req));
    return deptAtdcStatusService.getDeptAtdcStatus(req);
}
	

	
	
	
}
