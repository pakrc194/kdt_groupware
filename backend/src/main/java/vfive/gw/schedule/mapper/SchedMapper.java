package vfive.gw.schedule.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.schedule.dto.LocInfo;
import vfive.gw.schedule.dto.Sched;

@Mapper
public interface SchedMapper {

	// 한달 일정 불러오기
		// 작성자가 본인인 TODO, 본인 팀, 본인 개인 일정
		@Select("select * from SCHED "
				+ "where "
				+ "sched_end_date >= #{schedStartDate} and sched_start_date <= #{schedEndDate} "
				+ "and sched_state = 0 "
				+ "and "
				+ "((sched_type = 'COMPANY' ) "	// 회사일정
				+ "or (sched_type = 'DEPT' and FIND_IN_SET(#{schedDeptId}, sched_dept_id) > 0) "
				+ "or (sched_type = 'PERSONAL' and sched_emp_Id = #{schedEmpId}) "
				+ "or (sched_type = 'PERSONAL' and FIND_IN_SET(#{schedDeptId}, sched_dept_id) > 0) "
				+ "or (sched_type = 'TODO' and sched_author_id = #{schedAuthorId}) "
				+ "or (sched_author_id = #{schedAuthorId})) "
				+ "order by sched_type")
		List<Sched> schedList(Sched sc);
		
		// 로그인 유저 정보
		@Select("select EMP_PRVC.*, DEPT_INFO.* from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id where EMP_ID = #{empId}")
		Map<EmpPrvc, DeptInfo> loginInfo(EmpPrvc emp);
		
		// 업무지시 팀 리스트
		@Select("select * from DEPT_INFO")
		List<DeptInfo> teamList();
		
		// 업무지시 장소 리스트
		@Select("select * from LOC_INFO")
		List<LocInfo> locationList();
		
		// 업무지시 등록
		@SelectKey(
				keyProperty = "schedId",
				resultType = Integer.class,
				before = false,
				statement = "select max(sched_Id) from SCHED"
				)
		@Insert("insert into SCHED (sched_title, sched_detail, sched_type, sched_start_date, sched_end_date, sched_author_id, sched_dept_id) "
				+ "values (#{schedTitle}, #{schedDetail}, #{schedType}, #{schedStartDate}, #{schedEndDate}, #{schedAuthorId}, #{schedDeptId})")
		int instructionUpload(Sched sc);
		
		@Select("select * from SCHED where sched_id = #{schedId}")
		Sched schedDetail(Sched sc);
		
//		@Select("select * from SCHED "
//				+ "where ("
//				+ "(sched_start_date <= #{schedStartDate} and sched_end_date >= #{schedStartDate}) "
//				+ "and (sched_type != 'TODO' and sched_state = 0) "
//				+ ")")
//		List<Sched> schedDailyList(Sched sc);
		
		@Update("update SCHED "
				+ "set sched_state = '1', sched_delete_date = now() "
				+ "where sched_id = #{schedId}")
		int sched_delete(Sched sc);
		
		// 스케쥴이 있는 팀 리스트
		@Select("select sched_dept_id from SCHED "
				+ "where "
				+ "sched_type = 'DEPT' "
				+ "and ("
				+ "sched_start_date between #{schedStartDate} and #{schedEndDate} "		// 선택된 일정 중에 시작 날짜가 있음
				+ "or sched_end_date between #{schedStartDate} and #{schedEndDate} "	// 선택된 일정 중에 종료 날짜가 있음
				+ "or #{schedStartDate} between sched_start_date and sched_end_date "
				+ "or #{schedEndDate} between sched_start_date and sched_end_date"
				+ ")")
		List<String> schedTeamList(Sched sc);
	
}
