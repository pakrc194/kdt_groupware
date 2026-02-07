package vfive.gw.attendance.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedUpdateService {

	@Resource
	private DutyMapper mapper;
	
	@Transactional
	public void execute(DutyRequestDTO req) {
		mapper.updateDutyMaster(req);
		
		mapper.deleteDutyDetails(req);
		
		if(req.getDetails() != null && !req.getDetails().isEmpty()) {
			mapper.insertDutyDetails(req.getDetails());
		}
	}
	
}
