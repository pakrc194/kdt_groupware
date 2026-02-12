package vfive.gw.orgchart.dto;

import lombok.Data;

@Data
public class HRChangeHistDTO {
	private Integer historyId, histEmpId, beforeDeptId, beforeJbttlId, afterDeptId, afterJbttlId;
	private String histEmpSn, histEmpNm, beforeNm, afterNm, changeDate;
	
	private String bDeptName, aDeptName, bJbttlNm, aJbttlNm;
}
