package vfive.gw.dashboard.provider;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

import lombok.Getter;

@Service
@Getter
public class DashboardProvider implements ApplicationContextAware {
	
	ApplicationContext context;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		// TODO Auto-generated method stub
		context = applicationContext;
	}

}
