package vfive.gw.attendance.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.attendance.dto.domain.AtdcDTO;
import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.domain.LeaveDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.EmpAtdcDetailDTO;
import vfive.gw.attendance.dto.response.EmpAtdcListDTO;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.login.dto.LoginRequest;

@Mapper
public interface AtdcMapper {
	
	// 근태 캘린더(월 단위 근태 리스트)
	@Select("SELECT * FROM ATDC_HIST " +
      "WHERE EMP_ID = #{empId} " +
      "AND WRK_YMD LIKE CONCAT(#{yearMonth}, '%')")
	List<AtdcDTO> selectAtdcHistory(@Param("empId") int empId,@Param("yearMonth") String yearMonth);
	
	// 연차 요약 정보 조회
  @Select("SELECT OCCRR_LV as totalDays, USED_LV as usedDays, REM_LV as leftDays " +
          "FROM ANNL_LV_STTS " +
          "WHERE EMP_ID = #{empId} AND BASE_YY = #{year}")
  LeaveDTO.Info selectLeaveInfo(@Param("empId") int empId, @Param("year") String year);

  // 연차 상세 기록 리스트 조회
  @Select("SELECT WRK_YMD as leaveDate, '연차' as leaveType " +
          "FROM ATDC_HIST " +
          "WHERE EMP_ID = #{empId} AND ATDC_STTS_CD = 'LEAVE' AND YEAR(WRK_YMD) = #{year} " +
          "ORDER BY WRK_YMD DESC")
  List<LeaveDTO.History> selectLeaveHistory(@Param("empId") int empId, @Param("year") String year);

  // 통계 가공용 원시 근무 데이터 조회 (출근/출장 포함)
  @Select("SELECT CLK_IN_DTM, CLK_OUT_DTM, ATDC_STTS_CD " +
          "FROM ATDC_HIST " +
          "WHERE EMP_ID = #{empId} " +
          "AND ATDC_STTS_CD IN ('PRESENT', 'BUSINESS_TRIP', 'ON_CALL') " +
          "AND YEAR(WRK_YMD) = #{year} " +
          "AND CLK_IN_DTM IS NOT NULL")
  List<Map<String, Object>> selectRawWorkLogs(@Param("empId") int empId, @Param("year") String year);	

  // 사원 근태 리스트
	@Select("SELECT * FROM EMP_PRVC " +
     "WHERE EMP_ID = #{empId} ")
	List<EmpDTO> selectEmpDetail(@Param("empId") int empId);
	
	// 사원 리스트
	@Select("<script>" +
      "SELECT " +
      "    E.EMP_ID as empId, " +
      "    E.EMP_SN as empSn, " +
      "    E.EMP_NM as empNm, " +
      "    E.DEPT_ID as deptId, " +
      "    E.JBTTL_ID as jbttlId, " +
      "    COUNT(A.ATDC_ID) as totWrkDays, " +
      "    CASE WHEN COUNT(A.ATDC_ID) = 0 THEN 0 " +
      "         ELSE ROUND(COUNT(CASE WHEN A.ATDC_STTS_CD = 'PRESENT' THEN 1 END) * 1.0 / COUNT(A.ATDC_ID) * 100, 1)" +
      "    END as atdcRate, " +
      "    COUNT(CASE WHEN A.ATDC_STTS_CD = 'ABSENT' THEN 1 END) as absCnt " +
      "FROM EMP_PRVC E " +
      "LEFT JOIN ATDC_HIST A ON E.EMP_ID = A.EMP_ID " +
      "    AND A.WRK_YMD BETWEEN #{startDate} AND #{endDate} " +
      "<where> " +
      "    <if test='deptId != null and deptId != 0'> " +
      "        AND E.DEPT_ID = #{deptId} " +
      "    </if> " +
      "    <if test='empNm != null and empNm != \"\"'> " +
      "        AND E.EMP_NM LIKE CONCAT('%', #{empNm}, '%') " +
      "    </if> " +
      "</where> " +
      "GROUP BY E.EMP_ID, E.EMP_SN, E.EMP_NM, E.DEPT_ID, E.JBTTL_ID" +
      "</script>")
	List<EmpAtdcListDTO> selectEmpAtdcStats(EmpAtdcRequestDTO req);
	
	@Select("<script>" +
      "SELECT " +
      "    E.EMP_SN as empSn, " +
      "    E.EMP_NM as empNm, " +
      "    A.WRK_YMD as wrkYmd, " +
      "    W.WRK_NM as wrkNm, " +
      "    A.CLK_IN_DTM as clkInDtm, " +
      "    A.CLK_OUT_DTM as clkOutDtm, " +
      "    A.ATDC_STTS_CD as atdcSttsCd " +
      "FROM ATDC_HIST A " +
      "LEFT JOIN EMP_PRVC E ON A.EMP_ID = E.EMP_ID " +
      "LEFT JOIN WORK_TYPE_CD W ON A.WRK_CD = W.WRK_CD " + 
      "WHERE A.EMP_ID = #{empId} " +
      /* 문자열 파라미터를 DATE 타입으로 변환하여 비교 */
      "  AND A.WRK_YMD BETWEEN STR_TO_DATE(#{startDate}, '%Y-%m-%d') " +
      "                   AND STR_TO_DATE(#{endDate}, '%Y-%m-%d') " +
      "ORDER BY A.WRK_YMD DESC" +
      "</script>")
		List<EmpAtdcDetailDTO> selectEmpAtdcDetail(EmpAtdcRequestDTO req);
	
