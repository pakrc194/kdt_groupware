package vfive.gw.dashboard.dto.response;

import lombok.Data;

@Data
public class AccessDeleteDTO {
	private String accessDeleteType, accessDeleteSection, accessDeleteDetail, accessDeleteDate;
	private Integer deleteEmpowerId, accessDeleteId;
}
