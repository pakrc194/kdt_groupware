package vfive.gw.home.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.request.MyDashResDTO;
import vfive.gw.home.mapper.HomeMapper;

@Service
public class GetMyDashService {
	
	@Resource
	HomeMapper mapper;
	
	public Map<String, Object> execute(MyDashResDTO req){
		LocalDateTime now = LocalDateTime.now();
		
		Map<String, Object> res = new HashMap<>();
		
		req.setYear(String.valueOf(now.getYear()));
		
		res.put("leave", mapper.selectLeaveInfo(req));
		System.out.println(mapper.selectLeaveInfo(req));
		
		return res;
	}
	
	

}
