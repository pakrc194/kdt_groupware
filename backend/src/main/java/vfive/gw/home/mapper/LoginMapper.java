package vfive.gw.home.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface LoginMapper {
	
	@Select("SELECT * FROM EMP_PRVC WHERE emp_sn = #{empSn} AND emp_pswd = #{empPswd}")
	EmpPrvc loginSelect(@Param("empSn") String empSn,@Param("empPswd") String empPswd);
	
	@Insert("Insert INTO EMP_PRVC(emp_sn,emp_nm,emp_pswd) VALUES (#{empSn},#{empNm},#{empPswd})")
	int insertEmp(EmpPrvc vo);
}
