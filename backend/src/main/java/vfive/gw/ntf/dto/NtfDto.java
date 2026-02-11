package vfive.gw.ntf.dto;

import lombok.Data;

@Data
public class NtfDto {
	int ntfId;
	int empId;
	int createdBy, rcpEmpId;
	String ntfType, title, body, linkUrl, createdAt, readYn, readAt;
}
