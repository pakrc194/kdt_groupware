package vfive.gw.attendance.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.attendance.dto.AtdcCal;
import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface AtdcMapper {
	
	@Select("SELECT * FROM ATDC_HIST " +
      "WHERE EMP_ID = #{empId} " +
      "AND WRK_YMD LIKE CONCAT(#{yearMonth}, '%')")
	List<AtdcCal> myAtdcMon(@Param("empId") int empId,@Param("yearMonth") String yearMonth);
}
