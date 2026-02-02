package vfive.gw.home.dto;

import java.util.Date;

import lombok.Data;

@Data
public class Attendance {
	private int attendanceId, empId;
	private String status;
	private Date workDate, actualClockIn, actualClockOut;
	
}
