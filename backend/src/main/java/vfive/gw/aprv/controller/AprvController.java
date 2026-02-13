package vfive.gw.aprv.controller;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvAttendUploadRequest;
import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.request.AprvDrftTempRequest;
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.request.AprvEmpAnnlLvRequest;
import vfive.gw.aprv.dto.request.AprvFileUploadRequest;
import vfive.gw.aprv.dto.request.AprvFormCreateRequest;
import vfive.gw.aprv.dto.request.AprvLocListRequest;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.dto.request.AprvRoleVlRequest;
import vfive.gw.aprv.dto.request.AprvSchedRequest;
import vfive.gw.aprv.dto.request.AprvSchedUploadRequest;
import vfive.gw.aprv.dto.request.AprvTempDeleteRequest;
import vfive.gw.aprv.dto.response.AprvEmpAnnlLvResponse;
import vfive.gw.aprv.mapper.AprvMapper;
import vfive.gw.aprv.provider.AprvProvider;
import vfive.gw.aprv.service.AprvAction;
import vfive.gw.aprv.service.AprvAttendUpload;
import vfive.gw.aprv.service.AprvDocVerList;
import vfive.gw.aprv.service.AprvDrftDelete;
import vfive.gw.aprv.service.AprvDrftTemp;
import vfive.gw.aprv.service.AprvDrftUpload;
import vfive.gw.aprv.service.AprvDutyScheDtl;
import vfive.gw.aprv.service.AprvEmpAnnlLv;
import vfive.gw.aprv.service.AprvFormCreate;
import vfive.gw.aprv.service.AprvLocFilterList;
import vfive.gw.aprv.service.AprvLocList;
import vfive.gw.aprv.service.AprvPrcs;
import vfive.gw.aprv.service.AprvRoleVl;
import vfive.gw.aprv.service.AprvSchedList;
import vfive.gw.aprv.service.AprvSchedUpload;
import vfive.gw.aprv.service.AprvTempDelete;

@RestController
@RequestMapping("/gw/aprv")
public class AprvController {
	
	@Resource
	AprvProvider provider;
	
	@GetMapping(path= {"/{service}","/{service}/{pNo}"})
	Object list(
			AprvParams aParams, 
			AprvPageInfo pInfo,
			HttpServletRequest request, HttpServletResponse response) {
		Object oo = provider.getContext().getBean(getServiceName(aParams.getService()), AprvAction.class).execute(aParams, pInfo, request, response);
		
		return oo;
	}
	
	
	@PostMapping("/AprvPrcs")
	Object aprvPrcs(@RequestBody AprvPrcsRequest ap) {
		System.out.println("arpv prcs : "+ap);
		
		Object oo = provider.getContext().getBean(AprvPrcs.class).load(ap);
		
		return oo;
	}
	
	@PostMapping("/AprvEmpAnnlLv")
	List<AprvEmpAnnlLvResponse> empAnnlLv(@RequestBody AprvEmpAnnlLvRequest req) {
		return provider.getContext().getBean(AprvEmpAnnlLv.class).load(req);
	}
	
	@PostMapping("/AprvDrftUpload")
	Object aprvDrftUpload(@RequestBody AprvDrftUploadRequest req) {
		return provider.getContext().getBean(AprvDrftUpload.class).load(req);
	}
	
	@PostMapping("/AprvDutyScheDtl")
	Object aprvDutyScheDtl(@RequestBody AprvDutyScheDtlRequest req) {
		System.out.println("AprvDutyScheDtl "+req);
		return provider.getContext().getBean(AprvDutyScheDtl.class).load(req);
	}
	
	@PostMapping("/AprvSchedList")
	Object aprvSchedList(@RequestBody AprvSchedRequest req) {
		System.out.println("contoller AprvSchedList "+req);
		return provider.getContext().getBean(AprvSchedList.class).load(req);
	}
	
	@PostMapping("/AprvLocFilterList")
	Object aprvLocFilterList(@RequestBody AprvLocListRequest req) {
		System.out.println(req);
		return provider.getContext().getBean(AprvLocFilterList.class).load(req);
	}

	
	@PostMapping("/AprvSchedUpload")
	Object aprvSchedList(@RequestBody AprvSchedUploadRequest req) {
		System.out.println(req);
		return provider.getContext().getBean(AprvSchedUpload.class).load(req);
	}
	
	@PostMapping("/AprvDocVerList")
	Object aprvDocVerList(@RequestBody AprvDocVerListRequest req) {
		Object oo = provider.getContext().getBean(AprvDocVerList.class).load(req);
		System.out.println(oo);
		return oo;
	}
	
	@PostMapping("/AprvAttendUpload")
	Object aprvAttendUpload(@RequestBody AprvAttendUploadRequest req) {
		return provider.getContext().getBean(AprvAttendUpload.class).load(req);
	}
	
	@PostMapping("/AprvDrftTemp")
	Object aprvDrftTemp(@RequestBody AprvDrftTempRequest req) {
		return provider.getContext().getBean(AprvDrftTemp.class).load(req);
	}
	@PostMapping("/AprvTempDelete")
	Object aprvTempDelete(@RequestBody AprvTempDeleteRequest req) {
		
		return provider.getContext().getBean(AprvTempDelete.class).load(req);
	}
	@PostMapping("/AprvDrftDelete")
	Object aprvDrftDelete(@RequestBody AprvTempDeleteRequest req) {
		
		return provider.getContext().getBean(AprvDrftDelete.class).load(req);
	}
	@PostMapping("/AprvRoleVl")
	Object aprvRoleVl(@RequestBody AprvRoleVlRequest req) {
		System.out.println("req "+req);
		return provider.getContext().getBean(AprvRoleVl.class).load(req);
	}
	@PostMapping("/AprvFileUpload")
	Object aprvFileUpload(AprvFileUploadRequest req, HttpServletRequest request) {
		req.setOriginName(req.getDocFile().getOriginalFilename());
		req.setSavedPath(uploadDir);
		if(!req.getDocFile().isEmpty()) {
			fileSave(req, request);
			mapper.aprvUploadFile(req);
		}
		
		System.out.println("req "+req);
		return Map.of("res","yyy");
	}
	@PostMapping("/AprvFormCreate")
	Object aprvFormCreate(@RequestBody AprvFormCreateRequest req) {
		System.out.println("req "+req);
		return provider.getContext().getBean(AprvFormCreate.class).load(req);
	}
	
	String getServiceName(String service) {
		String tt = "";
		for(int i=0; i<service.length(); i++) {
			tt+=service.charAt(i);
			if(i==0) {
				tt = tt.toLowerCase();
			}
		}
		
		return tt;
	}
	@Value("${file.upload-dir}")
	private String uploadDir;
	
	@Resource
	AprvMapper mapper;
	
	void fileSave(AprvFileUploadRequest req, HttpServletRequest request) {
		
		
		File dir = new File(uploadDir);
		if (!dir.exists()) dir.mkdirs();
		
		 
		String savedPath = uploadDir + System.currentTimeMillis() + "_" + req.getDocFile().getOriginalFilename();
		req.setSavedPath(savedPath);
		File saveFile = new File(savedPath);
		try {
			req.getDocFile().transferTo(saveFile);  // 파일 저장
		
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
