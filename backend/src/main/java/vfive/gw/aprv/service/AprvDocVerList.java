package vfive.gw.aprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.response.AprvDocVerListResponse;
import vfive.gw.aprv.mapper.AprvListMapper;
import vfive.gw.aprv.mapper.AprvMapper;
import vfive.gw.aprv.mapper.AprvPostMapper;

@Service
public class AprvDocVerList {
	@Resource
	AprvPostMapper mapper;
	
	public List<AprvDocVerListResponse> load(AprvDocVerListRequest req) {
		
		
		return mapper.aprvDocVerList(req);
	}
}
