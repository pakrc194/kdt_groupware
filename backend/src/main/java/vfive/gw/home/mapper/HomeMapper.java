package vfive.gw.home.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.domain.LeaveDTO;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.dto.request.MyDashResDTO;

@Mapper
public interface HomeMapper {
	

//	@Select("select * from SCHED")
//	List<Sched> shedList();
	
	@Select("SELECT " +
      "    E.EMP_SN, " +
      "    E.EMP_NM, " +
      "    D.DEPT_NAME, " +
      "    J.JBTTL_NM, " +
      "    E.EMP_EML_ADDR, " +
      "    E.EMP_PHOTO " +
      "FROM EMP_PRVC E " +
      "LEFT JOIN DEPT_INFO D ON E.DEPT_ID = D.DEPT_ID " +
      "LEFT JOIN JBTTL_INFO J ON E.JBTTL_ID = J.JBTTL_ID " +
      "WHERE E.EMP_ID = #{empId}")
	EmpPrvc selectUserProfileByEmpId(EmpPrvc empId);
	
	@Select("SELECT " +
			"    EMP_SN, " +
			"    EMP_NM, " +
			"    EMP_BIRTH, " +
			"    EMP_ACTNO, " +
			"    EMP_TELNO, " +
			"    EMP_ADDR, " +
			"    EMP_EML_ADDR, " +
			"    EMP_PHOTO " +
			"FROM EMP_PRVC " +
			"WHERE EMP_ID = #{empId}")
	EmpPrvc selectModFormByEmpId(EmpPrvc empId);
	
	// 연차 요약 정보 조회
  @Select("SELECT OCCRR_LV as totalDays, USED_LV as usedDays, REM_LV as leftDays " +
          "FROM ANNL_LV_STTS " +
          "WHERE EMP_ID = #{empId} AND BASE_YY = #{year}")
  LeaveDTO.Info selectLeaveInfo(MyDashResDTO req);
	
  
}
