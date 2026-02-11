package vfive.gw.dashboard.controller;

import java.util.Date;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.dto.request.CompHRDTO;
import vfive.gw.dashboard.dto.request.CompSchedDTO;
import vfive.gw.dashboard.dto.request.DashDTO;
import vfive.gw.dashboard.dto.request.DashSchedDashDTO;
import vfive.gw.dashboard.dto.request.DocPrcsTimeDTO;
import vfive.gw.dashboard.dto.request.AccessDeleteDTO;
import vfive.gw.dashboard.dto.request.AprvPrcsDTO;
import vfive.gw.dashboard.mapper.CompDashMapper;
import vfive.gw.orgchart.dto.HRChangeHistDTO;

@RestController
@RequestMapping("/gw/dashboard")
public class CompDashController {
	@Resource
	CompDashMapper mapper;
	
	@GetMapping("hrEmpList")
	List<CompHRDTO> hrEmpList() {
		List<CompHRDTO> res = mapper.hrEmpList();
//		System.out.println("인사변동");
		return res;
	}
	
	@GetMapping("hrHistList")
	List<HRChangeHistDTO> hrHistList() {
		List<HRChangeHistDTO> res = mapper.hrHistList();
//		System.out.println("승진, 팀이동 "+res);
		return res;
	}
	
	// 권한 삭제 이력
	@GetMapping("accessDelete")
	List<AccessDeleteDTO> accessDeleteList() {
		List<AccessDeleteDTO> res = mapper.accessDeleteList();
		System.out.println("권한 삭제 이력 "+res);
		return res;
	}
	
	// 일정 삭제 기록
	@GetMapping("deleteSchedLog")
	List<CompSchedDTO> schedList() {
		List<CompSchedDTO> res = mapper.schedList();
//		System.out.println("일정 삭제 기록 "+res);
		return res;
	}
	
	// 결재 처리 이력
	@GetMapping("aprvPrcs")
	List<AprvPrcsDTO> aprvPrcsList() {
		List<AprvPrcsDTO> res = mapper.aprvPrcsList();
		System.out.println("결재처리 : "+res);
		return res;
	}
	
	// 팀 인원
	@GetMapping("dashTeamEmpList")
	List<DashDTO> hrTeamEmpList(
			@RequestParam("dept") int dept,
			@RequestParam("date") String date
			) {
		List<DashDTO> res = mapper.dashTeamEmpList(dept, date);
		return res;
	}
	
	// 팀 일정
	@GetMapping("dashTeamSchedList")
	List<DashSchedDashDTO> dastTeamSchedList(@RequestParam("dept") String dept) {
		List<DashSchedDashDTO> res = mapper.dashTeamSchedList(dept);
		return res;
	}
	
	// 결재 처리 속도
	@GetMapping("docPrcsTime")
	List<DocPrcsTimeDTO> docPrcsTime(@RequestParam("dept") String dept) {
		List<DocPrcsTimeDTO> res = mapper.docPrcsTime(dept);
		return res;
	}
	
}
