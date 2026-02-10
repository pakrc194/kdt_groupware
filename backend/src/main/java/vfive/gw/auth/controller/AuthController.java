package vfive.gw.auth.controller;

import java.security.Identity;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vfive.gw.auth.dto.AuthEmailDTO;
import vfive.gw.auth.service.EmailService;

@RestController
@RequestMapping("/gw/auth")
@RequiredArgsConstructor
public class AuthController {

    private final EmailService emailService;

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@RequestBody AuthEmailDTO req) {
        emailService.sendAuthMail(req);
        
        return ResponseEntity.ok(Map.of("message", "인증코드가 발송되었습니다."));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody AuthEmailDTO req) {
        boolean isSuccess = emailService.verifyCode(req);
        return isSuccess 
            ? ResponseEntity.ok(Map.of("success", true))
            : ResponseEntity.status(400).body(Map.of("success", false, "message", "인증번호가 틀렸거나 만료되었습니다."));
    }
    
    @PostMapping("/verify-indentity")
    public ResponseEntity<?> verifyIndentity(@RequestBody AuthEmailDTO req) {
    	boolean isSuccess = emailService.verifyIdentity(req);
    	return isSuccess 
    			? ResponseEntity.ok(Map.of("success", true))
    					: ResponseEntity.status(400).body(Map.of("success", false, "message", "인증번호가 틀렸거나 만료되었습니다."));
    }
}
