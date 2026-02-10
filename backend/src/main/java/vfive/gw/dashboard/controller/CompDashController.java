package vfive.gw.dashboard.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.dto.request.CompHRDTO;
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
		System.out.println("인사변동");
		return res;
	}
	
	@GetMapping("hrHistList")
	List<HRChangeHistDTO> hrHistList() {
		List<HRChangeHistDTO> res = mapper.hrHistList();
		System.out.println("승진, 팀이동 "+res);
		return res;
	}
	
}
