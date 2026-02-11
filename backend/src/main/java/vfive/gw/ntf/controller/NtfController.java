package vfive.gw.ntf.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.ntf.dto.NtfDto;
import vfive.gw.ntf.mapper.NtfMapper;

@RestController
@RequestMapping("/gw/ntf")
public class NtfController {
	@Resource
	NtfMapper mapper;
	
	@PostMapping("list")
	Object polling(@RequestBody NtfDto req) {
		return mapper.polling(req.getEmpId());
	}
	
	@PostMapping("read")
	Object read(@RequestBody NtfDto req) {
		System.out.println("read "+req);
		String now = LocalDateTime.now()
		        .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

		return mapper.markRead(req.getNtfId(), req.getEmpId(), now);
	}
	
	@PostMapping("delete")
	Object delete(@RequestBody NtfDto req) {
		System.out.println("read "+req);

		return mapper.delete(req.getNtfId(), req.getEmpId());
	}
}
