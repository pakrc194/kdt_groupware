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
    "UPDATE ATDC_HIST",
    "SET ",
    "  ATDC_STTS_CD = 'PRESENT',",
    "  CLK_IN_DTM = NOW()", // 현재 서버 시간 입력
    "WHERE EMP_ID = #{empId}",
    "  AND WRK_YMD = CURDATE()", // 오늘 날짜 데이터만 대상
    "  AND CLK_IN_DTM IS NULL"   // 이미 출근 찍힌 경우는 중복 방지
	})
	int updateClkIn(LoginResponse req);
  
}
