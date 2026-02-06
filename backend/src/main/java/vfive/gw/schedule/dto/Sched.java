package vfive.gw.schedule.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Sched {
	private Integer schedId, schedLoc, schedAuthorId, schedFinalApprover, schedEmpId;
	private String schedTitle, schedType, schedDetail, schedDept, schedState, schedDeptId;
	private Date schedStartDate, schedEndDate;
}
