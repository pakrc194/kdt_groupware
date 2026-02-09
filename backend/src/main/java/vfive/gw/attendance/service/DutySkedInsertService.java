package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedDetailDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedInsertService {

	@Resource
	DutyMapper mapper;
	
	@Transactional
	public void execute(DutyRequestDTO req) {
		
		mapper.insertDutyMaster(req);
		
		int generatedScheId = req.getDutyId();
		List<DutySkedDetailDTO> details = req.getDetails();
		
		if(details != null && !details.isEmpty()) {
			for(DutySkedDetailDTO detail : details) {
				detail.setDutyId(generatedScheId);
			}
			mapper.insertDutyDetails(details);
		}
		
	}
	
}
