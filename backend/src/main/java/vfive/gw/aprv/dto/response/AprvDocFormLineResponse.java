package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocFormLineResponse {
	int docFormLineId, docFormId;
	int midAtrzEmpId, lastAtrzEmpId;
	String midAtrzEmpNm, lastAtrzEmpNm;
}
