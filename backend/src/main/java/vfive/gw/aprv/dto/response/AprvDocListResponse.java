package vfive.gw.aprv.dto.response;

import jakarta.annotation.Resource;
import lombok.Data;

@Data
public class AprvDocListResponse {
	int aprvDocId;
	String aprvDocNo, aprvDocTtl, aprvDocStts, aprvDocAtrzDt, aprvDocDrftDt, aprvDocVer;
	
	int empId, dept_id, jbttlId;
	String empNm;
	
	
}


