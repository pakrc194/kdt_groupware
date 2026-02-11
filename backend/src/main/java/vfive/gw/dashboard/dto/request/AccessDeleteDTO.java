package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class AccessDeleteDTO {
	private String empowerName, accessName;
	
	private String accessDeleteType, accessDeleteSection, accessDeleteDate;
	private Integer deleteEmpowerId, accessDeleteDetail;
}
