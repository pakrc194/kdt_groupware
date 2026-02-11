package vfive.gw.login.controller;

import java.util.HashMap;
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
import vfive.gw.login.service.FindPasswordService;

@RestController
@RequestMapping("/gw/login")
public class LoginController {
	private final JwtUtil jwtUtil;
	
	public LoginController(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Resource
	private FindPasswordService findPasswordService;
	
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
			if(res.getEmpAcntStts().equals("초기")) {
				res.setLogChk("NewEmp");
				return res;
			}
			if(res.getEmpAcntStts().equals("RETIRED") || res.getEmpAcntStts() == "RETIRED") {
				res.setLogChk("Fail");
				return res;
			}
			res.setLogChk("Success");
			return res;
		} else {
			res = new LoginResponse();
			res.setLogChk("Fail");
		}
		return res;
	}
	
	@PostMapping("newEmp")
	Map<String, Object> newEmp(@RequestBody LoginRequest req) {
		
		int result = mapper.updateNewEmp(req);
		
		Map<String, Object> response = new HashMap<>();
    response.put("success", result > 0);
    return response;
	}
	
	@PostMapping("send-code")
	Map<String, Object> findPwdSendCode(@RequestBody LoginRequest req) {
		
		return findPasswordService.sendAuthCodeIfValid(req);
	}
	
	@PostMapping("reset")
	Map<String, Object> resetPassword(@RequestBody LoginRequest req) {
		
		boolean success = findPasswordService.resetPassword(req);
    return Map.of("success", success);
	}
	
	@RequestMapping("/hello")
	Object hello(Authentication authentication) {
		//System.out.println("hello 진입 "+authentication.getName());
		return Map.of("Hello",authentication.getName());
	}
}
