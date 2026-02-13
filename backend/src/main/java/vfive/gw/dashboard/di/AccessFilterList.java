package vfive.gw.dashboard.di;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.mapper.AccessListMapper;

@Service
public class AccessFilterList {
	
	@Resource
	AccessListMapper mapper;

	public Object execute(int jbttl, int dept) {
		// TODO Auto-generated method stub
		return mapper.accessFilterList(jbttl, dept);
	}

}
