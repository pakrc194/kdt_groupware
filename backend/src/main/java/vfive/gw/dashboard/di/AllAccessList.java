package vfive.gw.dashboard.di;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.mapper.AccessListMapper;

@Service
public class AllAccessList implements AccessAction {
	
	@Resource
	AccessListMapper mapper;

	@Override
	public Object execute(String type) {
		// TODO Auto-generated method stub
		return mapper.allAccessList(type);
	}

}
