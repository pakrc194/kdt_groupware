package vfive.gw.aprv.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.request.AprvDrftDocRequest;
import vfive.gw.aprv.dto.request.AprvDrftTempRequest;
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvInptVlRequest;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.dto.response.AprvDocVerListResponse;
import vfive.gw.aprv.mapper.AprvPostMapper;

@Service
public class AprvDrftTemp {
	@Resource
	AprvPostMapper mapper;
	
	
	@Transactional
	public Object load(AprvDrftTempRequest req) {
		System.out.println("-------------");
		System.out.println(req.getDrftDocReq());
		AprvDrftDocRequest drftDoc = req.getDrftDocReq();
		
		drftDoc.setAprvDocNo(generateDocNo(drftDoc.getAprvDocNo()));
		drftDoc.setAprvDocStts("TEMP");
		String nextVersion = "1.0";
		
		System.out.println("nextVersion "+ nextVersion);
		
		drftDoc.setAprvDocDrftDt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
		
		System.out.println("insert doc : "+mapper.insertAprvDoc(drftDoc));
		System.out.println(req.getDrftDocReq());

		int aprvDocId = drftDoc.getAprvDocId();		
				
		
		System.out.println("-------------");
		for(AprvInptVlRequest item : req.getDrftInptReq()) {
			item.setAprvDocId(aprvDocId);
			System.out.println(item);
		}
		
		mapper.drftInpt(req.getDrftInptReq());
		
		return Map.of("result", req);
	}
	
	public String generateDocNo(String prefix) {

	    String year = String.valueOf(LocalDate.now().getYear());

	    String maxDocNo = mapper.selectMaxDocNo(prefix, year);
	    int nextSeq = 1;

	    if (maxDocNo != null) {
	        // APRV-2026-0042 → 0042
	        String lastSeq = maxDocNo.substring(maxDocNo.lastIndexOf("-") + 1);
	        nextSeq = Integer.parseInt(lastSeq) + 1;
	    }

	    return String.format("%s-%s-%04d", prefix, year, nextSeq);
	}
}
