package vfive.gw.orgchart.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.orgchart.dto.DeptInfo;
import vfive.gw.orgchart.dto.EmpSearchReq;
import vfive.gw.orgchart.dto.JbttlInfo;

@Mapper
public interface OrgchartMapper {

	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
			+ "order by EMP_NM")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> empList();
	
	@Select("select EMP_PRVC.*, DEPT_INFO.* from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id where emp_id = #{empId}")
	Map<EmpPrvc, DeptInfo> empPrvc(EmpPrvc emp);
	
	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
			+ "where EMP_PRVC.dept_id = (select dept_id from DEPT_INFO "
			+ "where dept_code = #{deptCode}) order by EMP_NM")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> empTeamList(DeptInfo dInfo);
	
	@Select("select * from DEPT_INFO where dept_code = #{deptCode}")
	DeptInfo deptDetail(DeptInfo dInfo);
	
	@Select("<script>"
			+ "select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id"
//			+ "<if test = 'schFilter == JBTTL_NM'>"
//			+ "select EMP_PRVC.*, DEPT_INFO.* "
//			+ "from EMP_PRVC join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
//			+ "</if>"
			+ "<where>"
			+ "<if test = 'schValue != null'>"
			+ "${schFilter} like concat('%', #{schValue}, '%')"
			+ "</if>"
			+ "</where>"
			+ "order by EMP_NM"
			+ "</script>")
//	List<Map<EmpPrvc, DeptInfo>> searchEmp(EmpSearchReq req);
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> searchEmp(EmpSearchReq req);
	
}
