package vfive.gw.aprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvLocListRequest;
import vfive.gw.aprv.dto.response.AprvLocListResponse;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvLocList {
	
	@Resource
	AprvMapper mapper;
	
	public List<AprvLocListResponse> load(AprvLocListRequest req) {
		return mapper.locList(req);
	}
}
