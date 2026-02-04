package vfive.gw.attendance.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.attendance.dto.AtdcCalDTO;
import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface AtdcMapper {
	
	// 근태 캘린더(월 단위 근태 리스트)
	@Select("SELECT * FROM ATDC_HIST " +
      "WHERE EMP_ID = #{empId} " +
      "AND WRK_YMD LIKE CONCAT(#{yearMonth}, '%')")
	List<AtdcCalDTO> myAtdcMon(@Param("empId") int empId,@Param("yearMonth") String yearMonth);
	
	
	
}
