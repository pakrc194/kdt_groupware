package vfive.gw.schedule.controller;

import java.sql.Date;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.schedule.dto.LocationInfo;
import vfive.gw.schedule.dto.Sched;
import vfive.gw.schedule.mapper.SchedMapper;
import vfive.gw.schedule.mapper.TodoMapper;

@RestController
@RequestMapping("/gw/schedule")
public class ScheduleController {

	@Resource
	TodoMapper todoMapper;
	
	@Resource
	SchedMapper schedMapper;
	
	@GetMapping("empinfo/{id}")
	Map<EmpPrvc, DeptInfo> loginInfo(@PathVariable("id") int id) {
		EmpPrvc emp = new EmpPrvc();
		emp.setEmpId(id);
		
		return schedMapper.loginInfo(emp);
	}
	
	@GetMapping("view/{sdate}/{edate}/{dept_id}/{emp_sn}/{emp_id}")
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
		return schedMapper.schedList(sc);
	}
	
	@GetMapping("sched_detail/{id}")
	Sched schedDetail(@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return schedMapper.schedDetail(sc);
	}
	
	@GetMapping("sched_search/{date}")
	List<Sched> schedMonthList(@PathVariable("date") Date date) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		System.out.println("일정리스트 "+ sc.getSchedDeptId()+", "+sc.getSchedAuthorId());
		return schedMapper.schedDailyList(sc);
	}
	
	@PostMapping("/todo/add")
	int schedAddTodo(@RequestBody Sched sc, HttpServletRequest request) {
		System.out.println("todo 생성 "+sc);
		sc.setSchedType("DTODO");
		return todoMapper.addTodo(sc);
	}
	
	@PostMapping("/todo/toggle")
	int schedToggleTodo(@RequestBody Sched sc) {
		System.out.println("todo 토글: "+sc);
		return todoMapper.toggleModifyTodo(sc);
	}
	
	@PostMapping("/todo/modify")
	int schedModifyTodo(@RequestBody Sched sc) {
		System.out.println("TODO 수정: "+sc);
		return todoMapper.schedModifyTodo(sc);
	}
	
	@RequestMapping("todo/delete/{id}")
	int schedDeleteTodo(
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return todoMapper.schedDeleteTodo(sc);
	}
	
	@GetMapping("todo/view/{date}/{id}")
	List<Sched> schedTodoList(
			@PathVariable("date") Date date,
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		sc.setSchedType("DTODO");
		sc.setSchedAuthorId(id);
		return todoMapper.shedTodoList(sc);
	}
	
	// 업무지시 팀 리스트
	@GetMapping("instruction/teams")
	List<DeptInfo> teamList() {
		System.out.println("팀 리스트");
		return schedMapper.teamList();
	}
	
	// 업무지시 장소 리스트
	@GetMapping("instruction/locations")
	List<LocationInfo> locationList() {
		return schedMapper.locationList();
	}
	
	// 업무지시 등록
	@PostMapping("/instruction/upload")
	int instructionUpload(@RequestBody Sched sc) {
//		sc.getId();
		return schedMapper.instructionUpload(sc);
		
//		return sc.getId();
	}

}
