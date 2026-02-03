package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

import vfive.gw.aprv.dto.request.AprvPrcsRequest;

@Mapper
public interface AprvPostMapper {
		
	@Update("""
			<script>
			UPDATE APRV_DOC
			SET APRV_DOC_STTS =
			<choose>
			  <when test="nextEmpNm != null and nextEmpNm != ''">
			    CONCAT(#{aprvPrcsStts}, '(', #{nextEmpNm}, ')')
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
			+ "(APRV_LINE_ID, APRV_DOC_ID, APRV_PRCS_EMP_ID, ROLE_CD, ROLE_SEQ, APRV_PRCS_DT, APRV_PRCS_STTS, RJCT_RSN, DRFT_DT)"
			+ "values "
			+ "(#{aprvLineId}, #{aprvDocId}, #{aprvPrcsEmpId}, #{roleCd}, #{roleSeq}, #{aprvPrcsDt}, #{aprvPrcsStts}, #{rjctRsn}, #{drftDt})")
	int iAprvPrcs(AprvPrcsRequest req);
	
	@Update("update APRV_PRCS "
			+ "set APRV_PRCS_DT = #{aprvPrcsDt}, APRV_PRCS_STTS=#{aprvPrcsStts}, RJCT_RSN=#{rjctRsn} "
			+ "where APRV_PRCS_EMP_ID = #{aprvPrcsEmpId} and APRV_DOC_ID = #{aprvDocId} ")//and APRV_PRCS_STTS='PENDING'
	int uAprvPrcs(AprvPrcsRequest req);
}
