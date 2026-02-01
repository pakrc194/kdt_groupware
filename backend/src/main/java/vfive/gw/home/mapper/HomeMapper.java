package vfive.gw.main.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.main.dto.EmpPrvc;

@Mapper
public interface MainMapper {
	
	@Select("select * from EMP_PRVC where emp_no = #{empNo}")
	EmpPrvc empPrvc(EmpPrvc emp);
}
