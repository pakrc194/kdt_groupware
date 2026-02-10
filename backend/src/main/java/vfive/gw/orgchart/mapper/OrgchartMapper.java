package vfive.gw.orgchart.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;
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
			+ "where EMP_PRVC.EMP_ACNT_STTS = 'ACTIVE' "
			+ "order by EMP_NM")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> empList();
	
	@Select("select EMP_PRVC.*, DEPT_INFO.*, JBTTL_INFO.* "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
			+ "where emp_id = #{empId}")
	Map<Map<EmpPrvc, DeptInfo>, JbttlInfo> empPrvc(EmpPrvc emp);
	
	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
			+ "where EMP_PRVC.dept_id = (select dept_id from DEPT_INFO "
			+ "where dept_code = #{deptCode}) "
			+ "and EMP_PRVC.EMP_ACNT_STTS = 'ACTIVE' "
			+ "order by EMP_NM "
			+ "")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> empTeamList(DeptInfo dInfo);
	
	@Select("select * from DEPT_INFO where dept_code = #{deptCode}")
	DeptInfo deptDetail(DeptInfo dInfo);
	
	@Select("<script>"
			+ "select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id"
			+ "<where>"
			+ "<if test = 'schValue != null'>"
			+ "${schFilter} like concat('%', #{schValue}, '%')"
			+ "</if> "
			+ "and EMP_PRVC.EMP_ACNT_STTS = 'ACTIVE' "
			+ "</where>"
			+ "order by EMP_NM"
			+ "</script>")
	List<Map<Map<EmpPrvc, DeptInfo>, JbttlInfo>> searchEmp(EmpSearchReq req);
	
	// 직책 정보
	@Select("select * from JBTTL_INFO")
	List<JbttlInfo> jbttlList();
	
	// 사원 추가
	@SelectKey(
			keyProperty = "empId",
			resultType = Integer.class,
			before = true,
			statement = "select count(*)+1 from EMP_PRVC where dept_id = #{deptId}"
			)
	@Insert("insert into EMP_PRVC (DEPT_ID, JBTTL_ID, EMP_BIRTH, EMP_NM, EMP_SN, EMP_PSWD) "
			+ "values (#{deptId}, #{jbttlId}, #{empBirth}, #{empNm}, "
			+ "concat("
			+ "(select dept_code from DEPT_INFO where dept_id = #{deptId}), "
			+ "(LPAD(#{empId}, 4, '0'))"
			+ "),"
			+ "concat((select dept_code from DEPT_INFO where dept_id = #{deptId}), '0000')"
			+ ")")
	int registerEmp(EmpPrvc emp);
	
	@Update("UPDATE EMP_PRVC "
			+ "SET emp_nm = #{empNm}, emp_birth = #{empBirth}, dept_id = #{deptId}, jbttl_id = #{jbttlId} "
			+ "WHERE emp_id = #{empId}")
	int modifyEmp(EmpPrvc emp);
	
	@Update("UPDATE EMP_PRVC "
			+ "SET EMP_ACNT_STTS = 'RETIRED', EMP_RSGNTN_YMD = now() "
			+ "WHERE emp_id = #{empId}")
	int deactivateEmp(EmpPrvc emp);
	
	@Select("select count(access_empower_id) from ACCESS_EMPOWER "
			+ "where access_type = #{accessType} "
			+ "and access_section = #{accessSection} "
			+ "and empower_id = #{empowerId} "
			+ "and access_detail = #{accessDetail}")
	int acccessDeptCk(AccessEmpowerDTO dto);
}
