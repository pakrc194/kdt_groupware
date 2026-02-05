package vfive.gw.aprv.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.response.AprvDocFormLineResponse;
import vfive.gw.aprv.dto.response.AprvDocLineResponse;
import vfive.gw.aprv.mapper.AprvListMapper;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvDocFormLine implements AprvAction {
	@Resource
	AprvMapper mapper;
	
	@Override
	public Object execute(AprvParams service, AprvPageInfo pInfo, HttpServletRequest request,
			HttpServletResponse response) {
		/*
		 	int docFormLineId, docFormId;
			int midAtrzEmpId, lastAtrzEmpId;
			String midAtrzEmpNm, lastAtrzEmpNm;
		 * */
		AprvDocFormLineResponse res = mapper.docFormLine(pInfo.getPNo()); 
		
		List<AprvDocLineResponse> ListLineRes = List.of(
				new AprvDocLineResponse(res.getMidAtrzEmpId(), "MID_ATRZ", "0"),
				new AprvDocLineResponse(res.getLastAtrzEmpId(), "LAST_ATRZ", "0")
		);
				
		
		/*
		int aprvLineId, aprvDocId, aprvPrcsEmpId;
		String roleCd, roleSeq, aprvPrcsDt, aprvPrcsStts, rjctRsn;
		String empNm;
		String nextEmpNm;
		*/

		
		return ListLineRes;
	}

}
