package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import vfive.gw.aprv.dto.request.AprvDrftDocRequest;
import vfive.gw.aprv.dto.request.AprvDrftInptRequest;
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvInptVlRequest;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.dto.request.AprvSchedUploadRequest;

@Mapper
public interface AprvPostMapper {
		
	@Update("""
			<script>
			UPDATE APRV_DOC
			SET APRV_DOC_STTS =
			<choose>
			  <when test="nextEmpNm != null and nextEmpNm != ''">
			    CONCAT('PENDING(', #{nextEmpNm}, ')')
			  </when>
			  <otherwise>
			    #{aprvPrcsStts}
			  </otherwise>
			</choose>
			WHERE APRV_DOC_ID = #{aprvDocId}
			</script>
			""")
	int docSttsUpdate(AprvPrcsRequest req);
	
	@Insert("insert into APRV_PRCS "
			+ "(APRV_LINE_ID, APRV_DOC_ID, APRV_PRCS_EMP_ID, ROLE_CD, ROLE_SEQ, APRV_PRCS_DT, APRV_PRCS_STTS, RJCT_RSN)"
			+ "values "
			+ "(#{aprvLineId}, #{aprvDocId}, #{aprvPrcsEmpId}, #{roleCd}, #{roleSeq}, #{aprvPrcsDt}, #{aprvPrcsStts}, #{rjctRsn})")
	int iAprvPrcs(AprvPrcsRequest req);
	
	@Update("update APRV_PRCS "
			+ "set APRV_PRCS_DT = #{aprvPrcsDt}, APRV_PRCS_STTS=#{aprvPrcsStts}, RJCT_RSN=#{rjctRsn} "
			+ "where APRV_PRCS_EMP_ID = #{aprvPrcsEmpId} and APRV_DOC_ID = #{aprvDocId} ")//and APRV_PRCS_STTS='PENDING'
	int uAprvPrcs(AprvPrcsRequest req);
	
	@Update("update APRV_PRCS "
			+ "set APRV_PRCS_STTS='PENDING' "
			+ "where APRV_DOC_ID = #{aprvDocId} "
			+ "and (ROLE_CD = 'MID_REF' or ROLE_CD = 'LAST_ATRZ')")//and APRV_PRCS_STTS='WAIT'
	int nextAprvPrcs(AprvPrcsRequest req);
	

	@Insert("insert into APRV_DOC "
			+ "(DRFT_EMP_ID, DOC_FORM_ID, APRV_DOC_NO, APRV_DOC_TTL, APRV_DOC_STTS, APRV_DOC_DRFT_DT, APRV_DOC_VER) "
			+ "values "
			+ "(#{drftEmpId}, #{docFormId}, #{aprvDocNo}, #{aprvDocTtl}, 'DRFT', #{aprvDocDrftDt}, '1.0')")
	@Options(useGeneratedKeys = true, keyProperty = "aprvDocId")
	int insertAprvDoc(AprvDrftDocRequest req);
	
	
	@Insert("<script>"
			+ "insert into APRV_PRCS "
			+ "(APRV_PRCS_EMP_ID, APRV_DOC_ID, ROLE_CD, ROLE_SEQ, APRV_PRCS_DT, APRV_PRCS_STTS)"
			+ "values "
			+ "<foreach collection='list' item='v' separator=',' index='i'>"
			+ " (#{v.aprvPrcsEmpId}, #{v.aprvDocId}, #{v.roleCd}, #{v.roleSeq}, #{v.aprvPrcsDt}, #{v.aprvPrcsStts}) "
			+ "</foreach>"
			+ "</script>")
	int drftLineList(@Param("list")List<AprvPrcsRequest> drftLineList);
	
	
	@Insert("<script>"
			+ "insert into APRV_INPT_VL "
			+ "(DOC_INPT_ID, APRV_DOC_ID, DOC_INPT_VL)"
			+ "values "
			+ "<foreach collection='list' item='v' separator=',' index='i'>"
			+ " (#{v.docInptId}, #{v.aprvDocId}, #{v.docInptVl}) "
			+ "</foreach>"
			+ "</script>")
	int drftInpt(@Param("list")List<AprvInptVlRequest> di);
	
	@Insert("insert into SCHED "
			+ "(SCHED_TITLE, SCHED_START_DATE, SCHED_END_DATE, SCHED_TYPE, SCHED_DETAIL, SCHED_LOC, SCHED_EMP_ID, SCHED_AUTHOR_ID, SCHED_DEPT_ID) "
			+ "values "
			+ "(#{schedTitle},#{schedStartDate},#{schedEndDate},#{schedType},#{schedDetail},#{schedLoc},#{schedEmpId},#{schedAuthorId},#{schedDeptId})")
	int aprvSchedUpload(AprvSchedUploadRequest req);
}
