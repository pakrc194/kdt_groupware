package vfive.gw.aprv.dto.request;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class AprvFileUploadRequest {
	MultipartFile docFile;
	Integer aprvDocId;
	
	private int fileId;
    private String originName;
    private String savedPath;
    private long fileSize;
}
