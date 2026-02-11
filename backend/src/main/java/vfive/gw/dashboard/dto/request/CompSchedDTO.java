package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class CompSchedDTO {
	private String schedTitle, schedStartDate, schedEndDate, schedType, schedDetail, schedDept, schedEmpId, schedDeptId, schedDeleteDate;
	private Integer schedLoc;
	
	private String schedEmpNm, schedDeptNm, schedLocNm;
}
