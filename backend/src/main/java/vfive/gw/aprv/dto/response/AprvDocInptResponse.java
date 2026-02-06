package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocInptResponse {
	int docInptId;
	int docFormId;
	int docInptNo;
	String docInptLbl, docInptNm, docInptType, docInptRmrk;
	
}
