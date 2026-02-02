package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvInptVlResponse {
	int docInptVlId;
	int aprvDocId;
	int docInptNo;
	String docInptLbl, docInptType, docInptRmrk, docInptVl;
	
}
