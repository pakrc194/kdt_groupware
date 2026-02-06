package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDutyScheDtlResponse {
	int scheDtlId, scheId;
	String dutyYmd, wrkCd;
}
