package vfive.gw.aprv.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.request.AprvEmpAnnlLvRequest;
import vfive.gw.aprv.dto.request.AprvLocListRequest;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvSchedRequest;
import vfive.gw.aprv.dto.response.AprvDocDetailResponse;
import vfive.gw.aprv.dto.response.AprvDocDtlVlResponse;
import vfive.gw.aprv.dto.response.AprvDocFormLineResponse;
import vfive.gw.aprv.dto.response.AprvDocInptResponse;
import vfive.gw.aprv.dto.response.AprvDocVerListResponse;
import vfive.gw.aprv.dto.response.AprvDutyScheDtlResponse;
import vfive.gw.aprv.dto.response.AprvEmpAnnlLvResponse;
import vfive.gw.aprv.dto.response.AprvLocListResponse;
import vfive.gw.aprv.dto.response.AprvSchedResponse;

@Mapper
public interface AprvMapper {
	@Select("select APRV_DOC.*, EMP_PRVC.EMP_NM as DRFT_EMP_NM from APRV_DOC join EMP_PRVC on APRV_DOC.DRFT_EMP_ID = EMP_PRVC.EMP_ID where aprv_doc_id = #{docId}")
	AprvDocDetailResponse detail(int docId);
	
	@Select("select * from DOC_INPT where doc_form_id = #{formId}")
	List<AprvDocInptResponse> docInpt(int formId);
	
	
	@Select("select * from APRV_INPT_VL V join DOC_INPT I on V.doc_inpt_id = I.doc_inpt_id where aprv_doc_id = #{docId} order by I.doc_inpt_id asc")
	List<AprvDocDtlVlResponse> docDtlVl(int docId);
	
	@Select("select * from ANNL_LV_STTS where emp_id=#{empId} and base_yy=#{year}")
	AprvEmpAnnlLvResponse empAnnlLv(AprvEmpAnnlLvRequest req);
	
	
	@Select("""
			<script>
			select L.*, MA.EMP_NM as MID_ATRZ_EMP_NM, LA.EMP_NM as LAST_ATRZ_EMP_NM from DOC_FORM_LINE L 
			left join EMP_PRVC MA on L.MID_ATRZ_EMP_ID = MA.EMP_ID 
			left join EMP_PRVC LA on L.LAST_ATRZ_EMP_ID = LA.EMP_ID 
			where DOC_FORM_ID = #{docId};
			</script>
			""")
	AprvDocFormLineResponse docFormLine(int docId);
	
	@Select("select * from DUTY_SCHE_DTL where EMP_ID = #{empId} and DUTY_YMD between #{docStart} and #{docEnd}")
	List<AprvDutyScheDtlResponse> dutyScheDtl(AprvDutyScheDtlRequest req);
	
	@Select("SELECT * FROM SCHED WHERE SCHED_START_DATE <= #{docEnd} AND SCHED_END_DATE >= #{docStart}")//sched_emp_id = #{empId}
	List<AprvSchedResponse> schedList(AprvSchedRequest req);
	
	@Select("SELECT * FROM LOC_INFO left join SCHED on LOC_ID = SCHED_LOC")//WHERE SCHED_START_DATE <= #{docEnd} AND SCHED_END_DATE >= #{docStart}"
	List<AprvLocListResponse> locList(AprvLocListRequest req);
	

}
