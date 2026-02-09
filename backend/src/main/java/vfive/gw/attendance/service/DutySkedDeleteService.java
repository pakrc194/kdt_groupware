package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedDeleteService {
	
	@Resource
	private DutyMapper mapper;
	
	@Transactional
	public void execute(List<Integer> dutyIds) {
		if(dutyIds == null || dutyIds.isEmpty()) return;
		
		mapper.deleteDutyMasters(dutyIds);
	}
	
}
