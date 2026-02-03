package vfive.gw.aprv.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.provider.AprvProvider;
import vfive.gw.aprv.service.AprvAction;
import vfive.gw.aprv.service.AprvPrcs;

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
