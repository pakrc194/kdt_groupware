package vfive.gw.login.controller;

import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.global.config.JwtUtil;
import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;
import vfive.gw.login.mapper.LoginMapper;

@RestController
@RequestMapping("/gw/login")
public class LoginController {
	private final JwtUtil jwtUtil;
	
	public LoginController(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	
	
	
	@Resource
	LoginMapper mapper;
	
	@PostMapping
	Object login(@RequestBody LoginRequest req) {
		System.out.println(req);
		
		String token = jwtUtil.createToken(req.getEmpSn());
		LoginResponse res = mapper.login(req);
		System.out.println(res);
		
		if(res!=null) {
			res.setToken(token);
			res.setLogChk("Success");
			return res;
		} else {
			res = new LoginResponse();
			res.setLogChk("Fail");
		}
		return res;
	}
	
	
	@RequestMapping("/hello")
	Object hello(Authentication authentication) {
		System.out.println("hello 진입 "+authentication.getName());
		return Map.of("Hello ",authentication.getName());
	}
}
