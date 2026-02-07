package vfive.gw.aprv.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvDrftDocRequest;
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvInptVlRequest;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.mapper.AprvPostMapper;

@Service
public class AprvDrftUpload {
	@Resource
	AprvPostMapper mapper;
	
	
	@Transactional
	public Object load(AprvDrftUploadRequest req) {
		System.out.println("-------------");
		System.out.println(req.getDrftDocReq());
		AprvDrftDocRequest drftDoc = req.getDrftDocReq();
		drftDoc.setAprvDocDrftDt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
		
		System.out.println("insert doc : "+mapper.insertAprvDoc(drftDoc));
		System.out.println(req.getDrftDocReq());

		int aprvDocId = drftDoc.getAprvDocId();		
		System.out.println("-------------");
		List<AprvPrcsRequest> drftLineList = req.getDrftLineReq();
		
		for(AprvPrcsRequest line : drftLineList) {
			line.setAprvDocId(aprvDocId);
			line.setAprvPrcsStts("WAIT");
			if(line.getRoleCd().equals("DRFT")) {
				line.setAprvPrcsStts("APPROVED");
				line.setAprvPrcsDt(drftDoc.getAprvDocDrftDt());
			}
			System.out.println(line);
		}
		
		
		mapper.drftLineList(drftLineList);
		
		
		
		
		System.out.println("-------------");
		for(AprvInptVlRequest item : req.getDrftInptReq()) {
			item.setAprvDocId(aprvDocId);
			System.out.println(item);
		}
		
		mapper.drftInpt(req.getDrftInptReq());
		
		return Map.of("result", req);
	}
}
