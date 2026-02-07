package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvLocListResponse {
	int locId;
	String locNm;
	String schedTitle, schedStartDate, schedEndDate, schedDept;
	
}
