package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class AprvPrcsDTO {
	// APRV_DOC
	private String aprvDocNo, aprvDocTtl, aprvDocStts, aprvDocAtrzDt, aprvDocDrftDt, aprvDocVer;
	private Integer aprvDocId, drftEmpId, docFormId;
	
	// docFormId - DOC_FORM.doc_form_id : 기안 폼 이름
	private String docFormNm;
	
	//drftEmpId - EMP_PRVC.emp_id : 기안자 이름
	private String draftEmpNm;
	
	// aprvDocId - APRV_PRCS.aprv_doc_id : 결재자 id
	private Integer aprvPrcsEmpId;
	// APRV_PRCS.aprv_prcs_emp_id - EMP_PRVC.emp_id : 결재자 이름
	private String aprvPrcsEmpNm;
}
