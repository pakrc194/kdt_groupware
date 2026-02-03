package vfive.gw.attendance.dto;

import java.util.Date;

import lombok.Data;

@Data
public class AtdcCal {
	private int atdcId, empId;
	private String atdcSttsCd;
	private Date wrkYmd, clkInDtm, clkOutDtm;
	
	
}
