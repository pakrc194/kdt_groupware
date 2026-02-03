package vfive.gw.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;

import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;

@Mapper
public interface BoardMapper {
	
	@Select("select count(*) as total from Board")
	int total();
	
	@Select("select * from Board order by BoardId desc limit #{start},#{cnt}")
	List<BoardPrvc> list(PageInfo pInfo);
	
	
	@Select("select * from Board where BoardId = #{boardId}")
	BoardPrvc detail(BoardPrvc dto);
	
	@Insert("insert into Board"
			+"(BoardId,Title,CreatedAt,Views,Creator)"
			+"values"
			+"(#{boardId},#{title},#{createdAt},#{views},#{creator})")
	int insert(BoardPrvc dto);
	
	@SelectKey(
			keyProperty = "boardId",
			resultType = Integer.class,
			before = true,
			statement = "select max(BoardId)+1 from Board"
			)
	@Insert("insert into Board"
			+"(BoardId,Title,CreatedAt,Views,Creator)"
			+"values"
			+"(#{boardId},#{title},#{createdAt},#{views},#{creator})")
	int insertKey(BoardPrvc dto);
			
	
	

			
}
