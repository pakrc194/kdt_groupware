package vfive.gw.attendance.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.attendance.dto.AtdcCalDTO;
import vfive.gw.attendance.dto.MyAtdcStatDTO;
import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface MyAtdcStatMapper {
	
	// 1. 연차 요약 정보 조회
  @Select("SELECT OCCRR_LV as total, USED_LV as used, (OCCRR_LV - USED_LV) as remain " +
          "FROM ANNL_LV_STTS " +
          "WHERE EMP_ID = #{empId} AND BASE_YY = #{year}")
  MyAtdcStatDTO.LeaveInfo selectLeaveInfo(@Param("empId") int empId, @Param("year") String year);

  // 2. 연차 상세 기록 리스트 조회
  @Select("SELECT WRK_YMD as leaveDate, '연차' as status " +
          "FROM ATDC_HIST " +
          "WHERE EMP_ID = #{empId} AND ATDC_STTS_CD = 'LEAVE' AND YEAR(WRK_YMD) = #{year} " +
          "ORDER BY WRK_YMD DESC")
  List<MyAtdcStatDTO.LeaveHistory> selectLeaveHistory(@Param("empId") int empId, @Param("year") String year);

  // 3. 통계 가공용 원시 근무 데이터 조회 (출근/출장 포함)
  @Select("SELECT CLK_IN_DTM, CLK_OUT_DTM, ATDC_STTS_CD " +
          "FROM ATDC_HIST " +
          "WHERE EMP_ID = #{empId} " +
          "AND ATDC_STTS_CD IN ('PRESENT', 'BUSINESS_TRIP', 'ON_CALL') " +
          "AND YEAR(WRK_YMD) = #{year} " +
          "AND CLK_IN_DTM IS NOT NULL")
  List<Map<String, Object>> selectRawWorkLogs(@Param("empId") int empId, @Param("year") String year);
	
	
}
