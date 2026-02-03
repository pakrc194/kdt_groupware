package vfive.gw.board.controller;



import java.util.ServiceLoader.Provider;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.BoardProvider;
import vfive.gw.board.di.BoardAction;
import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;

@RestController
@RequestMapping("/board")
public class BoardController {

	@Resource
	BoardProvider provider;
	
	
	@GetMapping("/{service}")
	public Object board(
			@PathVariable("service") String service,
			BoardPrvc dto,
			PageInfo pInfo,
			HttpServletRequest request,
			HttpServletResponse response
			) {
		
		System.out.println(service);
			return provider.getContext()
					.getBean(service,BoardAction.class)
					.execute(dto, pInfo, request, response);
	}
	
	
}
