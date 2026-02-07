package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvDrftDocRequest {
	int aprvDocId;
	String aprvDocNo, aprvDocTtl;
	int docFormId, drftEmpId;
	String aprvDocDrftDt;
	String aprvDocVer;
}
