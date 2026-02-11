package vfive.gw.login.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.auth.dto.AuthEmailDTO;
import vfive.gw.auth.service.EmailService;
import vfive.gw.home.mapper.HomeMapper;
import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.mapper.LoginMapper;

@Service
public class FindPasswordService {
	@Resource
  private LoginMapper mapper;

  @Resource
  private EmailService emailService; // 이미 구현된 서비스

  public Map<String, Object> sendAuthCodeIfValid(LoginRequest req) {
      Map<String, Object> res = new HashMap<>();
      
      // 1. DB 일치 여부 확인
      int count = mapper.checkEmpEmailMatch(req);
      
      if (count > 0) {
      	AuthEmailDTO reqDTO = new AuthEmailDTO();
      	reqDTO.setEmail(req.getEmpEmlAddr());
        // 2. 존재할 경우 이메일 발송 로직 호출
        // 구현되어 있는 서비스의 메서드(예: sendCode)를 호출
      	emailService.sendAuthMail(reqDTO); 
        
        res.put("exists", true);
        res.put("message", "인증번호가 발송되었습니다.");
      } else {
        // 3. 존재하지 않을 경우
        res.put("exists", false);
        res.put("message", "일치하는 사원 정보가 없습니다.");
      }
      
      return res;
  }

  public boolean resetPassword(LoginRequest req) {
      return mapper.updatePassword(req) > 0;
  }
}
