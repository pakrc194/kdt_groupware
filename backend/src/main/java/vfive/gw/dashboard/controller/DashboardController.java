package vfive.gw.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.di.AccessEmpowerList;
import vfive.gw.dashboard.di.AccessList;
import vfive.gw.dashboard.dto.response.AddAccessEmpower;
import vfive.gw.dashboard.mapper.AddAccessEmpowerMapper;
import vfive.gw.dashboard.provider.DashboardProvider;

@RestController
@RequestMapping("/gw/dashboard")
public class DashboardController {    
	@Resource
	DashboardProvider provider;
	
	@GetMapping("accessEmpowerList")
	Object empowerlist() {
		return provider.getContext().getBean(AccessEmpowerList.class).execute();
	}
	
	@GetMapping("accessList")
	Object accesslist(
			@RequestParam("type") String type
			) {
		System.out.println("권한 리스트");
		return provider.getContext().getBean(AccessList.class).execute(type);
	}
	
	@Resource
	AddAccessEmpowerMapper empowerMapper;
	
	@PostMapping("/addAccess")
	Object addAccess(@RequestBody AddAccessEmpower aae) {
		System.out.println("권한 추가 "+aae);
		return empowerMapper.addAccessEmpower(aae);
//		return 0;
	}
}
