package vfive.gw.aprv.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class AprvFormCreateRequest {
	int docFormId;
	String docFormNm, docFormCd, docFormType;
	List<AprvFormLine> docLine;
}
