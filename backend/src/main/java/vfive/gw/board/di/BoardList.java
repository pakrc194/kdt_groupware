package vfive.gw.board.di;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.board.dto.BoardPrvc;
import vfive.gw.board.mapper.BoardMapper;

@Service("list")
public class BoardList implements BoardAction{
	
	@Resource
	BoardMapper mapper;
	
	
	
	@Override
	public Object execute(
			BoardPrvc dto,
			PageInfo pInfo,
			HttpServletRequest request,
			HttpServletResponse response) {
		
		pInfo.setTotal(mapper.total());
		return mapper.list(pInfo);
	}
	
}
