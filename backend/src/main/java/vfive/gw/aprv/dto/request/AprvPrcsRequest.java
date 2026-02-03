package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvPrcsRequest {
	int aprvLineId, aprvDocId, aprvPrcsEmpId;
	String roleCd, roleSeq, aprvPrcsDt, aprvPrcsStts, rjctRsn, drftDt;
	
	String nextEmpNm;
}
