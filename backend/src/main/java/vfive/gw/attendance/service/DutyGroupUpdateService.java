package vfive.gw.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutyGroupUpdateService {
	
	@Resource
	DutyMapper mapper;
	
	@Transactional
	public void execute(List<Map<String, Object>> req) {
		
		if(req == null || req.isEmpty()) return;
		
		int updatedRows = mapper.updateEmpGroups(req);
		
		if(updatedRows == 0) {
			throw new RuntimeException("업데이트된 사원 정보가 없습니다.");
		}
		
	}
	
	
}
