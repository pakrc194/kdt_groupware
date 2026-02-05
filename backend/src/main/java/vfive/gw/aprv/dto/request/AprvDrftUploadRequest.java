package vfive.gw.aprv.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AprvDrftUploadRequest {
	AprvDrftDocRequest drftDocReq;
	List<AprvPrcsRequest> drftLineReq;
	List<AprvInptVlRequest> drftInptReq;
}
