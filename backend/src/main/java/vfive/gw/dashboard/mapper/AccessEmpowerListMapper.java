package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;

@Mapper
public interface AccessEmpowerListMapper {
	@Select("SELECT ACCESS_EMPOWER.*, ACCESS_LIST.ACCESS_DETAIL AS ACCESS_NAME,  "
			+ "case "
			+ "when ACCESS_EMPOWER.ACCESS_TYPE = 'DEPT' "
			+ "then DEPT_INFO.DEPT_NAME "
			+ "else JBTTL_INFO.JBTTL_NM "
			+ "end as empower_name "
			+ "FROM ACCESS_EMPOWER "
			+ "left JOIN DEPT_INFO "
			+ "ON DEPT_INFO.DEPT_ID = ACCESS_EMPOWER.EMPOWER_ID "
			+ "JOIN ACCESS_LIST "
			+ "ON ACCESS_EMPOWER.ACCESS_DETAIL = ACCESS_LIST.ACCESS_LIST_ID "
			+ "left JOIN JBTTL_INFO on JBTTL_INFO.JBTTL_ID = ACCESS_EMPOWER.EMPOWER_ID")
	List<AccessEmpowerDTO> accessEmpowerList();

}
