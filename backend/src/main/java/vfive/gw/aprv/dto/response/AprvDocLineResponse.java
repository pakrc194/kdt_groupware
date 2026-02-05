package vfive.gw.aprv.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AprvDocLineResponse {
	int aprvLineId, aprvDocId, aprvPrcsEmpId;
	String roleCd, roleSeq, aprvPrcsDt, aprvPrcsStts, rjctRsn;
	String empNm;
	String nextEmpNm;
	
	public AprvDocLineResponse(int aprvPrcsEmpId, String roleCd, String roleSeq) {
		this.aprvPrcsEmpId = aprvPrcsEmpId;
		this.roleCd = roleCd;
		this.roleSeq = roleSeq;
	}
	
	
}
