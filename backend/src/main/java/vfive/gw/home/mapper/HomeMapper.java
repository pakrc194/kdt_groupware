package vfive.gw.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.home.dto.EmpPrvc;
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
	
	@Select("select * from SCHED where sched_start_date >= #{schedStartDate} and sched_end_date <= #{schedEndDate} and sched_state = #{schedState}")
	List<Sched> shedList(Sched sc);
	
	@Insert("insert into SCHED (sched_title, sched_detail, sched_type, sched_start_date, sched_end_date) "
			+ "values (#{schedTitle}, #{schedDetail}, #{schedType}, #{schedStartDate}, #{schedStartDate})")
	int addTodo(Sched sc);
	
	@Delete("delete from SCHED where sched_id = #{schedId}")
	int schedDeleteTodo(Sched sc);
	
	@Update("UPDATE SCHED "
			+ "SET sched_start_date = #{schedStartDate}, sched_title = #{schedTitle}, sched_detail = #{schedDetail} "
			+ "WHERE sched_id = #{schedId}")
	int modifyTodo(Sched sc);
	
	@Select("select * from SCHED where sched_start_date = #{schedStartDate} and sched_type = #{schedType}")
	List<Sched> shedTodoList(Sched sc);
	
	@Select("select * from SCHED where sched_id = #{schedId}")
	Sched schedDetail(Sched sc);
	
	@Select("select * from SCHED where sched_start_date = #{schedStartDate}")
	List<Sched> schedDailyList(Sched sc);
}
