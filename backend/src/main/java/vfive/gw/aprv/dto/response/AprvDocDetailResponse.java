package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocDetailResponse {
	int aprvDocId;
	int drftEmpId;
	int docFormId;
	String drftEmpNm, docFormType, atrzVl;
	int deptId;
	String deptName;
	String aprvDocNo, aprvDocTtl, aprvDocStts, aprvDocAtrzDt, aprvDocDrftDt, aprvDocVer;
}
