package vfive.gw.schedule.dto;

import java.time.LocalDateTime;
import java.util.Date;

import lombok.Data;

@Data
public class Sched {
	private Integer schedId, schedLoc, schedAuthorId, schedFinalApprover;
	private String schedTitle, schedType, schedDetail, schedDept, schedState, schedDeptId, schedEmpId;
	private String schedStartDate, schedEndDate, schedDeleteDate;
	
	private boolean schedSs;
}