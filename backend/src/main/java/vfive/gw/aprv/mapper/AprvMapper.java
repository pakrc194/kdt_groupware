package vfive.gw.aprv.mapper;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.request.AprvEmpAnnlLvRequest;
import vfive.gw.aprv.dto.request.AprvLocListRequest;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvRoleVlRequest;
import vfive.gw.aprv.dto.request.AprvSchedRequest;
import vfive.gw.aprv.dto.response.AprvDocDetailResponse;
import vfive.gw.aprv.dto.response.AprvDocDtlVlResponse;
import vfive.gw.aprv.dto.response.AprvDocFormLineResponse;
import vfive.gw.aprv.dto.response.AprvDocInptResponse;
import vfive.gw.aprv.dto.response.AprvDocVerListResponse;
import vfive.gw.aprv.dto.response.AprvDutyScheDtlResponse;
import vfive.gw.aprv.dto.response.AprvEmpAnnlLvResponse;
import vfive.gw.aprv.dto.response.AprvLocListResponse;
import vfive.gw.aprv.dto.response.AprvRoleVlResponse;
import vfive.gw.aprv.dto.response.AprvSchedResponse;

@Mapper
public interface AprvMapper {
	@Select("select APRV_DOC.*, EMP_PRVC.EMP_NM as DRFT_EMP_NM, EMP_PRVC.DEPT_ID, DOC_FORM.DOC_FORM_TYPE "
			+ "from APRV_DOC "
			+ "join DOC_FORM on APRV_DOC.DOC_FORM_ID = DOC_FORM.DOC_FORM_ID "
			+ "join EMP_PRVC on APRV_DOC.DRFT_EMP_ID = EMP_PRVC.EMP_ID "
			+ "where aprv_doc_id = #{docId}")
	AprvDocDetailResponse detail(int docId);
	
	@Select("select * from DOC_INPT where doc_form_id = #{formId}")
	List<AprvDocInptResponse> docInpt(int formId);
	
	
	@Select("select * from APRV_INPT_VL V join DOC_INPT I on V.doc_inpt_id = I.doc_inpt_id where aprv_doc_id = #{docId} order by I.doc_inpt_id asc")
	List<AprvDocDtlVlResponse> docDtlVl(int docId);
	
	@Select("select ANNL_LV_STTS.*, EMP_PRVC.EMP_NM from ANNL_LV_STTS join EMP_PRVC on EMP_PRVC.EMP_ID = #{empId} where ANNL_LV_STTS.emp_id=#{empId} and base_yy=#{year}")
	AprvEmpAnnlLvResponse empAnnlLv(@Param("empId")int empId, @Param("year")int year);
	
	
	@Select("""
			<script>
			select L.*, MA.EMP_NM as MID_ATRZ_EMP_NM, LA.EMP_NM as LAST_ATRZ_EMP_NM from DOC_FORM_LINE L 
			left join EMP_PRVC MA on L.MID_ATRZ_EMP_ID = MA.EMP_ID 
			left join EMP_PRVC LA on L.LAST_ATRZ_EMP_ID = LA.EMP_ID 
			where DOC_FORM_ID = #{docId};
			</script>
			""")
	AprvDocFormLineResponse docFormLine(int docId);
	
	@Select("select DUTY_SCHE_DTL.*, D.DEPT_NAME, D.DEPT_CODE, E.EMP_NM from DUTY_SCHE_DTL "
			+ "JOIN EMP_PRVC E on E.EMP_ID = #{empId} "
			+ "JOIN DEPT_INFO D on D.DEPT_ID = E.DEPT_ID "
			+ "where DUTY_SCHE_DTL.EMP_ID = #{empId} and DUTY_YMD between #{docStart} and #{docEnd}")
	List<AprvDutyScheDtlResponse> dutyScheDtl(@Param("empId") int empId, @Param("docStart")String docStart, @Param("docEnd")String docEnd);
	
