package vfive.gw.home.controller;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vfive.gw.BackendApplication;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import vfive.gw.home.dto.DeptInfo;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.dto.LocationInfo;
import vfive.gw.home.dto.Sched;
import vfive.gw.home.mapper.HomeMapper;

@RestController
@RequestMapping("/gw/home/{service}")
public class HomeController {

    private final BackendApplication backendApplication;
	@Resource
	HomeMapper mapper;

    HomeController(BackendApplication backendApplication) {
        this.backendApplication = backendApplication;
    }
	
//	@GetMapping
//	EmpPrvc emp() {
//		EmpPrvc emp = new EmpPrvc();
//		emp.setEmpId(1);
//		
//		return mapper.empPrvc(emp);
//	}
	
	@GetMapping
	void home(
	    @PathVariable("service") String service
	) {
		System.out.println("서비스 접근");
//	    return "service = " + service;
	}
	
	@GetMapping("list")
	List<EmpPrvc> emplist() {		
		return mapper.empList();
	}
	
	@GetMapping("detail/{id}")
	EmpPrvc emp(@PathVariable("id") int id) {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return mapper.empPrvc(emp);
	}
	
	@GetMapping("teamList/{code}")
	List<EmpPrvc> empTeam(@PathVariable("code") String code) {
		System.out.println(code);
		EmpPrvc emp = new EmpPrvc();
		emp.setDeptCode(code);
		
		return mapper.empTeamList(emp);
	}
	
	@GetMapping("schedule/{sdate}/{edate}/{dept_id}/{emp_sn}/{emp_id}")
	List<Sched> schedList(
			@PathVariable("sdate") Date sdate,
			@PathVariable("edate") Date edate,
			@PathVariable("dept_id") String dept_id,
			@PathVariable("emp_sn") String emp_sn,
			@PathVariable("emp_id") int emp_id
			) {
		Sched sc = new Sched();
		sc.setSchedStartDate(sdate);
		sc.setSchedEndDate(edate);
		sc.setSchedState("0");		// 고정
		sc.setSchedDeptId(dept_id);
		sc.setSchedEmpSn(emp_sn);	// 사번
		sc.setSchedAuthorId(emp_id);
		return mapper.schedList(sc);
	}
	
	@GetMapping("todo/view/{date}/{id}")
	List<Sched> schedTodoList(
			@PathVariable("date") Date date,
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		sc.setSchedType("DTODO");
		sc.setSchedAuthorId(id);
		return mapper.shedTodoList(sc);
	}
	
	@PostMapping("/todo/add")
	int schedAddTodo(@RequestBody Sched sc, HttpServletRequest request) {
		System.out.println("todo 생성 "+sc);
		sc.setSchedType("DTODO");
		return mapper.addTodo(sc);
	}
	
//	@PostMapping("/instruction/upload")
//	int instructionUpload(@RequestBody Sched sc) {
//		mapper.instructionUpload(sc);
//		return 1;
//	}
	
	@PostMapping("/todo/modify")
	int schedModifyTodo(@RequestBody Sched sc) {
		System.out.println("TODO 수정: "+sc);
		return mapper.schedModifyTodo(sc);
	}
	
	@RequestMapping("todo/delete/{id}")
	int schedDeleteTodo(
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return mapper.schedDeleteTodo(sc);
	}
	
	@PostMapping("/todo/toggle")
	int schedToggleTodo(@RequestBody Sched sc) {
		System.out.println("todo 토글: "+sc);
		return mapper.toggleModifyTodo(sc);
	}
	
	@GetMapping("schedule/empinfo/{id}")
	EmpPrvc loginInfo(@PathVariable("id") int id) {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return mapper.loginInfo(emp);
	}
	
	// 업무지시 팀 리스트
	@GetMapping("instruction/teams")
	List<DeptInfo> teamList() {
		System.out.println("팀 리스트");
		return mapper.teamList();
	}
	
	// 업무지시 장소 리스트
	@GetMapping("instruction/locations")
	List<LocationInfo> locationList() {
		return mapper.locationList();
	}
	
	// 업무지시 등록
	@PostMapping("/instruction/upload")
	int instructionUpload(@RequestBody Sched sc) {
//		sc.getId();
		return mapper.instructionUpload(sc);
		
//		return sc.getId();
	}
	
	
	@GetMapping("sched_detail/{id}")
	Sched schedDetail(@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return mapper.schedDetail(sc);
	}
	
	@GetMapping("sched_search/{date}")
	List<Sched> schedMonthList(@PathVariable("date") Date date) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		System.out.println("일정리스트 "+ sc.getSchedDeptId()+", "+sc.getSchedAuthorId());
		return mapper.schedDailyList(sc);
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
