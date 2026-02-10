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
		
		AprvDocFormLineResponse res = mapper.docFormLine(pInfo.getPNo()); 
		
		
		
		List<AprvDocLineResponse> ListLineRes = new ArrayList();
				
		
		if(res.getMidAtrzEmpId()!=0) {
			ListLineRes.add(new AprvDocLineResponse(res.getMidAtrzEmpId(), res.getMidAtrzEmpNm(),"MID_ATRZ", "0"));
		}
		ListLineRes.add(new AprvDocLineResponse(res.getLastAtrzEmpId(), res.getLastAtrzEmpNm(), "LAST_ATRZ", "0"));	
			
		
				
		
		

		
		return ListLineRes;
	}

}
