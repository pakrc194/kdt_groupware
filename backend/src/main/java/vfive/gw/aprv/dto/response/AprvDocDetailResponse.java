package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocDetailResponse {
	int aprvDocId;
	int drftEmpId;
	String drftEmpNm;
	String aprvDocNo, aprvDocTtl, aprvDocStts, aprvDocAtrzDt, aprvDocDrftDt, aprvDocVer;
}
