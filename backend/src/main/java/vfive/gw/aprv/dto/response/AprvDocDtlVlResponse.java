package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDocDtlVlResponse {
	int docInptVlId;
	int aprvDocId;
	int docInptNo;
	int docInptId;
	String docInptLbl, docInptType, docInptNm, docInptRmrk, docInptVl;
	
}
