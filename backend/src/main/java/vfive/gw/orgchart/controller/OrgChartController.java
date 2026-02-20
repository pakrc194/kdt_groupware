package vfive.gw.orgchart.controller;

import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.orgchart.dto.EmpSearchReq;
import vfive.gw.orgchart.dto.HRChangeHistDTO;
import vfive.gw.orgchart.dto.JbttlInfo;
import vfive.gw.orgchart.mapper.OrgchartMapper;

@RestController
@RequestMapping("/gw/orgChart")
public class OrgChartController {

	@Resource
	OrgchartMapper orgchartMapper;
	
	// 조직도
	@GetMapping("list")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> emplist() {	
		return orgchartMapper.empList();
	}
	
	@GetMapping("detail/{id}")
	Map<Map<EmpPrvc, DeptInfo>, JbttlInfo> emp(@PathVariable("id") Integer id) {
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
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> searchEmp(EmpSearchReq req) {
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
		return orgchartMapper.registerEmp(emp);
	}
		
	// 계정 정보 수정
	@PostMapping("/modifyInfo")
	int modifyEmp(@RequestBody EmpPrvc emp) {
		return orgchartMapper.modifyEmp(emp);
	}
	
	// 수정 정보 저장
	@PostMapping("/modifyHist")
	int modifyHist(@RequestBody HRChangeHistDTO dto) {
		return orgchartMapper.modifyHist(dto);
	}
	
	// 계정 비활성화
	@PostMapping("/deactivate")
	int deactivateEmp(@RequestBody EmpPrvc emp) {
		return orgchartMapper.deactivateEmp(emp);
	}
	
	@GetMapping("access")
	int accessCk(
			@RequestParam("id") int id,
			@RequestParam("section") String section,
			@RequestParam("type") String type,
			@RequestParam("accessId") int accessId) {
		AccessEmpowerDTO dto = new AccessEmpowerDTO();
		dto.setAccessType(type);	// 팀, 직책 구분
		dto.setEmpowerId(id);	// 권한을 확인할 ID (팀 ID, 직책 ID)
		dto.setAccessSection(section);	// 권한 확인 위치 (상단메뉴 중 하나)
		dto.setAccessDetail(accessId);	// 상세 권한 ID
		int ck = orgchartMapper.acccessDeptCk(dto);
		
		return ck;
	}
	

}
