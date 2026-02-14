package vfive.gw.attendance.dto.request;

import java.util.List;

import lombok.Data;
import vfive.gw.attendance.dto.response.DutySkedDetailDTO;

@Data
public class DutyRequestDTO {

	private int dutyId, deptId, empId, lstPtnIdx;
	private String scheTtl;
	private String trgtYmd;
	
	private List<DutySkedDetailDTO> details;
	
}
