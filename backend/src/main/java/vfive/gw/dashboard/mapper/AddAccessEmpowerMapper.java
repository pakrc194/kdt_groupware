package vfive.gw.dashboard.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import vfive.gw.dashboard.dto.response.AddAccessEmpower;

@Mapper
public interface AddAccessEmpowerMapper {
	
	@Insert("insert into ACCESS_EMPOWER (ACCESS_TYPE, EMPOWER_ID, ACCESS_SECTION, ACCESS_DETAIL) "
			+ "values (#{accessType}, #{empowerId}, #{accessSection}, #{accessDetail} )")
	int addAccessEmpower(AddAccessEmpower aae);

}
