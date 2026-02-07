package vfive.gw.aprv.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvEmpAnnlLvRequest;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.response.AprvEmpAnnlLvResponse;
import vfive.gw.aprv.mapper.AprvMapper;

@Service
public class AprvEmpAnnlLv {
	@Resource
	AprvMapper mapper;
	

	public AprvEmpAnnlLvResponse load(AprvEmpAnnlLvRequest req) {
		
		return mapper.empAnnlLv(req);
	}

}
