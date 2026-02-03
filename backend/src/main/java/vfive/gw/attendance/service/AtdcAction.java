package vfive.gw.attendance.service;

import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public interface AtdcAction {
	Object execute(
			HttpServletRequest request, HttpServletResponse response
			);
}
