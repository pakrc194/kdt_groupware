package vfive.gw.board.di;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.board.dto.BoardPrvc;

public interface BoardAction {

	Object execute(
			BoardPrvc dto,
			PageInfo pInfo,
			HttpServletRequest request,
			HttpServletResponse response
					);
	
}
