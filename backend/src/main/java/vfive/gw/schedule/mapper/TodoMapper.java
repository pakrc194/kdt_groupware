package vfive.gw.schedule.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.schedule.dto.Sched;

@Mapper
public interface TodoMapper {
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
		
		@Select("select * from SCHED where sched_start_date <= #{schedStartDate} and sched_type = #{schedType} and sched_author_id = #{schedAuthorId} order by sched_start_date desc")
		List<Sched> shedTodoList(Sched sc);
}
