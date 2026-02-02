package vfive.gw.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.Attendance;
import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface AttendanceMapper {
	
	@Select("select * from attendance where emp_id = #{empId}")
	List<Attendance> myAttendance(EmpPrvc emp);
}
