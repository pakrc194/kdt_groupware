package vfive.gw.attendance.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.attendance.dto.domain.EmpDTO;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedDetailDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;

@Mapper
public interface DutyMapper {

	// 해당 부서의 근무표 리스트
	@Select("SELECT " +
      "    M.SCHE_ID, " +
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
	
//근무표 상세 내역 조회 (사원명 포함)
  @Select("SELECT " +
          "    D.SCHE_ID, " +
          "    D.EMP_ID, " +
          "    E.EMP_NM, " +
          "    E.GRP_NM, " +
          "    E.ROT_PTN_CD, " +
          "    D.DUTY_YMD, " +
          "    D.WRK_CD " +
          "FROM DUTY_SCHE_DTL D " +
          "INNER JOIN EMP_PRVC E ON D.EMP_ID = E.EMP_ID " +
          "WHERE D.SCHE_ID = #{scheId} " +
          "ORDER BY E.EMP_ID ASC, D.DUTY_YMD ASC")
  List<DutySkedDetailDTO> selectDutySkedDetailList(DutyRequestDTO req);
  
  // 마스터 정보 조회 (제목, 대상월 등)
  @Select("SELECT SCHE_ID, SCHE_TTL, TRGT_YMD, PRGR_STTS " +
          "FROM DUTY_SCHE_MST WHERE SCHE_ID = #{scheId}")
  DutySkedListDTO selectDutySkedMaster(DutyRequestDTO req);
  
  // 조회용 - 결재된 근무표 조회
  @Select("SELECT SCHE_ID, SCHE_TTL, TRGT_YMD, PRGR_STTS " +
          "FROM DUTY_SCHE_MST " +
          "WHERE DEPT_ID = #{deptId} " + 
          "  AND TRGT_YMD = #{trgtYmd} " +
          "  AND PRGR_STTS = 'CONFIRMED' " + 
          "LIMIT 1")
  DutySkedListDTO selectConfirmedMasterByDept(DutyRequestDTO req);
  
//  @Select("SELECT EMP_ID, EMP_NM, GRP_NM, ROT_PTN_CD " +
//      "FROM EMP_PRVC " +
//      "WHERE DEPT_ID = #{deptId} " +
//      "  AND EMP_ACNT_STTS = 'ACTIVE' " + // 재직 중인 사원만
//      "ORDER BY GRP_NM ASC, EMP_NM ASC")
//  List<EmpDTO> selectDeptEmpList(Emp);
	
}
