package vfive.gw.aprv.service;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.aprv.dto.request.AprvPageInfo;
import vfive.gw.aprv.dto.request.AprvParams;

@Service
public interface AprvAction {
	Object execute(AprvParams service, AprvPageInfo pInfo, HttpServletRequest request, HttpServletResponse response);
}
