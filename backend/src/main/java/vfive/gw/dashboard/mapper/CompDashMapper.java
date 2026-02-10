package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.CompHRDTO;
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
}
