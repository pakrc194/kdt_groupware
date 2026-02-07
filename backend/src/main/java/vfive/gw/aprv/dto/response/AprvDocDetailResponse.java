package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocDetailResponse {
	int aprvDocId;
	int drftEmpId;
	int docFormId;
	String drftEmpNm;
	String aprvDocNo, aprvDocTtl, aprvDocStts, aprvDocAtrzDt, drftDt, aprvDocVer;
}
