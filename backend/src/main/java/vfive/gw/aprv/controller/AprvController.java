package vfive.gw.aprv.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;
import vfive.gw.aprv.mapper.AprvMapper;
import vfive.gw.aprv.provider.AprvProvider;
import vfive.gw.aprv.service.AprvAction;

@RestController
@RequestMapping("/gw/aprv/{service}")
public class AprvController {
	
	@Resource
	AprvProvider provider;
	
	@GetMapping(path= {"","/{pNo}"})
	Object list(AprvParams aParams, AprvPageInfo pInfo,
			HttpServletRequest request, HttpServletResponse response) {
		//System.out.println("service : " + aParams.getService());
		Object oo = provider.getContext().getBean(getServiceName(aParams.getService()), AprvAction.class).execute(aParams, pInfo, request, response);
		
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
