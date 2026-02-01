package vfive.gw.main.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.main.dto.EmpPrvc;
import vfive.gw.main.mapper.MainMapper;

@RestController
@RequestMapping("/gw/main")
public class MainController {
	@Resource
	MainMapper mapper;
	
	@RequestMapping
	EmpPrvc emp() {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpNo(1);
		
		return mapper.empPrvc(emp);
	}
}
