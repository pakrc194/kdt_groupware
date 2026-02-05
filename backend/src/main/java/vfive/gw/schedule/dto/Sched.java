package vfive.gw.schedule.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Sched {
	private Integer schedId, schedLoc, schedAuthorId, schedFinalApprover;
	private String schedTitle, schedType, schedDetail, schedDept, schedState, schedEmpSn, schedDeptId;
	private Date schedStartDate, schedEndDate;
}
