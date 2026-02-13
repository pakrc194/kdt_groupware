package vfive.gw.home.service;

import java.io.File;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.home.dto.EmpPrvc;
import vfive.gw.home.mapper.HomeMapper;

@Service
public class UpdateEmpProfService {

	@Resource
	private HomeMapper mapper;
	
  // 파일을 저장할 경로
	@Value("${file.upload-dir}")
  private String uploadDir; 
	
	@Transactional
  public void updateProfile(EmpPrvc req) {
      // 파일 처리
      if (req.getFile() != null && !req.getFile().isEmpty()) {
          try {
              String originalFilename = req.getFile().getOriginalFilename();
              // 파일명 중복 방지를 위해 UUID나 시간을 붙이는 것이 좋지만, 
              // 간단하게 사번_파일명 구조로 저장 예시
              String saveFileName = UUID.randomUUID().toString() + "_" + originalFilename;
              
              // 디렉토리가 없으면 생성
              File directory = new File(uploadDir + saveFileName);
              if(!directory.getParentFile().exists()) directory.getParentFile().mkdirs();
              req.getFile().transferTo(directory); // 파일 저장
              
              // DB에 저장될 파일명 세팅
              req.setEmpPhoto(saveFileName); 
          } catch (Exception e) {
              throw new RuntimeException("파일 저장 중 오류 발생", e);
          }
      }

      // DB 업데이트
      int res = mapper.updateEmployeeProfile(req);
      
      if(res == 0) {
          throw new RuntimeException("수정 실패");
      }
  }
	
}
