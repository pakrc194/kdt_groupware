package vfive.gw.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CorsConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// TODO Auto-generated method stub
		registry.addMapping("/**")
		.allowedOrigins("http://192.168.0.117:3000")	//본인 리액트 url , 로 추가
		.allowedMethods("GET","POST")
		.allowedHeaders("*")
		.exposedHeaders("*")
		.allowCredentials(true);
	}
}
