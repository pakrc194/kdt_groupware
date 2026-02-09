package vfive.gw.aprv.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvAttendUploadRequest;
import vfive.gw.aprv.dto.request.AprvDocVerListRequest;
import vfive.gw.aprv.dto.request.AprvDrftUploadRequest;
import vfive.gw.aprv.dto.request.AprvDutyScheDtlRequest;
import vfive.gw.aprv.dto.request.AprvEmpAnnlLvRequest;
import vfive.gw.aprv.dto.request.AprvLocListRequest;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.dto.request.AprvSchedRequest;
import vfive.gw.aprv.dto.request.AprvSchedUploadRequest;
import vfive.gw.aprv.dto.response.AprvEmpAnnlLvResponse;
import vfive.gw.aprv.provider.AprvProvider;
import vfive.gw.aprv.service.AprvAction;
import vfive.gw.aprv.service.AprvAttendUpload;
import vfive.gw.aprv.service.AprvDocVerList;
import vfive.gw.aprv.service.AprvDrftUpload;
import vfive.gw.aprv.service.AprvDutyScheDtl;
import vfive.gw.aprv.service.AprvEmpAnnlLv;
import vfive.gw.aprv.service.AprvLocList;
import vfive.gw.aprv.service.AprvPrcs;
import vfive.gw.aprv.service.AprvSchedList;
import vfive.gw.aprv.service.AprvSchedUpload;

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
	
	@PostMapping("/AprvLocList")
	Object aprvSchedList(@RequestBody AprvLocListRequest req) {
		System.out.println(req);
		return provider.getContext().getBean(AprvLocList.class).load(req);
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
}
