package vfive.gw.attendance.dto.domain;

import java.util.Date;

import lombok.Data;

@Data
public class AtdcDTO {
	private int atdcId, empId, wrkCd;
	private String atdcSttsCd;
	private Date wrkYmd, clkInDtm, clkOutDtm;
	
	
}
