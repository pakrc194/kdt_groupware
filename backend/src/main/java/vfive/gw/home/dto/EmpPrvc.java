package vfive.gw.home.dto;

import java.io.File;
import java.util.Date;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmpPrvc {
	private int empId, deptId, jbttlId, accessId, empSnCnt;
	private String empSn, empNm, empPswd, empEmlAddr, empPhoto, empAddr, empTelno, empActno, empJncmpYmd, empRsgntnYmd, empAcntStts, newPassword, deptName, jbttlNm;
	private Date empBirth;
	private MultipartFile file;
	
}