	@Select("SELECT SCHED.*, D.DEPT_NAME, D.DEPT_CODE, E.EMP_NM FROM SCHED "
			+ "JOIN EMP_PRVC E on E.EMP_ID = #{empId} "
			+ "JOIN DEPT_INFO D on D.DEPT_ID = E.DEPT_ID "
			+ "WHERE SCHED_START_DATE <= #{docEnd} AND SCHED_END_DATE >= #{docStart} "
			+ "AND find_in_set(#{empId}, sched_emp_id)>0")//
	List<AprvSchedResponse> personalSchedList(@Param("empId") int empId, @Param("docStart")String docStart, @Param("docEnd")String docEnd);
	
	@Select("SELECT SCHED.*, DEPT_INFO.DEPT_NAME, DEPT_INFO.DEPT_CODE FROM SCHED "
			+ "join DEPT_INFO on DEPT_ID = #{deptId} "
			+ "WHERE SCHED_START_DATE <= #{docEnd} AND SCHED_END_DATE >= #{docStart} "
			+ "AND find_in_set(#{deptId}, sched_dept_id)>0")//
	List<AprvSchedResponse> deptSchedList(@Param("deptId") int dept, @Param("docStart")String docStart, @Param("docEnd")String docEnd);
	
	@Select("""
			SELECT *
			FROM LOC_INFO L
			WHERE NOT EXISTS (
			    SELECT 1
			    FROM SCHED S
			    WHERE S.SCHED_LOC = L.LOC_ID
			      AND S.SCHED_START_DATE <= #{docEnd}
			      AND S.SCHED_END_DATE   >= #{docStart}
			)
			""")
	List<AprvLocListResponse> locList(AprvLocListRequest req);
	
	
	@Update("UPDATE ANNL_LV_STTS "
			+ "SET "
			+ "USED_LV = USED_LV + #{cnt} "
			+ "WHERE EMP_ID = #{empId} "
			+ "  AND BASE_YY = #{baseYy} "
			+ "  AND (OCCRR_LV - USED_LV) >= #{cnt}")
	int updateAnnlLvStts(@Param("empId") int empId, @Param("baseYy") int baseYy, @Param("cnt") BigDecimal cnt);
	
	@Insert("""
			<script>
			Insert into ATDC_HIST 
			(EMP_ID, WRK_YMD, ATDC_STTS_CD) 
			VALUES 
			<foreach collection='list' item='dd' separator=',' index='i'>
				(#{empId}, #{dd}, 'LEAVE') 
			</foreach>
			</script>
			""")
	int insertAtdcHist(@Param("empId")int empId, @Param("list")List<LocalDate> list);
	
	
	@Delete("delete from APRV_PRCS where APRV_DOC_ID = #{docId}")
	int deleteAprvPrcs(@Param("docId")int docId);
	
	@Delete("delete from APRV_DOC where APRV_DOC_ID = #{docId}")
	int deleteAprvDoc(@Param("docId")int docId);
	
	@Select("""
			<script>
				SELECT
				  <choose>
				    <when test="role == 'PERSONAL'">
				      e.EMP_ID,
				      e.EMP_NM
				    </when>
				    <when test="role == 'DEPT'">
				      d.DEPT_ID,
				      d.DEPT_NAME
				    </when>
				  </choose>
				FROM 
				  <choose>
				    <when test="role == 'PERSONAL'">
				      EMP_PRVC e 
				    </when>
				    <when test="role == 'DEPT'">
				      DEPT_INFO d 
				    </when>
				  </choose>
				WHERE 
				  <choose>
				    <when test="role == 'PERSONAL'">
				      FIND_IN_SET(e.EMP_ID, #{ids})
				    </when>
				    <when test="role == 'DEPT'">
				      FIND_IN_SET(d.DEPT_ID, #{ids})
				    </when>
				    <otherwise>
				      1 = 0
				    </otherwise>
				  </choose>
			</script>
			""")
	List<AprvRoleVlResponse> aprvRoleVl(AprvRoleVlRequest req);
}
