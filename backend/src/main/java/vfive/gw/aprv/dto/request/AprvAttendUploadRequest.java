package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvAttendUploadRequest {
	int empId;
	String docStart, docEnd;
}
