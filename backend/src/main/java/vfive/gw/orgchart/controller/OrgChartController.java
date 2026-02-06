package vfive.gw.orgchart.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.orgchart.dto.EmpSearchReq;
import vfive.gw.orgchart.dto.JbttlInfo;
import vfive.gw.orgchart.mapper.OrgchartMapper;
import vfive.gw.schedule.dto.Sched;

@RestController
@RequestMapping("/gw/orgChart")
public class OrgChartController {

	@Resource
	OrgchartMapper orgchartMapper;
	
	// 조직도
	@GetMapping("list")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> emplist() {	
		System.out.println("전체사원");
		return orgchartMapper.empList();
	}
	
	@GetMapping("detail/{id}")
	Map<EmpPrvc, DeptInfo> emp(@PathVariable("id") Integer id) {
		System.out.println("사원 상세 정보");
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return orgchartMapper.empPrvc(emp);
	}
	
	// 팀별 사원
	@GetMapping("teamList/{code}")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> empTeam(@PathVariable("code") String code) {
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
	
	// 검색
	@GetMapping("empSch")
//	List<Map<EmpPrvc, DeptInfo>> searchEmp(EmpSearchReq req) {
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> searchEmp(EmpSearchReq req) {
		System.out.println("검색 진입");
		System.out.println(req.getSchFilter());
	    System.out.println(req.getSchValue());
		return orgchartMapper.searchEmp(req);
	}
	
	// 직책
	@GetMapping("register/jbttl")
	List<JbttlInfo> jbttlList() {
		return orgchartMapper.jbttlList();
	}
	
	// 사원 추가
	@PostMapping("/register")
	int registerEmp(@RequestBody EmpPrvc emp) {
		System.out.println("계정 생성 시도");
		return orgchartMapper.registerEmp(emp);
//		return 0;
	}
}
