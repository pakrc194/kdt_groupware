package vfive.gw.aprv.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.aprv.dto.response.AprvLineResponse;

@Mapper
public interface AprvLineMapper {
	@Select("SELECT"
			+ "  al.APRV_LINE_ID,"
			+ "  al.APRV_DOC_ID,"
			+ ""
			+ "  al.DRFT_REFNC_EMP1_ID,"
			+ "  dr1.EMP_NM AS DRFT_REFNC_EMP1_NM,"
			+ "  al.DRFT_REFNC_EMP2_ID,"
			+ "  dr2.EMP_NM AS DRFT_REFNC_EMP2_NM,"
			+ "  al.DRFT_REFNC_EMP3_ID,"
			+ "  dr3.EMP_NM AS DRFT_REFNC_EMP3_NM,"
			+ ""
			+ "  al.MID_ATRZ_EMP_ID,"
			+ "  m.EMP_NM   AS MID_ATRZ_EMP_NM,"
			+ ""
			+ "  al.MID_REFNC_EMP1_ID,"
			+ "  mr1.EMP_NM AS MID_REFNC_EMP1_NM,"
			+ "  al.MID_REFNC_EMP2_ID,"
			+ "  mr2.EMP_NM AS MID_REFNC_EMP2_NM,"
			+ "  al.MID_REFNC_EMP3_ID,"
			+ "  mr3.EMP_NM AS MID_REFNC_EMP3_NM,"
			+ ""
			+ "  al.LAST_ATRZ_EMP_ID,"
			+ "  l.EMP_NM   AS LAST_ATRZ_EMP_NM "
			+ ""
			+ "FROM APRV_LINE al "
			+ "LEFT JOIN EMP_PRVC dr1 ON dr1.EMP_ID = al.DRFT_REFNC_EMP1_ID "
			+ "LEFT JOIN EMP_PRVC dr2 ON dr2.EMP_ID = al.DRFT_REFNC_EMP2_ID "
			+ "LEFT JOIN EMP_PRVC dr3 ON dr3.EMP_ID = al.DRFT_REFNC_EMP3_ID "
			+ "LEFT JOIN EMP_PRVC m   ON m.EMP_ID   = al.MID_ATRZ_EMP_ID "
			+ "LEFT JOIN EMP_PRVC mr1 ON mr1.EMP_ID = al.MID_REFNC_EMP1_ID "
			+ "LEFT JOIN EMP_PRVC mr2 ON mr2.EMP_ID = al.MID_REFNC_EMP2_ID "
			+ "LEFT JOIN EMP_PRVC mr3 ON mr3.EMP_ID = al.MID_REFNC_EMP3_ID "
			+ "LEFT JOIN EMP_PRVC l   ON l.EMP_ID   = al.LAST_ATRZ_EMP_ID "
			+ "WHERE al.APRV_DOC_ID = 2"
			+ "")
	AprvLineResponse aprvLine(int docId);
}
