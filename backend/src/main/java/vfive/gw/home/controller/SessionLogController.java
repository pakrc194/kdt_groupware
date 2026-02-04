package vfive.gw.home.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.LoginMapper;

@RestController
@RequestMapping("/Login")
@CrossOrigin(origins = "http://192.168.0.36:3000")
public class SessionLogController {
	
	@Autowired
	private LoginMapper loginMapper;
	
	@PostMapping("/LoginMain")
	public String logmain(@RequestBody EmpPrvc vo , HttpSession session) {
		
		
		
		EmpPrvc dbemp = loginMapper.loginSelect(vo.getEmpSn(),vo.getEmpPswd());
		
		if(dbemp!= null) {
			session.setAttribute("empId", dbemp);
			return "성공";
		}else {
		}
		return "실패";
		
	}

}

