package vfive.gw.aprv.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvRoleVlRequest;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvRoleVl {
	@Resource
	AprvMapper mapper;
	
	public Object load(AprvRoleVlRequest req) {
		
		return mapper.aprvRoleVl(req);
	}
}
