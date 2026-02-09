package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessEmpowerDTO;
import vfive.gw.dashboard.dto.request.AccessListDTO;
import vfive.gw.schedule.dto.Sched;

@Mapper
public interface AccessListMapper {
	@Select("SELECT * FROM ACCESS_LIST WHERE ACCESS_SECTION = #{type}")
	List<AccessListDTO> accessList(String type);
	
	@Delete("delete from ACCESS_EMPOWER where access_empower_id = #{accessEmpowerId}")
	int accessEmpowerDelete(AccessEmpowerDTO dto);
}
