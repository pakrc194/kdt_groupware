package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class AccessListDTO {
	private Integer accessId, accessListId;
	private String accessSection, accessDetail;
}
