package vfive.gw.login.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;

@Mapper
public interface LoginMapper {
	
	@Select("select E.*, D.DEPT_NAME, D.DEPT_CODE, J.JBTTL_NM "
			+ "from EMP_PRVC E "
			+ "left join DEPT_INFO D on E.DEPT_ID = D.DEPT_ID "
			+ "left join JBTTL_INFO J on E.JBTTL_ID = J.JBTTL_ID "
			+ "where E.EMP_SN = #{empSn} and E.EMP_PSWD = #{empPswd}")
	LoginResponse login(LoginRequest req);
	
	// 신규사원 계정 등록
	@Update({
    "UPDATE EMP_PRVC",
    "SET",
    "  EMP_ADDR = #{empAddr},",
    "  EMP_TELNO = #{empTelno},",
    "  EMP_ACTNO = #{empActno},",
    "  EMP_PSWD = #{empPswd},",
    "  EMP_EML_ADDR = #{empEmlAddr},",
    "  EMP_PHOTO = #{empPhoto},",
    "  EMP_ACNT_STTS = 'ACTIVE'",
    "WHERE EMP_SN = #{empSn}"
	})
	int updateNewEmp(LoginRequest req);
	
	// 사번, 이메일 일치 여부
  @Select("SELECT COUNT(*) FROM EMP_PRVC WHERE EMP_SN = #{empSn} AND EMP_EML_ADDR = #{empEmlAddr}")
  int checkEmpEmailMatch(LoginRequest req);

  // 비밀번호 리셋(재설정)
  @Update("UPDATE EMP_PRVC SET EMP_PSWD = #{empPswd} WHERE EMP_SN = #{empSn}")
  int updatePassword(LoginRequest req);
  
  // 출근
  @Update({
    "UPDATE ATDC_HIST A ",
    "JOIN WORK_TYPE_CD W ON A.WRK_CD = W.WRK_CD ",
    "SET ",
    "    A.CLK_IN_DTM = NOW(), ",
    "    A.ATDC_STTS_CD = CASE ", // 미리 설정된 특수 상태 유지
    "        WHEN A.ATDC_STTS_CD IN ('OFF', 'LEAVE', 'BUSINESS_TRIP') THEN A.ATDC_STTS_CD ",
    "        ",		// 정각 미만(예: 08:59:59까지)일 때만 정상 출근 인정
    "        WHEN TIME(NOW()) < W.STRT_TM THEN 'PRESENT' ",
    "        ",		// 정각 포함 그 이후는 모두 결근
    "        ELSE A.ATDC_STTS_CD ",
    "    END ",
    "WHERE A.EMP_ID = #{empId} ",
    "  AND A.WRK_YMD = CURDATE() ",
    "  AND A.CLK_IN_DTM IS NULL"
	})
	int updateClkIn(LoginResponse req);
  
}
