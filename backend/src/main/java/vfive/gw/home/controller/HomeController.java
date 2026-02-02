package vfive.gw.home.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
		return mapper.empList();
	}
	
	@GetMapping("detail/{id}")
	EmpPrvc emp(@PathVariable("id") int id) {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return mapper.empPrvc(emp);
	}
	
	@GetMapping("teamList/{code}")
	List<EmpPrvc> empTeam(@PathVariable("code") String code) {
		System.out.println(code);
		EmpPrvc emp = new EmpPrvc();
		emp.setDeptCode(code);
		
		return mapper.empTeamList(emp);
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
