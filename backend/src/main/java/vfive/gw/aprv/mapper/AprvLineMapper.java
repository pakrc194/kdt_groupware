package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.response.AprvDocLineResponse;
import vfive.gw.aprv.dto.response.AprvFormLineResponse;

@Mapper
public interface AprvLineMapper {
	
	
	@Select("select APRV_PRCS.*, EMP_NM as APRV_PRCS_EMP_NM from APRV_PRCS "
			+ "join EMP_PRVC on aprv_prcs_emp_id = emp_id where aprv_doc_id = #{docId} "
			+ "ORDER BY FIELD(role_cd, 'DRFT', 'DRFT_REF', 'MID_ATRZ', 'MID_REF', 'LAST_ATRZ')")
	List<AprvDocLineResponse> docLine(int docId);
}
