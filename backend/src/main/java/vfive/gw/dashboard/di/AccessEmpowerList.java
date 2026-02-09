package vfive.gw.dashboard.di;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.mapper.AccessEmpowerListMapper;

@Service
public class AccessEmpowerList implements AccessEmpowerAction {
	
	@Resource
	AccessEmpowerListMapper mapper;

	@Override
	public Object execute() {
		// TODO Auto-generated method stub
		return mapper.accessEmpowerList();
	}

}
