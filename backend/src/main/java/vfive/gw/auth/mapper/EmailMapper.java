package vfive.gw.auth.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.auth.dto.AuthEmailDTO;

@Mapper
public interface EmailMapper {
	
	//인증번호 저장 (이미 있으면 업데이트)
  @Insert("INSERT INTO EMAIL_AUTH (EMAIL, AUTH_CODE, EXPIRE_TIME) " +
          "VALUES (#{email}, #{code}, DATE_ADD(NOW(), INTERVAL 5 MINUTE)) " +
          "ON DUPLICATE KEY UPDATE AUTH_CODE = #{code}, EXPIRE_TIME = DATE_ADD(NOW(), INTERVAL 5 MINUTE)")
  void insertAuthCode(AuthEmailDTO req);

  // 인증번호 확인
  @Select("SELECT COUNT(*) FROM EMAIL_AUTH " +
          "WHERE EMAIL = #{email} AND AUTH_CODE = #{code} AND EXPIRE_TIME > NOW()")
  int checkAuthCode(AuthEmailDTO req);
  
  // 비밀번호 가져오기
  @Select("SELECT EMP_PSWD FROM EMP_PRVC WHERE EMP_EML_ADDR = #{email} and EMP_SN = #{empSn}")
  String selectPswdByEmail(AuthEmailDTO req);

  // 인증 완료 후 삭제
  @Delete("DELETE FROM EMAIL_AUTH WHERE EMAIL = #{email}")
  void deleteAuthCode(AuthEmailDTO req);

}
