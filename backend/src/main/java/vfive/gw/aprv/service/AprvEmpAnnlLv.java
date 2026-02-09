package vfive.gw.aprv.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	
	@Transactional
	public List<AprvEmpAnnlLvResponse> load(AprvEmpAnnlLvRequest req) {
		List<Integer> ids = req.getIds();
		List<AprvEmpAnnlLvResponse> res = new ArrayList<>();
		System.out.println(req);
		for(Integer id : ids) {
			AprvEmpAnnlLvResponse aeal = mapper.empAnnlLv(id, req.getYear());
			if(aeal!=null) {
				res.add(aeal);
			}
		}
		System.out.println(res);
		return res;
	}

}
