package vfive.gw.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class GetLastMonthDutyService {
	
	@Resource
	private DutyMapper mapper;
	
	public List<Map<String, Object>> getLastMonthDuty(DutyRequestDTO req){
		return mapper.getLastMonthLastDayDuty(req);
	}
	
}
