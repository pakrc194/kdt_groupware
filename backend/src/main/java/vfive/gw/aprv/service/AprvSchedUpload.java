package vfive.gw.aprv.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvSchedUploadRequest;
import vfive.gw.aprv.mapper.AprvPostMapper;

@Service
public class AprvSchedUpload {
	@Resource
	AprvPostMapper mapper;
	
	public Object load(AprvSchedUploadRequest req) {
		return mapper.aprvSchedUpload(req);
	}
	
}
