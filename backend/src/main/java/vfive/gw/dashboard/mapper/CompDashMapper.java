package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessDeleteDTO;
import vfive.gw.dashboard.dto.request.AprvPrcsDTO;
import vfive.gw.dashboard.dto.request.CompHRDTO;
import vfive.gw.dashboard.dto.request.CompSchedDTO;
import vfive.gw.dashboard.dto.request.DashDTO;
import vfive.gw.dashboard.dto.request.DashSchedDashDTO;
import vfive.gw.dashboard.dto.request.DocPrcsTimeDTO;
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
	
	// 대시보드 팀 인원
	@Select("select EMP_PRVC.dept_id, EMP_PRVC.JBTTL_ID, EMP_PRVC.EMP_NM, EMP_PRVC.EMP_SN, "
			+ "JBTTL_INFO.JBTTL_NM, "
			+ "ATDC_HIST.EMP_ID, ATDC_HIST.WRK_YMD, ATDC_HIST.ATDC_STTS_CD "
			+ "from EMP_PRVC "
			+ "join JBTTL_INFO on EMP_PRVC.jbttl_id = JBTTL_INFO.jbttl_id "
			+ "left join ATDC_HIST on EMP_PRVC.emp_id = ATDC_HIST.emp_id and ATDC_HIST.WRK_YMD = #{date} "
			+ "where EMP_PRVC.dept_id = #{dept} and EMP_PRVC.EMP_ACNT_STTS = 'ACTIVE' ")
	List<DashDTO> dashTeamEmpList(@Param("dept") int dept, @Param("date") String date);
	
	// 대시보드 팀 스케쥴
	@Select("SELECT SCHED.*, IFNULL(LOC_INFO.LOC_NM, '장소 미정') AS LOC_NM "
			+ "FROM SCHED "
			+ "LEFT JOIN LOC_INFO ON SCHED.SCHED_LOC = LOC_INFO.LOC_ID "
			+ "WHERE FIND_IN_SET(#{dept}, SCHED_DEPT_ID) > 0")
	List<DashSchedDashDTO> dashTeamSchedList(String dept);
	
	// 결재 속도
	@Select("""
			SELECT
    DEPT_INFO.DEPT_NAME,
    APRV_DOC.APRV_DOC_ID,
    APRV_DOC.APRV_DOC_NO,
    APRV_DOC.APRV_DOC_TTL,
    APRV_DOC.APRV_DOC_STTS,
    APRV_DOC.APRV_DOC_ATRZ_DT,
    APRV_DOC.APRV_DOC_DRFT_DT,
    APRV_DOC.APRV_DOC_VER,
    DOC_FORM.DOC_FORM_NM,
    APRV_PRCS.APRV_PRCS_ID,
    APRV_PRCS.ROLE_CD,
    APRV_PRCS.ROLE_SEQ,
    APRV_PRCS.APRV_PRCS_DT,
    APRV_PRCS.APRV_PRCS_STTS,
    APRV_PRCS.RJCT_RSN,
    DRFT_EMP.EMP_NM AS DRFT_EMP_NM,
    APRV_PRCS_EMP.EMP_NM AS APRV_PRCS_EMP_NM
FROM
    APRV_DOC
JOIN DEPT_INFO ON APRV_DOC.DRFT_EMP_ID = DEPT_INFO.DEPT_ID
JOIN DOC_FORM ON DOC_FORM.DOC_FORM_ID = APRV_DOC.DOC_FORM_ID
JOIN APRV_PRCS ON APRV_DOC.APRV_DOC_ID = APRV_PRCS.APRV_DOC_ID
LEFT JOIN EMP_PRVC AS DRFT_EMP ON APRV_DOC.DRFT_EMP_ID = DRFT_EMP.EMP_ID
LEFT JOIN EMP_PRVC AS APRV_PRCS_EMP ON APRV_PRCS.APRV_PRCS_EMP_ID = APRV_PRCS_EMP.EMP_ID
WHERE
    APRV_DOC.DRFT_EMP_ID IN (
        SELECT EMP_ID
        FROM EMP_PRVC
        WHERE EMP_PRVC.DEPT_ID = #{dept}
        AND EXISTS (
            SELECT 1
            FROM APRV_PRCS
            WHERE APRV_PRCS.APRV_PRCS_EMP_ID = EMP_PRVC.EMP_ID
            AND APRV_PRCS.ROLE_CD = 'DRFT'
        )
    )
    AND APRV_DOC.APRV_DOC_ID IN (
        -- 같은 APRV_DOC_ID를 가진 다른 문서들
        SELECT APRV_DOC_ID
        FROM APRV_DOC
        WHERE APRV_DOC_ID = APRV_DOC.APRV_DOC_ID
    )
	
			""")
	List<DocPrcsTimeDTO> docPrcsTime(String dept);
	
	
	// aprvDocStts
}
