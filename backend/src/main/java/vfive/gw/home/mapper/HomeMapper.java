package vfive.gw.home.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface HomeMapper {
	
	@Select("select * from EMP_PRVC where emp_id = #{empId}")
	EmpPrvc empPrvc(EmpPrvc emp);
}
