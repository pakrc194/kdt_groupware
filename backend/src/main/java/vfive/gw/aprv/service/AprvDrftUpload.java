package vfive.gw.aprv.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
		docVer.setDocNo(drftDoc.getAprvDocNo().trim());
		docVer.setEmpId(drftDoc.getDrftEmpId());
		System.out.println("문서번호 "+drftDoc.getAprvDocNo());
		drftDoc.setAprvDocStts("PENDING");
		int nextVersion = 1;
		List<AprvDocVerListResponse> docVerList = mapper.aprvDocVerList(docVer);
		
		System.out.println("docVerList "+ docVerList);
		if (docVerList != null && !docVerList.isEmpty()) {
			nextVersion = docVerList.get(0).getAprvDocVer()+1; // ex) 
		}
		drftDoc.setAprvDocVer(nextVersion);
		System.out.println("nextVersion "+ nextVersion);
		
		if(nextVersion==1) {
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

		// 1) 알림 마스터 정보 생성
		NtfRequest n = new NtfRequest();
		n.setNtfType("APRV_REQ");
		n.setTitle("결재 요청");
		n.setBody(drftDoc.getAprvDocTtl());
		n.setLinkUrl("/approval/approvalBox/detail/" + aprvDocId);
		n.setSrcType("APRV_DOC");
		n.setSrcId(aprvDocId);
		n.setCreatedBy(drftDoc.getDrftEmpId());
		n.setCreatedAt(now);

		ntfMapper.insertNtf(n); // 여기서 n.getNtfId()가 생성됨

		// 2) 모든 수신자 ID를 담을 하나의 Set 생성 (Set은 자동으로 중복을 방지함)
		Set<Integer> allReceiverIds = new HashSet<>();

		// 2-1) 기안 수신자(결재자+참조자) 추가
		List<Integer> draftReceivers = ntfMapper.selectDraftReceivers(aprvDocId);
		if (draftReceivers != null) {
		    allReceiverIds.addAll(draftReceivers);
		}

		// 2-2) 다음 결재자 추가
		List<Integer> nextApprovers = ntfMapper.selectNextApprovers(aprvDocId);
		if (nextApprovers != null) {
		    allReceiverIds.addAll(nextApprovers);
		}

		// 3) 최종 수신자가 있다면 단 한 번만 insert 실행
		if (!allReceiverIds.isEmpty()) {
		    // Set을 다시 List로 변환
		    List<Integer> finalReceivers = new ArrayList<>(allReceiverIds);
		    
		    // ntfMapper.insertNtfReceivers 하나만 사용 (기존 insertReceivers는 중복이므로 제거 권장)
		    ntfMapper.insertNtfReceivers(
		        n.getNtfId(),
		        finalReceivers,
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
