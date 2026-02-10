package vfive.gw.ntf.dto;

import lombok.Data;

@Data
public class NtfRequest {
	String ntfType, title, body, linkUrl, srcType, createdAt;
	int ntfId, srcId, createdBy;
}
