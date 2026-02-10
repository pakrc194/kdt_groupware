package vfive.gw.ntf.dto;

import lombok.Data;

@Data
public class NtfDto {
	int ntfId;
	String ntfType, title, body, linkedUrl, createdAt, readYn, readAt;
}
