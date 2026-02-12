package vfive.gw.aprv.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvFormCreateRequest;
import vfive.gw.aprv.dto.request.AprvFormLine;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvFormCreate {
	@Resource
	AprvMapper mapper;
	
	@Transactional
	public Object load(AprvFormCreateRequest req) {
		mapper.aprvFormCreate(req);
		
		if(req.getDocFormType().equals("근태")) {
			mapper.aprvInptCreateAttend(req.getDocFormId());
		} else if(req.getDocFormType().equals("일정")) {
			mapper.aprvInptCreateSched(req.getDocFormId());
		} else {
			return Map.of("res","faile");
		}
		
		List<AprvFormLine> list = req.getDocLine();
		int midAtrzId = 0;
		int lastAtrzId = 0;
		for(AprvFormLine line : list) {
			if(line.getRoleCd().equals("MID_ATRZ")) {
				midAtrzId = line.getAprvPrcsEmpId();
			} else if(line.getRoleCd().equals("LAST_ATRZ")) {
				lastAtrzId = line.getAprvPrcsEmpId();
			}
		}
		
		mapper.aprvFormLineCreate(req.getDocFormId(), midAtrzId, lastAtrzId);
		
		
		
		return Map.of("res","success");
	}
}
