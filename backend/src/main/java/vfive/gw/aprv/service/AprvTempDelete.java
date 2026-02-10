package vfive.gw.aprv.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvTempDeleteRequest;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvTempDelete {
	@Resource
	AprvMapper mapper;
	
	
	@Transactional
	public Object load(AprvTempDeleteRequest req) {
		
		int resPrcs = mapper.deleteAprvPrcs(req.getDocId());
//		if(resPrcs==0) {
//			return Map.of("res","fail");	
//		}
		int resDoc = mapper.deleteAprvDoc(req.getDocId());
		if(resDoc==0) {
			return Map.of("res","fail");	
		}
		
		return Map.of("res","success");
	}
}
