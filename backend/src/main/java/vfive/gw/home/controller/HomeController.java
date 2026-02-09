package vfive.gw.home.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.dto.request.MyDashResDTO;
import vfive.gw.home.service.GetModFormService;
import vfive.gw.home.service.GetMyDashService;
import vfive.gw.home.service.GetUserProfileService;

@RestController
@RequestMapping("/gw/home")
public class HomeController {

	@Resource
	GetUserProfileService getUserProfileService;
	
	@Resource
	GetModFormService getModFormService;
	
	@Resource
	GetMyDashService getMyDashService;

	
	@PostMapping("test")
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
	
	@GetMapping("myProf")
	EmpPrvc myProfile(EmpPrvc req) {
	    return getUserProfileService.execute(req);
	}
	
	@GetMapping("modProf")
	EmpPrvc modProfForm(EmpPrvc req) {
		
		return getModFormService.execute(req);
	}
	
	@GetMapping("myDash")
	Map<String, Object> MyDashBoard(MyDashResDTO req) {
		System.out.println("대시보드 컨트롤러");
		
		return getMyDashService.execute(req);
	}
	

}
