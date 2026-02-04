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

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.dto.Sched;
import vfive.gw.home.mapper.HomeMapper;

@RestController
@RequestMapping("/gw/home/{service}")
public class HomeController {
	@Resource
	HomeMapper mapper;
	
//	@GetMapping
//	EmpPrvc emp() {
//		EmpPrvc emp = new EmpPrvc();
//		emp.setEmpId(1);
//		
//		return mapper.empPrvc(emp);
//	}
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
	
	@GetMapping("schedule/{sdate}/{edate}")
	List<Sched> schedList(
			@PathVariable("sdate") Date sdate,
			@PathVariable("edate") Date edate) {
		Sched sc = new Sched();
		sc.setSchedStartDate(sdate);
		sc.setSchedEndDate(edate);
		sc.setSchedState("0");
		return mapper.shedList(sc);
	}
	
	@GetMapping("todo/{date}")
	List<Sched> schedTodoList(
			@PathVariable("date") Date date) {
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		sc.setSchedType("TODO");
		return mapper.shedTodoList(sc);
	}
//	
	@PostMapping("/todo/add")
	int schedAddTodo(@RequestBody Sched sc, HttpServletRequest request) {
		System.out.println("todo 생성 "+sc);
		sc.setSchedType("TODO");
		return mapper.addTodo(sc);
	}
	
	@RequestMapping("todo/delete/{id}")
	int schedDeleteTodo(
			@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return mapper.schedDeleteTodo(sc);
	}
	
	@PostMapping("/todo/state/{id}")
	void schedModifyTodo(
			@PathVariable("id") int id) {
		System.out.println("todo 수정");
		Sched sc = new Sched();
		sc.setSchedId(id);
		mapper.modifyTodo(sc);
	}
	
	@GetMapping("sched_detail/{id}")
	Sched schedDetail(@PathVariable("id") int id) {
		Sched sc = new Sched();
		sc.setSchedId(id);
		return mapper.schedDetail(sc);
	}
	
	@GetMapping("sched_search/{date}")
	List<Sched> schedMonthList(@PathVariable("date") Date date) {
		System.out.println("일정리스트");
		Sched sc = new Sched();
		sc.setSchedStartDate(date);
		return mapper.schedDailyList(sc);
	}
	
	@PostMapping
	public Map<String, Object> test(@RequestBody Map<String, Object> body) {
		body.put("result", "ok");
	    return body;
	}
}
