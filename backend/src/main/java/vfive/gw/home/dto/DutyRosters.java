package vfive.gw.home.dto;

import java.util.Date;

import lombok.Data;

@Data
public class DutyRosters {
	private int rosterId;
	private String employeeNo, title, status;
	private Date targetDate, createdAt, updatedAt;
	
}
