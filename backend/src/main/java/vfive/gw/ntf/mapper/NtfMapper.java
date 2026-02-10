package vfive.gw.ntf.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.ntf.dto.NtfDto;
import vfive.gw.ntf.dto.NtfRequest;

@Mapper
public interface NtfMapper {
	@Select("""
			SELECT N.NTF_ID, N.NTF_TYPE, N.TITLE, N.BODY, N.LINK_URL, N.CREATED_AT,
		     R.READ_YN, R.READ_AT
			FROM NTF_RCP R
			JOIN NTF N ON N.NTF_ID = R.NTF_ID
			WHERE R.RCP_EMP_ID = #{empId}
			  AND R.DEL_YN = 'N'
			ORDER BY N.NTF_ID DESC
			LIMIT 20;
			""")
	int polling(int empId);
	
	@Select("""
			SELECT N.NTF_ID, N.NTF_TYPE, N.TITLE, N.BODY, N.LINK_URL, N.CREATED_AT,
	       R.READ_YN, R.READ_AT
			FROM NTF_RCP R
			JOIN NTF N ON N.NTF_ID = R.NTF_ID
			WHERE R.RCP_EMP_ID = #{empId}
			  AND R.DEL_YN = 'N'
			ORDER BY N.NTF_ID DESC
			LIMIT 20;
			""")
	NtfDto list(int empId);
	
	
	@Insert("""
			INSERT INTO NTF (NTF_TYPE, TITLE, BODY, LINK_URL, SRC_TYPE, SRC_ID, CREATED_BY, CREATED_AT)
			VALUES (#{ntfType}, #{title}, #{body}, #{linkUrl}, #{srcType}, #{srcId}, #{createdBy}, #{createdAt})
			""")
			@Options(useGeneratedKeys = true, keyProperty = "ntfId")
			int insertNtf(NtfRequest req);
	
	
	@Insert("""
			<script>
			INSERT INTO NTF_RCP (NTF_ID, RCP_EMP_ID, DEL_YN, READ_YN, CREATED_AT)
			VALUES
			<foreach collection="empIds" item="empId" separator=",">
			  (#{ntfId}, #{empId}, 'N', 'N', #{createdAt})
			</foreach>
			</script>
			""")
			int insertReceivers(@Param("ntfId") int ntfId,
			                    @Param("empIds") List<Integer> empIds,
			                    @Param("createdAt") String createdAt);
	
	@Select("""
			SELECT APRV_PRCS_EMP_ID
			FROM APRV_PRCS
			WHERE APRV_DOC_ID = #{aprvDocId}
			  AND ROLE_CD IN ('DRFT_REF', 'MID_ATRZ')
			  AND APRV_PRCS_STTS = 'PENDING'
			""")
			List<Integer> selectDraftReceivers(int aprvDocId);
	
	@Select("""
			SELECT APRV_PRCS_EMP_ID
			FROM APRV_PRCS
			WHERE APRV_DOC_ID = #{aprvDocId}
			  AND ROLE_CD LIKE '%ATRZ%'
			  AND APRV_PRCS_STTS = 'PENDING'
			""")
			List<Integer> selectNextApprovers(int aprvDocId);
	
	@Insert("""
			<script>
			INSERT INTO NTF_RCP
			  (NTF_ID, RCP_EMP_ID, DEL_YN, READ_YN, CREATED_AT)
			VALUES
			<foreach collection="empIds" item="empId" separator=",">
			  (#{ntfId}, #{empId}, 'N', 'N', #{createdAt})
			</foreach>
			</script>
			""")
			int insertNtfReceivers(
			    @Param("ntfId") int ntfId,
			    @Param("empIds") List<Integer> empIds,
			    @Param("createdAt") String createdAt
			);

	@Select("""
			SELECT APRV_PRCS_EMP_ID
			FROM APRV_PRCS
			WHERE APRV_DOC_ID = #{aprvDocId}
			  AND ROLE_CD LIKE '%ATRZ%'
			  AND APRV_PRCS_STTS = 'PENDING'
			""")
			List<Integer> selectPendingApprovers(int aprvDocId);
}
