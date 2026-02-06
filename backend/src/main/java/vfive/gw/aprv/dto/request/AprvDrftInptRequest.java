package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvDrftInptRequest {
	int docFormId, docInptId, docInptNo;
	String docInptLbl, docInptRmrk, docInptNm, docInptType, docInptVl;
}
