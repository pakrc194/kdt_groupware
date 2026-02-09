package vfive.gw.dashboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.dashboard.dto.request.AccessListDTO;

@Mapper
public interface AccessListMapper {
	@Select("SELECT * FROM ACCESS_LIST WHERE ACCESS_SECTION = #{type}")
	List<AccessListDTO> accessList(String type);
}
