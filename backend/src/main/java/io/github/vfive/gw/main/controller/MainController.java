package io.github.vfive.gw.main.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/main")
public class MainController {
	
	@RequestMapping
	Object String() {
		
		return "aaa";
	}
}
