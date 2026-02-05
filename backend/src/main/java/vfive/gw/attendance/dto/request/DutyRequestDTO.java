package vfive.gw.attendance.dto.request;

import lombok.Data;

@Data
public class DutyRequestDTO {

	private int scheId, deptId;
	String trgtYmd;
	
}
