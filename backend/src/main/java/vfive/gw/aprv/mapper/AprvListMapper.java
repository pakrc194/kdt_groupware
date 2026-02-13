package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.response.AprvDeptListResponse;
import vfive.gw.aprv.dto.response.AprvDocFormListResponse;
import vfive.gw.aprv.dto.response.AprvDocListResponse;
import vfive.gw.aprv.dto.response.AprvEmpListResponse;
import vfive.gw.aprv.dto.response.AprvLocListResponse;

@Mapper
public interface AprvListMapper {
	@Select("""
			<script>
			SELECT D.*, E.EMP_NM
			FROM APRV_DOC D
			JOIN APRV_PRCS P
			  ON D.APRV_DOC_ID = P.APRV_DOC_ID
			JOIN EMP_PRVC E
			  ON D.DRFT_EMP_ID = E.EMP_ID
			WHERE P.APRV_PRCS_EMP_ID = #{pNo}
			  AND P.ROLE_CD LIKE '%ATRZ%'
			  AND P.APRV_PRCS_STTS != 'WAIT'
			<if test="stts != null and stts != ''">
			  AND D.APRV_DOC_STTS = #{stts} 
			</if>
			<if test="code != null and code != ''">
			  AND D.APRV_DOC_NO LIKE CONCAT('%', #{code}, '%') 
			</if>
			ORDER BY APRV_DOC_DRFT_DT DESC 
			<if test="limit != null and limit &gt; 0">
			 limit 0, #{limit}
			</if>
			</script>
			""")
			List<AprvDocListResponse> aprvList(@Param("pNo") int pNo, @Param("stts") String stts, @Param("code")String code, @Param("limit") Integer limit);
	
	@Select("""
			<script>
			SELECT A.*, E.EMP_NM
			FROM APRV_DOC A
			JOIN EMP_PRVC E ON A.DRFT_EMP_ID = E.EMP_ID
			WHERE A.DRFT_EMP_ID = #{empId}
			  AND A.APRV_DOC_STTS NOT IN ('TEMP','REJECTED')
			<if test="stts != null and stts != ''">
			  AND A.APRV_DOC_STTS = #{stts} 
			</if>
			<if test="code != null and code != ''">
			   AND A.APRV_DOC_NO LIKE CONCAT('%', #{code}, '%') 
			</if>
			ORDER BY APRV_DOC_DRFT_DT DESC 
			<if test="limit != null and limit > 0">
			 limit 0, #{limit}
			</if>
			</script>
			""")
			List<AprvDocListResponse> drftList(
			    @Param("empId") int empId,
			    @Param("stts") String stts,
			    @Param("code")String code, 
			    @Param("limit") Integer limit
			);
	
	@Select("select D.*, EMP_NM from APRV_DOC D join APRV_PRCS P "
			+ "on D.APRV_DOC_ID = P.APRV_DOC_ID "
			+ "join EMP_PRVC E on D.drft_emp_id = E.emp_id "
			+ "and aprv_prcs_emp_id = #{pNo} "
			+ "and role_cd like '%REF%' "
			+ "ORDER BY APRV_DOC_DRFT_DT DESC")
			//+ "and aprv_prcs_stts != 'WAIT'")
	List<AprvDocListResponse> referList(int pNo); 
	
	@Select("select APRV_DOC.*, EMP_PRVC.EMP_NM from APRV_DOC "
			+ "join EMP_PRVC on drft_emp_id = emp_id "
			+ "where drft_emp_id = #{pNo} and aprv_doc_stts='REJECTED' "
			+ "ORDER BY APRV_DOC_DRFT_DT DESC")
	List<AprvDocListResponse> rejectList(int pNo); 
	
	@Select("select APRV_DOC.*, EMP_PRVC.EMP_NM from APRV_DOC "
			+ "join EMP_PRVC on drft_emp_id = emp_id "
			+ "where drft_emp_id = #{pNo} and aprv_doc_stts = 'TEMP' "
			+ "ORDER BY APRV_DOC_DRFT_DT DESC")
	List<AprvDocListResponse> tempList(int pNo); 
	
	@Select("""
			SELECT
		    df.DOC_FORM_ID,
		    df.DOC_FORM_CD,
		    df.DOC_FORM_NM,
		    df.DOC_FORM_TYPE,
		    df.DEPT_ID,
		    df.DOC_FORM_YN,
		    GROUP_CONCAT(di.DEPT_NAME) AS DEPT_NAMES
		FROM DOC_FORM df
		LEFT JOIN DEPT_INFO di
		  ON FIND_IN_SET(di.DEPT_ID, df.DEPT_ID)
		GROUP BY
		    df.DOC_FORM_ID,
		    df.DOC_FORM_CD,
		    df.DOC_FORM_NM,
		    df.DOC_FORM_TYPE,
		    df.DEPT_ID,
		    df.DOC_FORM_YN;
		
			""")
	List<AprvDocFormListResponse> docDetailFormList();
	
	@Select("Select * from DOC_FORM where DOC_FORM_YN = 'Y'")
	List<AprvDocFormListResponse> docFormList();
	
	@Select("""
			<script>
			select * from EMP_PRVC 
			<where>
				  <choose>
				    <when test="filterNm == 'EMP_ID'">
				      EMP_ID = #{filterVl}
				    </when>
				    <when test="filterNm == 'EMP_NM'">
				      EMP_NM = #{filterVl}
				    </when>
				    <when test="filterNm == 'DEPT_ID'">
				      DEPT_ID = #{filterVl}
				    </when>
				    <otherwise>
				      1 = 1
				    </otherwise>
				  </choose>
			</where>
			</script>
			""")
	List<AprvEmpListResponse> empListFilter(AprvParams param);
	
	
	@Select("select * from DEPT_INFO")
	List<AprvDeptListResponse> aprvDeptList();
	
	@Select("select * from LOC_INFO")
	List<AprvLocListResponse> aprvLocList();
	
	@Select("""
		SELECT *
		FROM EMP_PRVC 
			""")
	List<AprvEmpListResponse> aprvDeptEmpList(@Param("empId") int empId);
}
