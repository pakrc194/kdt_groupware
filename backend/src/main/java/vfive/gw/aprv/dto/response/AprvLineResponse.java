package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvLineResponse {
	int aprvLineId;
	int aprvDocId;
	int drftRefncEmp1Id, drftRefncEmp2Id, drftRefncEmp3Id;
	int midAtrzEmpId;
	int midRefncEmp1Id, midRefncEmp2Id, midRefncEmp3Id;
	int lastAtrzEmpId;
	
	String drftRefncEmp1Nm, drftRefncEmp2Nm, drftRefncEmp3Nm;
	String midAtrzEmpNm;
	String midRefncEmp1Nm, midRefncEmp2Nm, midRefncEmp3Nm;
	String lastAtrzEmpNm;
}
