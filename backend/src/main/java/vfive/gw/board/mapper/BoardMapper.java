package vfive.gw.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.board.dto.BoardPrvc;

@Mapper
public class BoardMapper {
	
	@Select("selsect * from Board")
	List<BoardPrvc> list();
	
}
