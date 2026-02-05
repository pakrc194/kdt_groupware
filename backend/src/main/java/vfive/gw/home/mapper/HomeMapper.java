package vfive.gw.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.home.dto.DeptInfo;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.dto.LocationInfo;
import vfive.gw.home.dto.Sched;

@Mapper
public interface HomeMapper {
	
	@Select("select * from EMP_PRVC order by EMP_NM")
	List<EmpPrvc> empList();
	
	@Select("select * from EMP_PRVC where emp_id = #{empId}")
	EmpPrvc empPrvc(EmpPrvc emp);
	
	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id where EMP_PRVC.dept_id = (select dept_id from DEPT_INFO where dept_code = #{deptCode})")
	List<EmpPrvc> empTeamList(EmpPrvc emp);
	
//	@Select("select * from SCHED")
//	List<Sched> shedList();
	
	// 한달 일정 불러오기
	// 작성자가 본인인 TODO, 본인 팀, 본인 개인 일정
	@Select("select * from SCHED "
			+ "where "
			+ "sched_end_date >= #{schedStartDate} and sched_start_date <= #{schedEndDate} "
			+ "and (sched_type = 'ACOMPANY' "	// 회사일정
			+ "or (sched_type = 'BTEAM' and FIND_IN_SET(#{schedTeamId}, sched_team_id) > 0) "
			+ "or (sched_type = 'CPERSONAL' and sched_emp_sn = #{schedEmpSn})"
			+ "or (sched_type = 'DTODO' and sched_author_id = #{schedAuthorId} and sched_state = #{schedState}) "
			+ "or (sched_emp_sn = #{schedEmpSn}))"
			+ "order by sched_type")
	List<Sched> schedList(Sched sc);
	
	// TODO 추가
	@Insert("insert into SCHED (sched_title, sched_detail, sched_type, sched_start_date, sched_end_date, sched_author_id) "
			+ "values (#{schedTitle}, #{schedDetail}, #{schedType}, #{schedStartDate}, #{schedStartDate}, #{schedAuthorId})")
	int addTodo(Sched sc);
	
	@Delete("delete from SCHED where sched_id = #{schedId}")
	int schedDeleteTodo(Sched sc);
	
	@Update("update SCHED "
			+ "set sched_title = #{schedTitle}, sched_detail = #{schedDetail}, "
			+ "sched_start_date = #{schedStartDate}, sched_end_date = #{schedStartDate}, sched_author_id = #{schedAuthorId} "
			+ "where sched_id = #{schedId}")
	int schedModifyTodo(Sched sc);
	
	@Update("UPDATE SCHED "
			+ "SET sched_start_date = #{schedStartDate}, sched_title = #{schedTitle}, sched_detail = #{schedDetail}, "
			+ "sched_state = #{schedState} "
			+ "WHERE sched_id = #{schedId}")
	int toggleModifyTodo(Sched sc);
	
	// 로그인 유저 정보
	@Select("select EMP_PRVC.*, DEPT_INFO.dept_code from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id where EMP_ID = #{empId}")
	EmpPrvc loginInfo(EmpPrvc emp);
	
	// 업무지시 팀 리스트
	@Select("select * from DEPT_INFO")
	List<DeptInfo> teamList();
	
	// 업무지시 장소 리스트
	@Select("select * from LOCATION_INFO")
	List<LocationInfo> locationList();
	
	// 업무지시 등록
	@Insert("insert into SCHED (sched_title, sched_detail, sched_type, sched_start_date, sched_end_date, sched_author_id, sched_team, sched_team_id, sched_emp_sn) "
			+ "values (#{schedTitle}, #{schedDetail}, #{schedType}, #{schedStartDate}, #{schedEndDate}, #{schedAuthorId}, #{schedTeam}, #{schedTeamId}, #{schedEmpSn})")
	int instructionUpload(Sched sc);
	
	@Select("select * from SCHED where sched_start_date <= #{schedStartDate} and sched_type = #{schedType} and sched_author_id = #{schedAuthorId} order by sched_start_date desc")
	List<Sched> shedTodoList(Sched sc);
	
	@Select("select * from SCHED where sched_id = #{schedId}")
	Sched schedDetail(Sched sc);
	
	@Select("select * from SCHED where (sched_start_date <= #{schedStartDate} and sched_end_date >= #{schedStartDate})")
	List<Sched> schedDailyList(Sched sc);
}
