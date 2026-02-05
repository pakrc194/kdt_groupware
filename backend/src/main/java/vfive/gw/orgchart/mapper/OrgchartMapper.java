package vfive.gw.orgchart.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;

@Mapper
public interface OrgchartMapper {

	@Select("select * from EMP_PRVC order by EMP_NM")
	List<EmpPrvc> empList();
	
	@Select("select * from EMP_PRVC where emp_id = #{empId}")
	EmpPrvc empPrvc(EmpPrvc emp);
	
	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "where EMP_PRVC.dept_id = (select dept_id from DEPT_INFO where dept_code = #{deptCode})")
	List<EmpPrvc> empTeamList(DeptInfo dInfo);
	
	@Select("select * from DEPT_INFO where dept_code = #{deptCode}")
	DeptInfo deptDetail(DeptInfo dInfo);
	
}
