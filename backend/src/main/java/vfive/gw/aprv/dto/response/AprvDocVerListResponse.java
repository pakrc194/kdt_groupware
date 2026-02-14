package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocVerListResponse {
	int aprvDocId, drftEmpId, docFormId, aprvDocVer;
	String aprvDocTtl, aprvDocAtrzDt;
	String aprvDocDrftDt;
	String rjctRsn;
}
