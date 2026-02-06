package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvLocListRequest {
	int locId;
	String locNm;
	String docStart, docEnd;
}
