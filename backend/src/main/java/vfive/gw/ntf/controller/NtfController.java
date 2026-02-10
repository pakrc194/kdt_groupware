package vfive.gw.ntf.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.ntf.mapper.NtfMapper;

@RestController
@RequestMapping("/gw/ntf")
public class NtfController {
	@Resource
	NtfMapper mapper;
	
	@GetMapping("polling")
	int polling(int empId) {
		return mapper.polling(empId);
	}
}
