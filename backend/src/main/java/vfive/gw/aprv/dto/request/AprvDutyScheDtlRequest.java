package vfive.gw.aprv.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AprvDutyScheDtlRequest {
	String role;
	List<Integer> ids;
	int deptId;
	String docStart, docEnd;
}
