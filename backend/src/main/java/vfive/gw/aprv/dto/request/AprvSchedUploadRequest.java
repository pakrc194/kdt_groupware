package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvSchedUploadRequest {
	int schedLoc, schedEmpId, schedAuthorId;
	String schedTitle, schedStartDate, schedEndDate, schedType, schedDetail, schedDeptId;
}
