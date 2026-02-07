package vfive.gw.login.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.dto.LoginResponse;

@Mapper
public interface LoginMapper {
	
	@Select("select * from EMP_PRVC where EMP_SN = #{empSn} and EMP_PSWD = #{empPswd}")
	LoginResponse login(LoginRequest req);
}
