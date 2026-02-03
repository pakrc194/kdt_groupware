package vfive.gw.board.di;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.board.dto.BoardPrvc;
import vfive.gw.board.mapper.BoardMapper;

@Service("noticeBo")
public class NoticeBo implements BoardAction {
	
	@Resource
	BoardMapper mapper;
	
	@Override
	public Object execute(
			BoardPrvc dto,
			PageInfo pInfo,
			HttpServletRequest request,
			HttpServletResponse response) {
	
		if (pInfo.getPNo() == 0) {
		    pInfo.setPNo(1);
		}
		
		pInfo.setTotal(mapper.total());
		return mapper.list(pInfo);
	}
	
	
}
