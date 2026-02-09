package vfive.gw.aprv.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AprvDrftTempRequest {
	AprvDrftDocRequest drftDocReq;
	List<AprvInptVlRequest> drftInptReq;
}
