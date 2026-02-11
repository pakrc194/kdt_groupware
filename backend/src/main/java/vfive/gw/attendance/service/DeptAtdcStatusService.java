package vfive.gw.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class DeptAtdcStatusService {
	
	@Resource
	private AtdcMapper mapper;
	
	public List<Map<String, Object>> getDeptAtdcStatus(EmpAtdcRequestDTO req) {
    return mapper.selectMyDeptEmpStatus(req);
}
	
}
