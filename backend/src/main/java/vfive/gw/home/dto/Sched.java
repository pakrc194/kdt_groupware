package vfive.gw.home.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Sched {
	private int schedId, schedLoc, schedPersId, schedTeamId;
	private String schedTitle, schedType, schedDetail, schedTeam, schedState;
	private Date schedStartDate, schedEndDate;
}