  // 퇴근
  @Update({
    "UPDATE ATDC_HIST",
    "SET ",
    "  CLK_OUT_DTM = NOW()",        // 현재 서버 시간으로 퇴근 기록
    "WHERE EMP_ID = #{empId}",
    "  AND WRK_YMD = CURDATE()",    // 오늘 날짜 데이터 대상
    "  AND CLK_OUT_DTM IS NULL"     // 이미 퇴근 처리된 경우 중복 업데이트 방지
	})
	int updateClkOut(EmpAtdcRequestDTO req);
  
  // 부서 근태 현황
  @Select({
    "SELECT E.EMP_ID, E.EMP_SN, E.EMP_NM, A.CLK_IN_DTM, A.CLK_OUT_DTM, A.ATDC_STTS_CD ",
    "FROM EMP_PRVC E ",
    "LEFT OUTER JOIN ATDC_HIST A ON E.EMP_ID = A.EMP_ID AND A.WRK_YMD = CURDATE() ",
    "WHERE E.EMP_ACNT_STTS = 'ACTIVE' ",
    "  AND E.DEPT_ID = #{deptId} ",
    "ORDER BY E.EMP_NM ASC"
	})
	List<Map<String, Object>> selectMyDeptEmpStatus(EmpAtdcRequestDTO req);
  
  @Insert({
  	"INSERT INTO ATDC_HIST "
  	+ "(EMP_ID, WRK_YMD, ATDC_STTS_CD) "
  	+ "SELECT E.EMP_ID, CURDATE(), 'ABSENT' "
  	+ "FROM EMP_PRVC E "
  	+ "WHERE E.EMP_ACNT_STTS = 'ACTIVE' "
  	+ "AND NOT EXISTS "
  	+ "(SELECT 1 FROM ATDC_HIST A "
  	+ "WHERE A.EMP_ID = E.EMP_ID "
  	+ "AND A.WRK_YMD = CURDATE())"
  })
  int insertAtdcHistData();
  
  @Insert({
    "INSERT INTO ANNL_LV_STTS (EMP_ID, BASE_YY, OCCRR_LV, USED_LV) ",
    "SELECT ",
    "    E.EMP_ID, ",
    "    YEAR(CURDATE()) AS BASE_YY, ",
    "    CASE ", 	// 1년 미만 사원 (입사일 ~ 올해 1월 1일 기준 월차 계산)
    "        WHEN TIMESTAMPDIFF(YEAR, E.EMP_JNCMP_YMD, STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-01-01'), '%Y-%m-%d')) < 1 ",
    							// 입사일부터 올해 1월 1일까지의 '개월 수'를 계산하여 최대 11개까지 부여
    "        THEN FLOOR(LEAST(TIMESTAMPDIFF(MONTH, E.EMP_JNCMP_YMD, STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-01-01'), '%Y-%m-%d')), 11)) ",
    							// 1년 이상 사원 (15일 + 가산 연차 -> 2년당 1일, 최대 25일)
    "        ELSE FLOOR(LEAST(15 + FLOOR((TIMESTAMPDIFF(YEAR, E.EMP_JNCMP_YMD, STR_TO_DATE(CONCAT(YEAR(CURDATE()), '-01-01'), '%Y-%m-%d')) - 1) / 2), 25)) ",
    "    END AS OCCRR_LV, ",
    "    0 AS USED_LV ",
    "FROM EMP_PRVC E ",
    "WHERE E.EMP_ACNT_STTS = 'ACTIVE' ",
    "AND NOT EXISTS ( ",
    "    SELECT 1 FROM ANNL_LV_STTS A ",
    "    WHERE A.EMP_ID = E.EMP_ID ",
    "    AND A.BASE_YY = YEAR(CURDATE()) ",
    ")"
	})
	int insertYearlyLeaveData();
  
  @Update({
    "UPDATE ANNL_LV_STTS A ",
    "JOIN EMP_PRVC E ON A.EMP_ID = E.EMP_ID ",
    "SET A.OCCRR_LV = FLOOR( ",	// 전년도 근속에 따른 회계연도 비례분 재계산 (작년 입사자만 해당, 올해 입사자는 0)
    "    (CASE WHEN YEAR(E.EMP_JNCMP_YMD) < YEAR(CURDATE()) ",
    "          THEN (15 * (DATEDIFF(STR_TO_DATE(CONCAT(YEAR(CURDATE())-1, '-12-31'), '%Y-%m-%d'), E.EMP_JNCMP_YMD) + 1) / 365) ",
    "          ELSE 0 END) ",
    "    + ",	// 입사 후 현재까지 쌓인 월차 (최대 11개)
    "    LEAST(TIMESTAMPDIFF(MONTH, E.EMP_JNCMP_YMD, CURDATE()), 11) ",
    ") ",
    "WHERE A.BASE_YY = YEAR(CURDATE()) ",
    "AND E.EMP_ACNT_STTS = 'ACTIVE' ",
    "AND TIMESTAMPDIFF(MONTH, E.EMP_JNCMP_YMD, CURDATE()) < 12"
	})
	int updateNewEmpLeave();
}
