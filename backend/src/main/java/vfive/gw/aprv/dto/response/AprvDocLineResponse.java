package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocLineResponse {
	int aprvLineId, aprvDocId, aprvPrcsEmpId;
	String roleCd, roleSeq, aprvPrcsDt, aprvPrcsStts, rjctRsn;
	String empNm;
	String nextEmpNm;
}
