package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessDeleteDTO;
import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;
import vfive.gw.dashboard.dto.request.AprvPrcsDTO;
import vfive.gw.dashboard.dto.request.CompHRDTO;
import vfive.gw.dashboard.dto.request.CompSchedDTO;
import vfive.gw.orgchart.dto.HRChangeHistDTO;

@Mapper
public interface CompDashMapper {

//	"select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
//			+ "from EMP_PRVC "
//			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
//			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
//			+ "where EMP_PRVC.EMP_ACNT_STTS = 'ACTIVE' "
//			+ "order by EMP_NM"
	
	
	@Select("select EMP_PRVC.*, DEPT_INFO.DEPT_NAME, JBTTL_INFO.JBTTL_NM "
			+ "from EMP_PRVC "
			+ "join DEPT_INFO on EMP_PRVC.dept_id = DEPT_INFO.dept_id "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id ")
	List<CompHRDTO> hrEmpList();
	
	@Select("select h.*, bDept.DEPT_NAME AS bDeptName, aDept.DEPT_NAME AS aDeptName, "
			+ "bJbttl.JBTTL_NM AS bJbttlNm, aJbttl.JBTTL_NM AS aJbttlNm "
			+ "FROM HR_CHANGE_HISTORY h "
			+ "LEFT JOIN DEPT_INFO bDept ON h.before_dept_id = bDept.dept_id "
			+ "LEFT JOIN DEPT_INFO aDept ON h.after_dept_id = aDept.dept_id "
			+ "LEFT JOIN JBTTL_INFO bJbttl ON h.before_jbttl_id = bJbttl.jbttl_id "
			+ "LEFT JOIN JBTTL_INFO aJbttl ON h.after_jbttl_id = aJbttl.jbttl_id")
	List<HRChangeHistDTO> hrHistList();
	
	@Select("SELECT ACCESS_DELETE.*, ACCESS_LIST.ACCESS_DETAIL AS ACCESS_NAME, "
			+ "case "
			+ "when ACCESS_DELETE.ACCESS_DELETE_TYPE = 'DEPT' "
			+ "then DEPT_INFO.DEPT_NAME "
			+ "else JBTTL_INFO.JBTTL_NM "
			+ "end as EMPOWER_NAME "
			+ "FROM ACCESS_DELETE "
			+ "left JOIN DEPT_INFO "
			+ "ON DEPT_INFO.DEPT_ID = ACCESS_DELETE.DELETE_EMPOWER_ID "
			+ "JOIN ACCESS_LIST "
			+ "ON ACCESS_DELETE.ACCESS_DELETE_DETAIL = ACCESS_LIST.ACCESS_LIST_ID "
			+ "left JOIN JBTTL_INFO on JBTTL_INFO.JBTTL_ID = ACCESS_DELETE.DELETE_EMPOWER_ID")
	List<AccessDeleteDTO> accessDeleteList();
	
//	@Select("select SCHED.*, DEPT_INFO.dept_name as schedDeptNm, EMP_PRVC.emp_nm as schedEmpNm, LOC_INFO.loc_nm as schedLocNm "
//			+ "from SCHED "
//			+ "left join DEPT_INFO on FIND_IN_SET(DEPT_INFO.dept_ID, SCHED.sched_dept_id) > 0 "
//			+ "left join EMP_PRVC on FIND_IN_SET(EMP_PRVC.emp_id, SCHED.sched_emp_id) > 0 "
//			+ "left join LOC_INFO on FIND_IN_SET(LOC_INFO.loc_id, SCHED.sched_loc) > 0 "
//			+ "where sched_delete_date is not null")
	

	@Select("SELECT SCHED.*, "
			+ "GROUP_CONCAT(DISTINCT DEPT_INFO.dept_name SEPARATOR ', ') AS schedDeptNm, "
			+ "GROUP_CONCAT(DISTINCT EMP_PRVC.emp_nm SEPARATOR ', ') AS schedEmpNm, "
			+ "GROUP_CONCAT(DISTINCT LOC_INFO.loc_nm SEPARATOR ', ') AS schedLocNm "
			+ "FROM SCHED "
			+ "LEFT JOIN DEPT_INFO ON SCHED.sched_dept_id IS NOT NULL AND FIND_IN_SET(DEPT_INFO.dept_id, SCHED.sched_dept_id) > 0 "
			+ "LEFT JOIN EMP_PRVC ON SCHED.sched_emp_id IS NOT NULL AND FIND_IN_SET(EMP_PRVC.emp_id, SCHED.sched_emp_id) > 0 "
			+ "LEFT JOIN LOC_INFO ON SCHED.sched_loc IS NOT NULL AND FIND_IN_SET(LOC_INFO.loc_id, SCHED.sched_loc) > 0 "
			+ "WHERE SCHED.sched_delete_date IS NOT NULL "
			+ "GROUP BY SCHED.sched_id")
	List<CompSchedDTO> schedList();
	
	@Select("select APRV_DOC.*, DOC_FORM.doc_form_nm, EMP_PRVC.EMP_NM AS DRAFT_EMP_NM, "
			+ "APRV_PRCS.aprv_prcs_emp_id, APRV_PRCS_EMP.EMP_NM AS APRV_PRCS_EMP_NM "
			+ "from APRV_DOC "
			+ "left join DOC_FORM on APRV_DOC.DOC_FORM_ID = DOC_FORM.DOC_FORM_ID "
			+ "LEFT JOIN EMP_PRVC ON APRV_DOC.DRFT_EMP_ID = EMP_PRVC.EMP_ID "
			+ "LEFT JOIN APRV_PRCS ON APRV_DOC.APRV_DOC_ID = APRV_PRCS.APRV_DOC_ID "
			+ "LEFT JOIN EMP_PRVC AS APRV_PRCS_EMP ON APRV_PRCS.aprv_prcs_emp_id = APRV_PRCS_EMP.EMP_ID ")
	List<AprvPrcsDTO> aprvPrcsList();
}
