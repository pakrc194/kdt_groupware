package vfive.gw.home.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.HomeMapper;

@RestController
@RequestMapping("/gw/home/{service}")
public class HomeController {
	@Resource
	HomeMapper mapper;
	
//	@GetMapping
//	EmpPrvc emp() {
//		EmpPrvc emp = new EmpPrvc();
//		emp.setEmpId(1);
//		
//		return mapper.empPrvc(emp);
//	}
	@GetMapping("list")
	List<EmpPrvc> emplist() {
		EmpPrvc emp = new EmpPrvc();
//		emp.setEmpId(1);
		
		return mapper.empList();
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
