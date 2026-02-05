package vfive.gw.orgchart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.orgchart.mapper.OrgchartMapper;

@RestController
@RequestMapping("/gw/orgChart")
public class OrgChartController {

	@Resource
	OrgchartMapper orgchartMapper;
	
	// 조직도
	@GetMapping("list")
	List<EmpPrvc> emplist() {		
		return orgchartMapper.empList();
	}
	
	@GetMapping("detail/{id}")
	EmpPrvc emp(@PathVariable("id") int id) {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return orgchartMapper.empPrvc(emp);
	}
	
	@GetMapping("teamList/{code}")
	List<EmpPrvc> empTeam(@PathVariable("code") String code) {
		DeptInfo dInfo = new DeptInfo();
		dInfo.setDeptCode(code);
		
		return orgchartMapper.empTeamList(dInfo);
	}
	
	// 팀 코드로 팀 명 fetch
	@GetMapping("teamName/{code}")
	DeptInfo empTeamName(@PathVariable("code") String code) {
		DeptInfo dInfo = new DeptInfo();
		dInfo.setDeptCode(code);
		
		return orgchartMapper.deptDetail(dInfo);
	}
}
