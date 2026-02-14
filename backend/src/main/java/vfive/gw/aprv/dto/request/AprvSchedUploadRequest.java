package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvSchedUploadRequest {
	int schedLoc, schedAuthorId, schedDocId;
	String schedTitle, schedStartDate, schedEndDate, schedType, schedDetail, schedDeptId, schedEmpId;
}
