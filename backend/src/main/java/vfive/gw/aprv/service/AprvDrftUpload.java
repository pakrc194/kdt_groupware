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
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvInptVlRequest;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.dto.response.AprvDocVerListResponse;
import vfive.gw.aprv.mapper.AprvPostMapper;
import vfive.gw.ntf.dto.NtfRequest;
import vfive.gw.ntf.mapper.NtfMapper;

@Service
public class AprvDrftUpload {
	@Resource
	AprvPostMapper mapper;
	
	@Resource
	NtfMapper ntfMapper;
	
	
	@Transactional
	public Object load(AprvDrftUploadRequest req) {
		System.out.println("-------------");
		System.out.println(req.getDrftDocReq());
		AprvDrftDocRequest drftDoc = req.getDrftDocReq();
		
		AprvDocVerListRequest docVer = new AprvDocVerListRequest();
		docVer.setDocNo(drftDoc.getAprvDocNo());
		drftDoc.setAprvDocStts("DRFT");
		String nextVersion = "1.0";
		List<AprvDocVerListResponse> docVerList = mapper.aprvDocVerList(docVer);
		
		System.out.println("docVerList "+ docVerList);
		if (docVerList != null && !docVerList.isEmpty()) {
		    String lastVer = docVerList.get(0).getAprvDocVer(); // ex) 1.2
		    double ver = Double.parseDouble(lastVer);
		    ver += 0.1;
		    nextVersion = String.format("%.1f", ver);
		}
		drftDoc.setAprvDocVer(nextVersion);
		System.out.println("nextVersion "+ nextVersion);
		
		if(nextVersion.equals("1.0")) {
			drftDoc.setAprvDocNo(generateDocNo(drftDoc.getAprvDocNo()));
		}
		
		
		drftDoc.setAprvDocDrftDt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
		
		System.out.println("insert doc : "+mapper.insertAprvDoc(drftDoc));
		System.out.println(req.getDrftDocReq());

		int aprvDocId = drftDoc.getAprvDocId();		
		System.out.println("-------------");
		List<AprvPrcsRequest> drftLineList = req.getDrftLineReq();
		
		boolean hasMidAtrz = drftLineList.stream()
		        .anyMatch(l -> "MID_ATRZ".equals(l.getRoleCd()) && l.getAprvPrcsEmpId() != 0);

		
		for(AprvPrcsRequest line : drftLineList) {
			line.setAprvDocId(aprvDocId);
			switch (line.getRoleCd()) {
			  case "DRFT":
			    line.setAprvPrcsStts("APPROVED");
			    line.setAprvPrcsDt(drftDoc.getAprvDocDrftDt());
			    break;

			  case "DRFT_REF":
			  case "MID_ATRZ":
			    line.setAprvPrcsStts("PENDING");
			    line.setAprvPrcsDt(null);
			    break;

			  case "MID_REF":
				line.setAprvPrcsStts("WAIT");
			    line.setAprvPrcsDt(null);
			    break;
			    
			  case "LAST_ATRZ":
		            // ✅ MID_ATRZ가 없으면 LAST가 바로 결재해야 함
		            line.setAprvPrcsStts(hasMidAtrz ? "WAIT" : "PENDING");
		            line.setAprvPrcsDt(null);
		            break;

		        default:
		            line.setAprvPrcsStts("WAIT");
		            line.setAprvPrcsDt(null);
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
		
		
		
		
		String now = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

		// 1) 알림 내용 생성
		NtfRequest n = new NtfRequest();
		n.setNtfType("APRV_REQ");
		n.setTitle("결재 요청");
		n.setBody(drftDoc.getAprvDocTtl()); // 예: 문서 제목/요약
		n.setLinkUrl("/aprv/detail/" + aprvDocId);
		n.setSrcType("APRV_DOC");
		n.setSrcId(aprvDocId);
		n.setCreatedBy(drftDoc.getDrftEmpId());
		n.setCreatedAt(now);

		ntfMapper.insertNtf(n); // n.ntfId 생성됨

		// 2) 수신자 조회(PENDING인 다음 결재자 + 참조자)
		List<Integer> empIds = ntfMapper.selectDraftReceivers(aprvDocId);

		// 3) 수신자 insert
		if (!empIds.isEmpty()) {
		    // 혹시 모를 중복 제거
		    empIds = empIds.stream().distinct().toList();
		    ntfMapper.insertReceivers(n.getNtfId(), empIds, now);
		}
		
		List<Integer> receivers =
			    ntfMapper.selectNextApprovers(aprvDocId);

		if (receivers != null && !receivers.isEmpty()) {

		    // 혹시 모를 중복 제거
		    receivers = receivers.stream().distinct().toList();

		  
		    ntfMapper.insertNtfReceivers(
		        n.getNtfId(),
		        receivers,
		        now
		    );
		}
		
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
