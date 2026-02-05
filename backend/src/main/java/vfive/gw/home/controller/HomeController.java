package vfive.gw.home.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vfive.gw.BackendApplication;
import jakarta.annotation.Resource;
import vfive.gw.home.mapper.HomeMapper;

@RestController
@RequestMapping("/gw/home/{service}")
public class HomeController {

    private final BackendApplication backendApplication;
	@Resource
	HomeMapper mapper;

    HomeController(BackendApplication backendApplication) {
        this.backendApplication = backendApplication;
    }
	
//	@GetMapping
//	EmpPrvc emp() {
//		EmpPrvc emp = new EmpPrvc();
//		emp.setEmpId(1);
//		
//		return mapper.empPrvc(emp);
//	}
	
	@GetMapping
	String home(
	    @PathVariable("service") String service
	) {
		System.out.println("서비스 접근");
	    return "service = " + service;
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
