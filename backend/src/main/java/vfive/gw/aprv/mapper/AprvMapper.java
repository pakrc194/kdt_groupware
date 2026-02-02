package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.response.AprvDocDetailResponse;
import vfive.gw.aprv.dto.response.AprvDocListResponse;
import vfive.gw.aprv.dto.response.AprvInptVlResponse;
import vfive.gw.aprv.dto.response.AprvLineResponse;

@Mapper
public interface AprvMapper {
	
	@Select("select * from APRV_DOC join EMP_PRVC where drft_emp_id=emp_id")
	List<AprvDocListResponse> list();
	
	@Select("select APRV_DOC.*, EMP_PRVC.EMP_NM as DRFT_EMP_NM from APRV_DOC join EMP_PRVC on APRV_DOC.DRFT_EMP_ID = EMP_PRVC.EMP_ID where aprv_doc_id = #{docId}")
	AprvDocDetailResponse detail(int docId);
	
	@Select("select * from APRV_INPT_VL V join DOC_INPT I on V.doc_inpt_id = I.doc_inpt_id where aprv_doc_id = #{docId}")
	List<AprvInptVlResponse> docInpt(int docId);
	

}
