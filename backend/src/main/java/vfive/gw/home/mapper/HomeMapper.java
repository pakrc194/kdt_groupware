package vfive.gw.home.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.aprv.dto.response.AprvDocListResponse;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.domain.LeaveDTO;
import vfive.gw.attendance.dto.response.EmpAtdcDetailDTO;
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
	
	// 금일 출퇴근 시각
	@Select({
    "SELECT ",
    "    A.WRK_YMD AS wrkYmd, ",
    "    A.ATDC_STTS_CD AS atdcSttsCd, ", // 근태 상태 (PRESENT, ABSENT 등)
    "    A.CLK_IN_DTM AS clkInDtm, ",   	// 출근 시각
    "    A.CLK_OUT_DTM AS clkOutDtm, ",  	// 퇴근 시각
    "    W.WRK_NM AS wrkNm, ",       			// 근무 형태명 (예: 주간근무, 야간근무)
    "    W.STRT_TM AS strtTm, ",     			// 예정 시작 시간
    "    W.END_TM AS endTm",        			// 예정 종료 시간
    "FROM ATDC_HIST A ",
    "JOIN WORK_TYPE_CD W ON A.WRK_CD = W.WRK_CD ",
    "WHERE A.EMP_ID = #{empId} ",
    "  AND A.WRK_YMD = CURDATE()"
	})
	EmpAtdcDetailDTO selectTodayAtdcDashboard(MyDashResDTO req);
	
	@Update("<script>" +
      "UPDATE EMP_PRVC " +
      "<set>" +
      "  <if test='empTelno != null'>EMP_TELNO = #{empTelno},</if>" +
      "  <if test='empActno != null'>EMP_ACTNO = #{empActno},</if>" +
      "  <if test='empAddr != null'>EMP_ADDR = #{empAddr},</if>" +
      "  <if test='empEmlAddr != null'>EMP_EML_ADDR = #{empEmlAddr},</if>" +
      "  <if test='newPassword != null and newPassword != \"\"'>EMP_PSWD = #{newPassword},</if>" +
      "  <if test='empPhoto != null'>EMP_PHOTO = #{empPhoto},</if>" +
      "</set>" +
      "WHERE EMP_ID = #{empId}" +
      "</script>")
	int updateEmployeeProfile(EmpPrvc req);
}
