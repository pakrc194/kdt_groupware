package vfive.gw.attendance.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedDetailDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;

@Mapper
public interface DutyMapper {

	// 해당 부서의 근무표 리스트
	@Select("SELECT " +
      "    M.DUTY_ID, " +
      "    M.SCHE_TTL, " +
      "    E.EMP_NM, " + // 작성자 성함을 가져오기 위한 JOIN용 필드
      "    M.TRGT_YMD, " +
      "    M.PRGR_STTS, " +
      "    M.REG_DTM, " + // 최초 등록 일시
      "    M.MOD_DTM " +  // 최종 수정 일시
      "FROM DUTY_SCHE_MST M " +
      "INNER JOIN EMP_PRVC E ON M.EMP_ID = E.EMP_ID " +
      "WHERE E.DEPT_ID = #{deptId} " +
      "ORDER BY M.REG_DTM DESC")
	List<DutySkedListDTO> selectDutyScheListByDept(EmpAtdcRequestDTO req);
	
	// 근무표 리스트 삭제
  @Delete("<script>" +
          "DELETE FROM DUTY_SCHE_MST " +
          "WHERE DUTY_ID IN " +
          "<foreach collection='dutyIds' item='id' open='(' separator=',' close=')'>" +
          "#{id}" +
          "</foreach>" +
          "</script>")
  void deleteDutyMasters(@Param("dutyIds") List<Integer> dutyIds);
	
//근무표 상세 내역 조회 (사원명 포함)
  @Select("SELECT " +
          "    D.DUTY_ID, " +
          "    D.EMP_ID, " +
          "    E.EMP_NM, " +
          "    D.GRP_NM, " +
          "    E.ROT_PTN_CD, " +
          "    D.DUTY_YMD, " +
          "    D.WRK_CD " +
          "FROM DUTY_SCHE_DTL D " +
          "INNER JOIN EMP_PRVC E ON D.EMP_ID = E.EMP_ID " +
          "WHERE D.DUTY_ID = #{dutyId} " +
          "ORDER BY E.EMP_ID ASC, D.DUTY_YMD ASC")
  List<DutySkedDetailDTO> selectDutySkedDetailList(DutyRequestDTO req);
  
  // 마스터 정보 조회 (제목, 대상월 등)
  @Select("SELECT DUTY_ID, SCHE_TTL, TRGT_YMD, PRGR_STTS " +
          "FROM DUTY_SCHE_MST WHERE DUTY_ID = #{dutyId}")
  DutySkedListDTO selectDutySkedMaster(DutyRequestDTO req);
  
  // 조회용 - 결재된 근무표 조회
  @Select("SELECT DUTY_ID, SCHE_TTL, TRGT_YMD, PRGR_STTS " +
          "FROM DUTY_SCHE_MST " +
          "WHERE DEPT_ID = #{deptId} " + 
          "  AND TRGT_YMD = #{trgtYmd} " +
          "  AND PRGR_STTS = 'CONFIRMED' " + 
          "LIMIT 1")
  DutySkedListDTO selectConfirmedMasterByDept(DutyRequestDTO req);
  
  // 해당 부서 팀원 리스트
  @Select("SELECT EMP_ID, EMP_NM, GRP_NM, ROT_PTN_CD " +
      "FROM EMP_PRVC " +
      "WHERE DEPT_ID = #{deptId} " +
      "  AND EMP_ACNT_STTS = 'ACTIVE' " + // 재직 중인 사원만
      "ORDER BY GRP_NM ASC, EMP_NM ASC")
  List<EmpDTO> selectDeptEmpList(EmpAtdcRequestDTO req);
  
  // 마스터 정보 저장 (DUTY_SCHE_MST)
  @Insert("INSERT INTO DUTY_SCHE_MST (EMP_ID, DEPT_ID, SCHE_TTL, TRGT_YMD, LST_PTN_IDX) " +
          "VALUES (#{empId}, #{deptId}, #{scheTtl}, #{trgtYmd}, #{lstPtnIdx})")
  @Options(useGeneratedKeys = true, keyProperty = "dutyId")
  int insertDutyMaster(DutyRequestDTO req);
  
