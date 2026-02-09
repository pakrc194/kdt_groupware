package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.response.AprvDeptListResponse;
import vfive.gw.aprv.dto.response.AprvDocFormListResponse;
import vfive.gw.aprv.dto.response.AprvDocListResponse;
import vfive.gw.aprv.dto.response.AprvEmpListResponse;

@Mapper
public interface AprvListMapper {
	@Select("select * from APRV_DOC D join APRV_PRCS P "
			+ "on D.APRV_DOC_ID = P.APRV_DOC_ID "
			+ "and aprv_prcs_emp_id = #{pNo} "
			+ "and role_cd like '%ATRZ%' "
			+ "and aprv_prcs_stts != 'WAIT'")
	List<AprvDocListResponse> aprvList(int pNo); 
	
	@Select("select * from APRV_DOC where drft_emp_id = #{pNo} and aprv_doc_stts != 'TEMP'")
	List<AprvDocListResponse> drftList(int pNo); 
	
	@Select("select * from APRV_DOC D join APRV_PRCS P "
			+ "on D.APRV_DOC_ID = P.APRV_DOC_ID "
			+ "and aprv_prcs_emp_id = #{pNo} "
			+ "and role_cd like '%REF%' "
			+ "and aprv_prcs_stts != 'WAIT'")
	List<AprvDocListResponse> referList(int pNo); 
	
	@Select("select * from APRV_DOC where drft_emp_id = #{pNo} and aprv_doc_stts='REJECTED'")
	List<AprvDocListResponse> rejectList(int pNo); 
	
	@Select("select * from APRV_DOC where drft_emp_id = #{pNo} and aprv_doc_stts = 'TEMP'")
	List<AprvDocListResponse> tempList(int pNo); 
	
	@Select("select * from DOC_FORM")
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
}
