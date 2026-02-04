package vfive.gw.board.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.Update;

import vfive.gw.board.di.PageInfo;
import vfive.gw.board.dto.BoardPrvc;

@Mapper
public interface BoardMapper {
    
    /**
     * 전체 게시물 수 조회
     */
    @Select("SELECT COUNT(*) FROM Board")
    int total();
    
    /**
     * 게시판 타입별 게시물 수 조회 (검색 포함)
     */
    @Select("<script>" +
            "SELECT COUNT(*) FROM Board " +
            "WHERE BoardType = #{sideId} " +
            "<if test='keyword != null and keyword != \"\"'>" +
            "AND Title LIKE CONCAT('%', #{keyword}, '%') " +
            "</if>" +
            "</script>")
    int totalByType(PageInfo pInfo);
//    int totalByType(@Param("boardType") String boardType, 
//    		@Param("keyword") String keyword);
    
    /**
     * 전체 게시물 목록 조회 (페이징)
     */
    @Select("SELECT * FROM Board ORDER BY BoardId DESC LIMIT #{start}, #{cnt}")
    List<BoardPrvc> list(PageInfo pInfo);
    
    /**
     * 게시판 타입별 게시물 목록 조회 (페이징, 검색 포함)
     */
    @Select("<script>" +
            "SELECT * FROM Board " +
            "WHERE BoardType = #{sideId} " +
            "<if test='keyword != null and keyword != \"\"'>" +
            "AND Title LIKE CONCAT('%', #{keyword}, '%') " +
            "</if>" +
            "ORDER BY IsTop DESC, BoardId DESC " +
            "LIMIT #{start}, #{cnt}" +
            "</script>")
    List<BoardPrvc> listByType(PageInfo pInfo);
//    List<BoardPrvc> listByType(@Param("boardType") String boardType, 
//    		@Param("pInfo") PageInfo pInfo,
//    		@Param("keyword") String keyword);

    /**
     * 게시물 상세 조회
     */
    @Select("SELECT * FROM Board WHERE BoardId = #{boardId}")
    BoardPrvc detail(@Param("boardId") int boardId);
    
    /**
     * 조회수 증가
     */
    @Update("UPDATE Board SET Views = Views + 1 WHERE BoardId = #{boardId}")
    int incrementViews(@Param("boardId") int boardId);
    
    /**
     * 게시물 등록 (자동 증가 ID)
     */
    @SelectKey(
        keyProperty = "boardId",
        resultType = Integer.class,
        before = true,
        statement = "SELECT IFNULL(MAX(BoardId), 0) + 1 FROM Board"
    )
    @Insert("INSERT INTO Board " +
            "(BoardId, BoardType, Title, Content, CreatedAt, Views, Creator, IsTop) " +
            "VALUES " +
            "(#{boardId}, #{boardType}, #{title}, #{content}, NOW(), 0, #{creator}, #{isTop})")
    int insertKey(BoardPrvc dto);
    
    /**
     * 게시물 등록 (일반)
     */
    @Insert("INSERT INTO Board " +
            "(BoardType, Title, Content, CreatedAt, Views, Creator, IsTop) " +
            "VALUES " +
            "(#{boardType}, #{title}, #{content}, NOW(), #{views}, #{creator}, #{isTop})")
    int insert(BoardPrvc dto);
    
    /**
     * 게시물 수정
     */
    @Update("UPDATE Board SET " +
            "Title = #{title}, " +
            "Content = #{content}, " +
            "IsTop = #{isTop} " +
            "WHERE BoardId = #{boardId}")
    int update(BoardPrvc dto);
    
    /**
     * 게시물 삭제
     */
    @Delete("DELETE FROM Board WHERE BoardId = #{boardId}")
    int delete(@Param("boardId") int boardId);
    
    /**
     * 작성자별 게시물 목록 조회
     */
    @Select("SELECT * FROM Board " +
            "WHERE Creator = #{creator} " +
            "ORDER BY CreatedAt DESC " +
            "LIMIT #{pInfo.start}, #{pInfo.cnt}")
    List<BoardPrvc> listByCreator(@Param("creator") String creator, 
                                   @Param("pInfo") PageInfo pInfo);
}