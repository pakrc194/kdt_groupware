package vfive.gw.home.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class Sched {
	private int schedId, schedLoc;
	private String schedTitle, schedType, schedDetail, schedTeam;
	Date schedStartDate, schedEndDate;
}
