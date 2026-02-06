package vfive.gw.aprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.request.AprvSchedRequest;
import vfive.gw.aprv.dto.response.AprvDutyScheDtlResponse;
import vfive.gw.aprv.dto.response.AprvSchedResponse;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvSchedList {
	@Resource
	AprvMapper mapper;
	
	public List<AprvSchedResponse> load(AprvSchedRequest req) {
		return mapper.schedList(req);
	}
}
