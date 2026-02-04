package vfive.gw.aprv.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.mapper.AprvLineMapper;

@Service
public class AprvLine implements AprvAction {
	@Resource
	AprvLineMapper mapper;
	
	@Override
	public Object execute(AprvParams service, AprvPageInfo pInfo, HttpServletRequest request,
			HttpServletResponse response) {
		// TODO Auto-generated method stub
		return mapper.docLine(pInfo.getPNo());
	}
}
