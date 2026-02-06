package vfive.gw.aprv.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.response.AprvDutyScheDtlResponse;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvDutyScheDtl {
	@Resource
	AprvMapper mapper;
	
	public List<AprvDutyScheDtlResponse> load(AprvDutyScheDtlRequest req) {
		return mapper.dutyScheDtl(req);
	}
}
