package vfive.gw.login.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.login.dto.LoginRequest;
import vfive.gw.login.mapper.LoginMapper;

@Service
public class RegisterNewEmployeeService {
	
	@Resource
	private LoginMapper mapper;

  // 파일을 저장할 경로
	@Value("${file.upload-dir}")
  private String uploadDir; 

  @Transactional
  public int registerNewEmployee(LoginRequest req) {
      // 파일 업로드 처리
      if (req.getFile() != null && !req.getFile().isEmpty()) {
          try {
              String originalFilename = req.getFile().getOriginalFilename();
              String saveFilename = UUID.randomUUID().toString() + "_" + originalFilename;
              
              // 디렉토리 생성 및 파일 저장
              File directory = new File(uploadDir);
              if (!directory.exists()) directory.mkdirs();
              
              req.getFile().transferTo(new File(uploadDir + saveFilename));
              
              // DB에 저장할 파일명 세팅
              req.setEmpPhoto(saveFilename);
          } catch (IOException e) {
              throw new RuntimeException("파일 저장 중 오류 발생: " + e.getMessage());
          }
      }

      // 매퍼 호출
      return mapper.updateNewEmp(req);
  }

}
