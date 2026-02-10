package vfive.gw.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.response.AprvDocListResponse;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.domain.LeaveDTO;
import vfive.gw.board.dto.BoardPrvc;
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
  
  // 중요 상단공지 최신 5개
  @Select("SELECT B.*, E.EMP_NM "
  		+ "FROM Board B "
  		+ "JOIN EMP_PRVC E ON B.Creator = E.EMP_SN "
  		+ "WHERE B.IsTop = 'true' "
  		+ "ORDER BY B.BoardId DESC "
  		+ "LIMIT 5")
  List<BoardPrvc> selectHeadNoticeLimitFive();
  
  // 기안함 최신 5개
	@Select("select * from APRV_DOC "
			+ "where drft_emp_id = #{empId} "
			+ "ORDER BY APRV_DOC_ID DESC "
			+ "LIMIT 5")
	List<AprvDocListResponse> selectDrftLimitFive(MyDashResDTO req); 
	
	// 결재함 최신 5개
	@Select("select * from APRV_DOC D join APRV_PRCS P "
			+ "on D.APRV_DOC_ID = P.APRV_DOC_ID "
			+ "and aprv_prcs_emp_id = #{empId} "
			+ "and role_cd like '%ATRZ%' "
			+ "and aprv_prcs_stts != 'WAIT' "
			+ "order by D.APRV_DOC_ID desc "
			+ "limit 5")
	List<AprvDocListResponse> selectAprvLimitFive(MyDashResDTO req); 
}
