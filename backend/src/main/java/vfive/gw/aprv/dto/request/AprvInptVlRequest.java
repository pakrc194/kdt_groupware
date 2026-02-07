package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvInptVlRequest {
	int docInptNo;
	int docInptId, aprvDocId;
	String docInptVl;
}
