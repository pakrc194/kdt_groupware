package vfive.gw.schedule.controller;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.SelectKey;
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
import vfive.gw.schedule.dto.LocInfo;
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
	
	@GetMapping("view/{sdate}/{edate}/{dept_id}/{emp_id}")
	List<Sched> schedList(
			@PathVariable("sdate") String sdate,
			@PathVariable("edate") String edate,
			@PathVariable("dept_id") String dept_id,
			@PathVariable("emp_id") int emp_id
			) {
		Sched sc = new Sched();
		sc.setSchedStartDate(sdate);
		sc.setSchedEndDate(edate);
		sc.setSchedState("0");		// 고정
		sc.setSchedDeptId(dept_id);
		sc.setSchedEmpId(emp_id+"");	// 사번
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
	List<Sched> schedMonthList(@PathVariable("date") String date) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		return schedMapper.schedDailyList(sc);
	}
	
	@PostMapping("/todo/add")
	int schedAddTodo(@RequestBody Sched sc, HttpServletRequest request) {
		sc.setSchedType("TODO");
		return todoMapper.addTodo(sc);
	}
	
	@PostMapping("/todo/toggle")
	int schedToggleTodo(@RequestBody Sched sc) {
		return todoMapper.toggleModifyTodo(sc);
	}
	
	@PostMapping("/todo/modify")
	int schedModifyTodo(@RequestBody Sched sc) {
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
			@PathVariable("date") String date,
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		sc.setSchedType("TODO");
		sc.setSchedAuthorId(id);
		List<Sched> res = todoMapper.shedTodoList(sc);
		return res;
	}
	
	// 업무지시 팀 리스트
	@GetMapping("instruction/teams")
	List<DeptInfo> teamList() {
		return schedMapper.teamList();
	}
	
	// 업무지시 장소 리스트
	@GetMapping("instruction/locations")
	List<LocInfo> locationList() {
		return schedMapper.locationList();
	}
	
	// 업무지시 등록
	@PostMapping("/instruction/upload")
	int instructionUpload(@RequestBody Sched sc) {
		schedMapper.instructionUpload(sc);
		return sc.getSchedId();
	}
	
	// 업무 삭제
	@GetMapping("sched_delete/{id}")
	int sched_delete(@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return schedMapper.sched_delete(sc);
	}
	
	// 업무 지시 중 일정이 있는 팀 조회
	@GetMapping("instruction/schedTeams/{sdate}/{edate}")
	List<String> schedTeamList(
			@PathVariable("sdate") String sdate,
			@PathVariable("edate") String edate) {
		Sched sc = new Sched();
		sc.setSchedStartDate(sdate);
		sc.setSchedEndDate(edate);
		return schedMapper.schedTeamList(sc);
	}

}
