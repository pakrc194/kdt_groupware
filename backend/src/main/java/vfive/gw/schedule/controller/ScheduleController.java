package vfive.gw.schedule.controller;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.SelectKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.ntf.dto.NtfRequest;
import vfive.gw.ntf.mapper.NtfMapper;
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
	
	@Autowired
    private NtfMapper ntfMapper;
	
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
	
//	@GetMapping("sched_search/{date}/{empId}")
//	List<Sched> schedMonthList(
//			@PathVariable("date") String date,
//			@PathVariable("empId") String empId) {
//		Sched sc = new Sched();
//		sc.setSchedStartDate(date);
//		sc.setSchedEmpId(empId);		// 수정 필요
//		return schedMapper.schedDailyList(sc);
//	}
	
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
	int sched_delete(@PathVariable("id") int id,
			@RequestParam("empId") int empId,
			@RequestParam("title") String title,
			@RequestParam("type") String type,
			@RequestParam("dept") String deptId,
			@RequestParam("pers") String persId) {
		
		System.out.println("일정 삭제 알림전송 "+ id+", "+empId+", "+title+", "+type);
		String now = java.time.LocalDateTime.now()
					.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
		Sched sc = new Sched();
		sc.setSchedDeptId(deptId);
		sc.setSchedEmpId(persId);

		// A. NTF 테이블 (알림 마스터) 생성
        NtfRequest ntfReq = new NtfRequest();
        ntfReq.setNtfType("SCHED_DELETE");
        ntfReq.setTitle("❌ 일정 삭제");
        ntfReq.setBody(title);      // 글 제목을 알림 본문으로
        ntfReq.setLinkUrl("/schedule/check/calendar");     // 클릭 시 이동할 리액트 경로
        ntfReq.setSrcType("SCHED");
        ntfReq.setSrcId(id);
        ntfReq.setCreatedBy(empId);
        ntfReq.setCreatedAt(now);
        
        // ntfId가 auto_increment로 생성되어 ntfReq에 주입됨
        ntfMapper.insertNtf(ntfReq); 
        
        // B. NTF_RCP 테이블 (수신자 목록) 생성
        if (type.equals("COMPANY")) {
        	System.out.println("회사 일정");
        	List<Integer> allEmpIds = schedMapper.selectAllEmpIds(); 
        	
        	if (allEmpIds != null && !allEmpIds.isEmpty()) {
        		System.out.println("전체 사원 알림");
        		// NtfMapper의 insertReceivers 호출
        		ntfMapper.insertReceivers(ntfReq.getNtfId(), allEmpIds, now);
        	}
        }
        else if (type.equals("DEPT")) {
        	System.out.println("팀 일정");
        	List<Integer> teamEmpIds = schedMapper.selectTeamEmpIds(sc);
        	
        	if (teamEmpIds != null && !teamEmpIds.isEmpty()) {
        		System.out.println("팀에게 알림");
        		// NtfMapper의 insertReceivers 호출
        		ntfMapper.insertReceivers(ntfReq.getNtfId(), teamEmpIds, now);
        	}
        }
        else if (type.equals("PERSONAL")) {
        	System.out.println("개인 일정");
        	List<Integer> persEmpIds = schedMapper.selectPersEmpIds(sc);
        	
        	if (persEmpIds != null && !persEmpIds.isEmpty()) {
        		System.out.println("개인에게 알림");
        		// NtfMapper의 insertReceivers 호출
        		ntfMapper.insertReceivers(ntfReq.getNtfId(), persEmpIds, now);
        	}
        }
        ResponseEntity.ok(Map.of("success", true,"schedId", id));

        
        
		
		sc.setSchedId(id);
		return schedMapper.sched_delete(sc);
//		return 1;
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
	
	// 업무지시 중 일정이 있는 장소 조회
	@GetMapping("instruction/schedLocs/{sdate}/{edate}")
	List<Integer> sechedLocList(
			@PathVariable("sdate") String sdate,
			@PathVariable("edate") String edate) {
		System.out.println("장소 일정");
		Sched sc = new Sched();
		sc.setSchedStartDate(sdate);
		sc.setSchedEndDate(edate);
		return schedMapper.sechedLocList(sc);
	}
	
	// 알림 전송용
	@PostMapping("/instruction/alert")
    public ResponseEntity<?> createBoard(
    		@RequestBody Sched sc) {
        System.out.println("알림전송 "+ sc.getSchedType());
        String now = java.time.LocalDateTime.now()
        		.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        
         int id = schedMapper.maxId();
        // A. NTF 테이블 (알림 마스터) 생성
        NtfRequest ntfReq = new NtfRequest();
        ntfReq.setNtfType("SCHED_APPLIED");
        ntfReq.setTitle("📅 새로운 일정");
        ntfReq.setBody(sc.getSchedTitle());      // 글 제목을 알림 본문으로
        ntfReq.setLinkUrl("/schedule/check/calendar/detail/"+id);     // 클릭 시 이동할 리액트 경로
        ntfReq.setSrcType("SCHED");
        ntfReq.setSrcId(id);
        ntfReq.setCreatedBy(sc.getSchedAuthorId());
        ntfReq.setCreatedAt(now);
        
        // ntfId가 auto_increment로 생성되어 ntfReq에 주입됨
        ntfMapper.insertNtf(ntfReq); 
        
        // B. NTF_RCP 테이블 (수신자 목록) 생성
        if (sc.getSchedType().equals("COMPANY")) {
        	System.out.println("회사 일정");
        	List<Integer> allEmpIds = schedMapper.selectAllEmpIds(); 
        	
        	if (allEmpIds != null && !allEmpIds.isEmpty()) {
        		System.out.println("전체 사원 알림");
        		// NtfMapper의 insertReceivers 호출
        		ntfMapper.insertReceivers(ntfReq.getNtfId(), allEmpIds, now);
        	}
        }
        else if (sc.getSchedType().equals("DEPT")) {
        	System.out.println("팀 일정");
        	List<Integer> teamEmpIds = schedMapper.selectTeamEmpIds(sc);
        	
        	if (teamEmpIds != null && !teamEmpIds.isEmpty()) {
        		System.out.println("팀에게 알림");
        		// NtfMapper의 insertReceivers 호출
        		ntfMapper.insertReceivers(ntfReq.getNtfId(), teamEmpIds, now);
        	}
        }
        return ResponseEntity.ok(Map.of("success", true,"schedId", id));
        
        
    }

}
