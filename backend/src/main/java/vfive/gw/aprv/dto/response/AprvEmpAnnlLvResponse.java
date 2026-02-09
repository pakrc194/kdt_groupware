package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvEmpAnnlLvResponse {
	int empId, baseYy, occrrLv, usedLv, remLv;
	String empNm;
}
