package vfive.gw.home.dto;

import java.util.Date;

import lombok.Data;

@Data
public class DutyDays {
	private int rosterId;
	private String employeeNo, title, status;
	private Date targetDate, createdAt, updatedAt;
	
}
