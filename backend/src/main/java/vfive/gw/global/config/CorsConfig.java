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
		.allowedOrigins("http://192.168.0.117:3000", "http://192.168.219.106:3000","http://192.168.0.36:3000","http://192.168.0.49:3000", "http://192.168.0.67:3000", "http://172.30.57.186:3000" )	//본인 리액트 url , 로 추가
		.allowedMethods("*")
		.allowedHeaders("*")
		.exposedHeaders("*")
		.allowCredentials(true);
	}
}
