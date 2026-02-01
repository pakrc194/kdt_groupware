package vfive.gw.home.controller;

import org.springframework.web.bind.annotation.GetMapping;
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
	
	@GetMapping
	EmpPrvc emp() {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpNo(1);
		
		return mapper.empPrvc(emp);
	}
}
