package vfive.gw.attendance.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;
import vfive.gw.attendance.service.DutyGroupUpdateService;
import vfive.gw.attendance.service.DutySkedDeleteService;
import vfive.gw.attendance.service.DutySkedDetailService;
import vfive.gw.attendance.service.DutySkedInsertFormService;
import vfive.gw.attendance.service.DutySkedInsertService;
import vfive.gw.attendance.service.DutySkedListService;
import vfive.gw.attendance.service.DutySkedUpdateService;
import vfive.gw.attendance.service.DutySkedViewService;
import vfive.gw.home.controller.HomeController;

@RestController
@RequestMapping("/gw/duty")
public class DutyController {
	
	@Resource
	DutySkedListService dutySkedListService;
	
	@Resource
	DutySkedDetailService dutySkedDetailService;
	
	@Resource
	DutySkedViewService dutySkedViewService;
	
	@Resource
	DutySkedInsertFormService dutySkedInsertFormService;

	@Resource
	DutySkedInsertService dutySkedInsertService;
	
	@Resource
	DutySkedDeleteService dutySkedDeleteService;
	
	@Resource
	DutyGroupUpdateService dutyGroupUpdateService;
	
	@Resource
	DutySkedUpdateService dutySkedUpdateService;
	
	// 근무표 리스트
	@GetMapping("list")
	List<DutySkedListDTO> list(EmpAtdcRequestDTO req) {
		
		List<DutySkedListDTO> res = dutySkedListService.execute(req); 
		
		return res;
	}
	
	// 근무표 리스트 삭제
	@DeleteMapping("delete")
	ResponseEntity<?> delete(@RequestBody Map<String, List<Integer>> req) {
		List<Integer> dutyIds = req.get("dutyIds");
		
		System.out.println(dutyIds);
		
		dutySkedDeleteService.execute(dutyIds);
		
		Map<String, String> res = new HashMap<>();
		res.put("message", "삭제 성공");
		
		return ResponseEntity.ok(res);
	}
	
	// 근무표 상세(수정포함)
	@GetMapping("detail")
	Map<String, Object> detail(DutyRequestDTO req) {
		Map<String, Object> res = dutySkedDetailService.execute(req);
		
		return res;
	}
	
	// 근무표 수정
	@PutMapping("updateDuty")
	ResponseEntity<?> updateDuty(@RequestBody DutyRequestDTO req) {
		
		dutySkedUpdateService.execute(req);
		
		Map<String, String> res = new HashMap<>();
		res.put("message", "수정 성공");
		
		return ResponseEntity.ok(res);
	}
	
	// 근무표 작성 폼
	@GetMapping("insertForm")
	List<EmpDTO> insertForm(EmpAtdcRequestDTO req) {
		
		List<EmpDTO> res = dutySkedInsertFormService.execute(req);
		
		return res;
	}
	
	@PutMapping("updateGroups")
	ResponseEntity<?> updateGroup(@RequestBody List<Map<String, Object>> req) {
			
		
			System.out.println(req);
			
			dutyGroupUpdateService.execute(req);
			
			
			Map<String, String> res = new HashMap<>();
			res.put("message", "사원 조 정보가 업데이트되었습니다.");
			
			return ResponseEntity.ok(res);
	}
	
	// 근무표 등록
	@PostMapping("insert")
	ResponseEntity<?> insert(@RequestBody DutyRequestDTO req) {
		
		System.out.println(req);
		
		dutySkedInsertService.execute(req);
		
		Map<String, String> res = new HashMap<>();
		res.put("message", "등록 성공");
		
		return ResponseEntity.ok(res);
	}
	
	// 근무표 조회(팀원)
	@GetMapping("view")
	Map<String, Object> view(DutyRequestDTO req) {
		
		Map<String, Object> res = dutySkedViewService.execute(req);
		
		return res;
	}
	
}
