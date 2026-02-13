package vfive.gw.aprv.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.mapper.AprvListMapper;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvDeptEmpList implements AprvAction {
	@Resource
	AprvListMapper mapper;
	
	@Override
	public Object execute(AprvParams service, AprvPageInfo pInfo, HttpServletRequest request,
			HttpServletResponse response) {
		
		return mapper.aprvDeptEmpList();
	}

}
