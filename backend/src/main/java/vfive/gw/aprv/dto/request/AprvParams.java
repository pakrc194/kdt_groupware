package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvParams {
	String service;
	int year;
	int empId;
	String stts;
	String code;
	
	String filterNm;
	String filterVl;
}
