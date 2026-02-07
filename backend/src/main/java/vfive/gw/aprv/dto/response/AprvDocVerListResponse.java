package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocVerListResponse {
	int aprvDocId, drftEmpId, docFormId;
	String aprvDocTtl, aprvDocAtrzDt, aprvDocVer;
}
