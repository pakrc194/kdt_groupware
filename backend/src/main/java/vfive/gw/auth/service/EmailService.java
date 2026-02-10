package vfive.gw.auth.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vfive.gw.auth.dto.AuthEmailDTO;
import vfive.gw.auth.mapper.EmailMapper;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailMapper emailMapper;

    public void sendAuthMail(AuthEmailDTO req) {
        // 1. 6자리 인증번호 생성
        String authCode = String.valueOf((int)(Math.random() * 899999) + 100000);

        // 2. 메일 발송
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(req.getEmail());
        message.setSubject("[사내시스템] 이메일 인증 번호");
        message.setText("인증번호: " + authCode + "\n5분 이내에 입력해주세요.");
        mailSender.send(message);

        // 3. DB에 저장 (MyBatis)
        req.setCode(authCode);
        emailMapper.insertAuthCode(req);
    }

    public boolean verifyCode(AuthEmailDTO req) {
        // 인증번호 체크
        boolean isMatched = emailMapper.checkAuthCode(req) > 0;
        
        if (isMatched) {
            emailMapper.deleteAuthCode(req); // 인증 성공 시 인증번호 삭제
        }
        return isMatched;
    }
    
    public boolean verifyIdentity(AuthEmailDTO req) {
    	// 비밀번호 체크
      String dbPassword = emailMapper.selectPswdByEmail(req);
      
      boolean isPasswordMatch = dbPassword != null && dbPassword.equals(req.getPassword());

      if (!isPasswordMatch) return false;

      // 인증번호 체크
      boolean isCodeMatch = emailMapper.checkAuthCode(req) > 0;

      if (isCodeMatch) {
          emailMapper.deleteAuthCode(req); // 인증 성공 시 인증번호 삭제
          return true;
      }

      return false;
    }
}
