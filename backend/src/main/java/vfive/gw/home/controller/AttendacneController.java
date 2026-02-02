package vfive.gw.home.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.Attendance;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.AttendanceMapper;
import vfive.gw.home.mapper.HomeMapper;

@RestController
@RequestMapping("/gw/atdc")
public class AttendacneController {
	@Resource
	AttendanceMapper mapper;
	
	@GetMapping("myAtdc")
	List<Attendance> myAttendance() {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(1);
		
		return mapper.myAttendance(emp);
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
