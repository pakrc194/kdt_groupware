package vfive.gw.dashboard.di;

import org.springframework.stereotype.Service;

@Service
public interface AccessAction {
	Object execute(String type);
}
