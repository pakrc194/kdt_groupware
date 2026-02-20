package vfive.gw.home.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
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
import vfive.gw.home.service.UpdateEmpProfService;

@RestController
@RequestMapping("/gw/home")
public class HomeController {

	@Resource
	GetUserProfileService getUserProfileService;
	
	@Resource
	GetModFormService getModFormService;
	
	@Resource
	GetMyDashService getMyDashService;
	
	@Resource
	UpdateEmpProfService updateEmpProfService;
	
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
		
		return getMyDashService.execute(req);
	}
	
	@PostMapping("updateProf")
	void updateProf(@ModelAttribute EmpPrvc req) {
		updateEmpProfService.updateProfile(req);
	}
	
}
