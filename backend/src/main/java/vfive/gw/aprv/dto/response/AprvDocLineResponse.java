package vfive.gw.aprv.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AprvDocLineResponse {
	int aprvLineId, aprvDocId, aprvPrcsEmpId;
	String aprvPrcsEmpNm;
	String roleCd, roleSeq, aprvPrcsDt, aprvPrcsStts, rjctRsn, drftDt;
	String empNm;
	String nextEmpNm;
	
	public AprvDocLineResponse(int aprvPrcsEmpId, String aprvPrcsEmpNm, String roleCd, String roleSeq) {
		this.aprvPrcsEmpId = aprvPrcsEmpId;
		this.aprvPrcsEmpNm = aprvPrcsEmpNm;
		this.roleCd = roleCd;
		this.roleSeq = roleSeq;
	}
	
	
}
