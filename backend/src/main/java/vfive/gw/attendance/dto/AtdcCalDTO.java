package vfive.gw.attendance.dto;

import java.util.Date;

import lombok.Data;

@Data
public class AtdcCalDTO {
	private int atdcId, empId;
	private String atdcSttsCd;
	private Date wrkYmd, clkInDtm, clkOutDtm;
	
	
}
