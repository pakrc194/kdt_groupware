package vfive.gw.aprv.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AprvEmpAnnlLvRequest {
	String role;
	List<Integer> ids; 
	int year;
}
