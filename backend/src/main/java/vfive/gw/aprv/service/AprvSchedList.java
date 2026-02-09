package vfive.gw.aprv.service;

import java.util.ArrayList;
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
	
	public List<List<AprvSchedResponse>> load(AprvSchedRequest req) {
		List<List<AprvSchedResponse>> res = new ArrayList<>();
		System.out.println(req);
		boolean check = req.getRole()==null || req.getRole().trim().equals("") ? false : true;
		
		if(check) {
			check = req.getRole().equals("DEPT");
		}
		
		if(check) {
			System.out.println("DEPT ---");
			for(Integer id : req.getIds()) {
				System.out.println("AprvSchedResponse id : "+id);
				List<AprvSchedResponse> list = mapper.deptSchedList(id, req.getDocStart(), req.getDocEnd());
				System.out.println("AprvSchedResponse list : "+list);
				if(list.size()>0) {
					res.add(list);
				}
			}
		} else {
			//System.out.println(req.getRole()+" ---");
			for(Integer id : req.getIds()) {
				System.out.println("AprvSchedResponse id : "+id);
				List<AprvSchedResponse> list = mapper.personalSchedList(id, req.getDeptId(), req.getDocStart(), req.getDocEnd());
				System.out.println("AprvSchedResponse list : "+list);
				if(list.size()>0) {
					res.add(list);
				}
			}
		}
		
		
		
		return res;
	}
}
