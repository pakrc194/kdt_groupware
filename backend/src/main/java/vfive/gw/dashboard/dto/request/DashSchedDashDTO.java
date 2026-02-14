package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class DashSchedDashDTO {
	private String schedTitle, schedStartDate, schedEndDate, schedDetail, schedDeptId;
	private Integer schedLoc, schedDocId;
	
	private String locNm, empNm, schedEmpId;
}
