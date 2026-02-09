package vfive.gw.aprv.service;

import java.util.ArrayList;
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
	
	public List<List<AprvDutyScheDtlResponse>> load(AprvDutyScheDtlRequest req) {
		List<List<AprvDutyScheDtlResponse>> res= new ArrayList<>();
		System.out.println("AprvDutyScheDtl "+req);
		List<AprvDutyScheDtlResponse> list = new ArrayList<>();
		for(Integer id : req.getIds()) {
			list = new ArrayList<>();
			mapper.dutyScheDtl(id, req.getDeptId(), req.getDocStart(), req.getDocEnd());
			System.out.println("AprvDutyScheDtl "+id+" "+list);
			if(list.size()>0) {
				res.add(list);
			}
		}
		
		
		return res;
	}
}
