package vfive.gw.home.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Sched {
	private Integer schedId, schedLoc, schedAuthorId, schedFinalApprover;
	private String schedTitle, schedType, schedDetail, schedTeam, schedState, schedEmpSn, schedTeamId;
	private Date schedStartDate, schedEndDate;
}
