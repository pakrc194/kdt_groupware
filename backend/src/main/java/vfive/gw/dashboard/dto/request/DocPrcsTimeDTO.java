package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class DocPrcsTimeDTO {
	// APRV_DOC_ID로 결재자 다 불러오기
	private String aprvDocStts;		// 결재 상태
	private String aprvDocTtl;		// 결재 제목
	private String aprvDocAtrzDt;	// 최종 결재 시간
	private String aprvDocDrftDt;	// 기안 시간
	private String docFormNm;		// 결재 문서 유형
	private String roleCd;			// 결재 위치
	private String aprvPrcsDt;		// 결재 시간
	private String drftEmpNm;		// 기안자 이름
	private String aprvPrcsEmpNm;	// 결재자 이름
	private Integer docFormId;
}
