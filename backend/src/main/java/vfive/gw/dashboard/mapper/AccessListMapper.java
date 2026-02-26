package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;
import vfive.gw.dashboard.dto.request.AccessListDTO;
import vfive.gw.dashboard.dto.response.AccessDeleteDTO;
import vfive.gw.dashboard.dto.response.AddAccessEmpower;

@Mapper
public interface AccessListMapper {
	@Select("SELECT * FROM ACCESS_LIST WHERE ACCESS_SECTION = #{type}")
	List<AccessListDTO> accessList(String type);
	
	@Select("SELECT * FROM ACCESS_LIST")
	List<AccessListDTO> allAccessList(String type);
	
	@Select("SELECT L.* FROM ACCESS_EMPOWER A "
			+ "JOIN ACCESS_LIST L on A.ACCESS_DETAIL = L.ACCESS_LIST_ID "
			+ "WHERE (A.ACCESS_TYPE = 'JBTTL' and A.EMPOWER_ID = #{jbttl}) "
			+ "OR (A.ACCESS_TYPE = 'DEPT' and A.EMPOWER_ID = #{dept}) ")
	List<AccessListDTO> accessFilterList(@Param("jbttl") int jbttl, @Param("dept")int dept);
	
	
	@Delete("delete from ACCESS_EMPOWER where access_empower_id = #{accessDeleteId}")
	int accessEmpowerDelete(AccessDeleteDTO dto);
	
	@Insert("insert into ACCESS_DELETE (ACCESS_DELETE_TYPE, DELETE_EMPOWER_ID, ACCESS_DELETE_SECTION, ACCESS_DELETE_DETAIL, ACCESS_DELETE_DATE) "
			+ "values (#{accessDeleteType}, #{deleteEmpowerId}, #{accessDeleteSection}, #{accessDeleteDetail}, now() )")
	int accessDeleteLog(AccessDeleteDTO dto);
}
