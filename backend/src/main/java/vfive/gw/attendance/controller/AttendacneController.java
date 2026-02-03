package vfive.gw.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.dto.AtdcCal;
import vfive.gw.attendance.dto.AtdcPageInfo;
import vfive.gw.attendance.mapper.AtdcMapper;
import vfive.gw.attendance.provider.AtdcProvider;
import vfive.gw.attendance.service.AtdcAction;

@RestController
@RequestMapping("/gw/atdc/{service}")
public class AttendacneController {
	@Resource
	AtdcProvider provider;
	
	@GetMapping("")
	Object list(AtdcPageInfo pageInfo,
			HttpServletRequest request, HttpServletResponse response) {
		Object res = provider.getContext().getBean(pageInfo.getService(), AtdcAction.class).execute(request, response);
		
		return res;
	}
	
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