  // 상세 내역 저장 (DUTY_SCHE_DTL)
  @Insert("<script>" +
          "INSERT INTO DUTY_SCHE_DTL (DUTY_ID, EMP_ID, DUTY_YMD, WRK_CD, GRP_NM) VALUES " +
          "<foreach collection='list' item='item' separator=','>" +
          "(#{item.dutyId}, #{item.empId}, #{item.dutyYmd}, #{item.wrkCd}, #{item.grpNm})" +
          "</foreach>" +
          "</script>")
  int insertDutyDetails(List<DutySkedDetailDTO> list);
  
  /**
   * 여러 사원의 조 정보와 근무 유형(패턴)을 일괄 업데이트
   */
  @Update("<script>" +
          "UPDATE EMP_PRVC " + 
          "<set>" +
          "  GRP_NM = CASE " +
          "    <foreach collection='updates' item='item'>" +
          "      WHEN EMP_ID = #{item.empId} THEN #{item.grpNm, jdbcType=VARCHAR} " +
          "    </foreach>" +
          "  END, " +
          "  ROT_PTN_CD = CASE " +
          "    <foreach collection='updates' item='item'>" +
          "      WHEN EMP_ID = #{item.empId} THEN #{item.rotPtnCd, jdbcType=VARCHAR} " +
          "    </foreach>" +
          "  END " +
          "</set>" +
          "WHERE EMP_ID IN " +
          "<foreach collection='updates' item='item' open='(' separator=',' close=')'>" +
          "  #{item.empId}" +
          "</foreach>" +
          "</script>")
  int updateEmpGroups(@Param("updates") List<Map<String, Object>> updates);
	
  //근무표 마스터 정보 수정 (제목 등)
  @Update("UPDATE DUTY_SCHE_MST SET " +
          "SCHE_TTL = #{scheTtl}, " +
          "EMP_ID = #{empId}, " +
          "MOD_DTM = NOW() " +
          "WHERE DUTY_ID = #{dutyId}")
  int updateDutyMaster(DutyRequestDTO req);
  
  //근무표 기존 상세 내역 삭제
  @Delete("DELETE FROM DUTY_SCHE_DTL WHERE DUTY_ID = #{dutyId}")
  void deleteDutyDetails(DutyRequestDTO req);
  
  // 중복 확정 근무표 체크
  @Select("SELECT COUNT(*) FROM DUTY_SCHE_MST " +
          "WHERE DEPT_ID = #{deptId} " +
          "AND TRGT_YMD = #{trgtYmd} " +
          "AND PRGR_STTS = 'CONFIRMED'")
  int countConfirmedDuty(DutySkedListDTO dto);

  // 상태 업데이트
  @Update("UPDATE DUTY_SCHE_MST SET PRGR_STTS = 'CONFIRMED' WHERE DUTY_ID = #{dutyId}")
  int updateDutyToConfirmed(DutyRequestDTO req);

  // 현재 근무표 정보 조회 (부서ID와 날짜를 알아내기 위함)
  @Select("SELECT * FROM DUTY_SCHE_MST WHERE DUTY_ID = #{dutyId}")
  DutySkedListDTO selectDutyById(DutyRequestDTO req);
  
  // 근무표 결재진행상태로 업데이트
  @Update("UPDATE DUTY_SCHE_MST SET PRGR_STTS = 'PENDING' " +
          "WHERE DUTY_ID = #{dutyId} AND PRGR_STTS = 'DRAFT'")
  int updateDutyToPending(DutyRequestDTO req);
  
  @Select("SELECT d.EMP_ID as empId, d.WRK_CD as wrkCd, m.LST_PTN_IDX as lstPtnIdx " +
      "FROM DUTY_SCHE_DTL d " +
      "JOIN DUTY_SCHE_MST m ON d.DUTY_ID = m.DUTY_ID " +
      "WHERE m.DEPT_ID = #{deptId} " +
      "  AND m.PRGR_STTS = 'CONFIRMED' " +
      "  AND d.DUTY_YMD = (" +
      "      SELECT MAX(sd.DUTY_YMD) " +
      "      FROM DUTY_SCHE_DTL sd " +
      "      JOIN DUTY_SCHE_MST sm ON sd.DUTY_ID = sm.DUTY_ID " +
      "      WHERE sm.DEPT_ID = #{deptId} " +
      "        AND sm.PRGR_STTS = 'CONFIRMED' " +
      "        AND sd.DUTY_YMD LIKE CONCAT(#{trgtYmd}, '%')" +
      "  )")
	List<Map<String, Object>> getLastMonthLastDayDuty(DutyRequestDTO req);
  
}
