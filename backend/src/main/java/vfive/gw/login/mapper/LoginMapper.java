package vfive.gw.login.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;

@Mapper
public interface LoginMapper {
	
	@Select("select E.*, D.DEPT_NAME, D.DEPT_CODE, J.JBTTL_NM "
			+ "from EMP_PRVC E "
			+ "left join DEPT_INFO D on E.DEPT_ID = D.DEPT_ID "
			+ "left join JBTTL_INFO J on E.JBTTL_ID = J.JBTTL_ID "
			+ "where E.EMP_SN = #{empSn} and E.EMP_PSWD = #{empPswd}")
	LoginResponse login(LoginRequest req);
}
