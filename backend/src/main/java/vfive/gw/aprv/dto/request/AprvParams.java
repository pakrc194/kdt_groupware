package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvParams {
	String service;
	int year;
	int empId;
	String stts;
	
	String filterNm;
	String filterVl;
}
