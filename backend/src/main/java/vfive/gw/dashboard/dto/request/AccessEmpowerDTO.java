package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class AccessEmpowerDTO {
	private String accessType, accessSection, accessDetail, accessName, deptName, jbttlNm, empowerName;
	private Integer empowerId;
}
