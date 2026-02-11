package vfive.gw.aprv.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.mapper.AprvPostMapper;
import vfive.gw.ntf.dto.NtfRequest;
import vfive.gw.ntf.mapper.NtfMapper;


@Service
public class AprvPrcs {
	@Resource
	AprvPostMapper postMapper;
	@Resource
    NtfMapper ntfMapper;
	
	
	@Transactional
	public Object load(AprvPrcsRequest ap) {
		String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        ap.setAprvPrcsDt(now);

        // 1) 문서 상태 업데이트 (REF는 제외)
        if (!ap.getRoleCd().contains("REF")) {
            postMapper.docSttsUpdate(ap);
        }

        // 2) 현재 결재선 업데이트
        postMapper.uAprvPrcs(ap);

        // ==============================
        // A) 반려 처리 (우선 리턴)
        // ==============================
        if ("REJECTED".equals(ap.getAprvPrcsStts())) {
            sendAprvRejectToDrafter(ap.getAprvDocId(),
                                    ap.getAprvPrcsEmpId(),
                                    ap.getRjctRsn());
            return Map.of("res", "success");
        }
        
        // ======================================================
        // 3) MID_ATRZ 승인 → MID_REF + LAST_ATRZ 활성화 + 알림(APRV_REQ)
        // ======================================================
        if ("MID_ATRZ".equals(ap.getRoleCd())
                && "APPROVED".equals(ap.getAprvPrcsStts())) {

            // WAIT -> PENDING
            postMapper.activateRole(ap.getAprvDocId(), "MID_REF");
            postMapper.activateRole(ap.getAprvDocId(), "LAST_ATRZ");

            // 새로 PENDING인 결재자(ATRZ)에게 결재요청 알림
            sendAprvReqToPendingApprovers(ap.getAprvDocId(), ap.getAprvPrcsEmpId());
        }

        // ======================================================
        // 4) LAST_ATRZ 승인 → 기안자에게 완료 알림(APRV_DONE)
        // ======================================================
        if ("LAST_ATRZ".equals(ap.getRoleCd())
                && "COMPLETED".equals(ap.getAprvPrcsStts())) {

            sendAprvDoneToDrafter(ap.getAprvDocId(), ap.getAprvPrcsEmpId());
        }

        return Map.of("res", "success");
    }

    // ======================================================
    // 알림: 결재요청(APRV_REQ) - 현재 PENDING인 ATRZ에게
    // ======================================================
    private void sendAprvReqToPendingApprovers(int aprvDocId, int senderEmpId) {

        List<Integer> receivers = ntfMapper.selectPendingApprovers(aprvDocId);
        if (receivers == null || receivers.isEmpty()) return;

        receivers = receivers.stream().distinct().toList();

        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        NtfRequest ntf = new NtfRequest();
        ntf.setNtfType("APRV_REQ");
        ntf.setTitle("결재 요청");
        ntf.setBody("결재 요청이 도착했습니다.");
        ntf.setLinkUrl("/approval/approvalBox/detail/" + aprvDocId);
        ntf.setSrcType("APRV_DOC");
        ntf.setSrcId(aprvDocId);
        ntf.setCreatedBy(senderEmpId);
        ntf.setCreatedAt(now);

        ntfMapper.insertNtf(ntf);
        ntfMapper.insertNtfReceivers(ntf.getNtfId(), receivers, now);
    }

    // ======================================================
    // 알림: 결재완료(APRV_DONE) - 기안자에게
    // ======================================================
    private void sendAprvDoneToDrafter(int aprvDocId, int senderEmpId) {

        Integer drafterEmpId = postMapper.selectDrafter(aprvDocId);
        if (drafterEmpId == null || drafterEmpId == 0) return;

        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        NtfRequest ntf = new NtfRequest();
        ntf.setNtfType("APRV_DONE");
        ntf.setTitle("결재 완료");
        ntf.setBody("결재가 완료되었습니다.");
        ntf.setLinkUrl("/approval/approvalBox/detail/" + aprvDocId);
        ntf.setSrcType("APRV_DOC");
        ntf.setSrcId(aprvDocId);
        ntf.setCreatedBy(senderEmpId);
        ntf.setCreatedAt(now);

        ntfMapper.insertNtf(ntf);
        ntfMapper.insertNtfReceivers(ntf.getNtfId(), List.of(drafterEmpId), now);
    }
    
    
    // --------------------------
    // 반려 알림 (APRV_REJECT)
    // --------------------------
    private void sendAprvRejectToDrafter(int aprvDocId, int senderEmpId, String rjctRsn) {
        Integer drafterEmpId = postMapper.selectDrafter(aprvDocId);
        if (drafterEmpId == null || drafterEmpId == 0) return;

        String now = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        String reason = (rjctRsn == null || rjctRsn.isBlank())
                ? "반려 사유가 입력되지 않았습니다."
                : rjctRsn;

        NtfRequest ntf = new NtfRequest();
        ntf.setNtfType("APRV_REJECT");
        ntf.setTitle("결재 반려");
        ntf.setBody("반려 사유: " + reason);
        ntf.setLinkUrl("/approval/approvalBox/detail/" + aprvDocId);
        ntf.setSrcType("APRV_DOC");
        ntf.setSrcId(aprvDocId);
        ntf.setCreatedBy(senderEmpId);
        ntf.setCreatedAt(now);

        ntfMapper.insertNtf(ntf);
        ntfMapper.insertNtfReceivers(ntf.getNtfId(), List.of(drafterEmpId), now);
    }
}