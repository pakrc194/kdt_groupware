package vfive.gw.dashboard.dto.response;

import lombok.Data;

@Data
public class AddAccessEmpower {
	private String accessType, accessSection;
	private Integer empowerId, accessDetail;
}
