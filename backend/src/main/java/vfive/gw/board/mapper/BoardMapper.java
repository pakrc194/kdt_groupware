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
     * 전체 게시물 목록 조회 (페이징)
     */
    @Select("SELECT * FROM Board ORDER BY BoardId DESC LIMIT #{start}, #{cnt}")
    List<BoardPrvc> list(PageInfo pInfo);
    
    

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
         * 조건별 게시물 수 조회
         */
        @Select("<script>" +
                "SELECT COUNT(*) FROM Board " +
                "WHERE BoardType = #{sideId} " +
                "<if test='keyword != null and keyword != \"\"'>" +
                "  <choose>" +
                "    <when test='searchType == \"title\"'> AND Title LIKE CONCAT('%', #{keyword}, '%') </when>" +
                "    <when test='searchType == \"boardId\"'> AND BoardId = #{keyword} </when>" +
                "    <when test='searchType == \"creator\"'> AND Creator LIKE CONCAT('%', #{keyword}, '%') </when>" +
                "  </choose>" +
                "</if>" +
                "</script>")
        int totalByType(PageInfo pInfo);

        /**
         * 조건별 목록 조회
         */
        @Select("<script>" +
                "SELECT * FROM Board " +
                "WHERE BoardType = #{sideId} " +
                "<if test='keyword != null and keyword != \"\"'>" +
                    "<choose>" +
                    "  <when test='searchType == \"title\"'> AND Title LIKE CONCAT('%', #{keyword}, '%') </when>" +
                    "  <when test='searchType == \"boardId\"'> AND BoardId = #{keyword} </when>" +
                    "  <when test='searchType == \"creator\"'> AND Creator LIKE CONCAT('%', #{keyword}, '%') </when>" +
                    "</choose>" +
                "</if>" +
                "ORDER BY IsTop DESC, BoardId DESC " +
                "LIMIT #{start}, #{cnt}" +
                "</script>")
        List<BoardPrvc> listByType(PageInfo pInfo);
    
    
    
    /**
     * 작성자별 게시물 목록 조회
     */
    @Select("SELECT * FROM Board " +
            "WHERE Creator = #{creator} " +
            "ORDER BY CreatedAt DESC " +
            "LIMIT #{pInfo.start}, #{pInfo.cnt}")
    List<BoardPrvc> listByCreator(@Param("creator") String creator, 
                                   @Param("pInfo") PageInfo pInfo);


    
    // 파일 업,다운 로드를 위한 SQL 
    @Insert ("INSERT INTO BoardFile (BoardId,OriginName,SavePath,FileSize)"+
    	"VALUES (#{boardId},#{originName},#{savePath},#{fileSize})")
    	int insertFile(BoardPrvc file);

 // 특정 게시글의 파일 목록 조회
    @Select("SELECT * FROM BoardFile WHERE BoardId = #{boardId}")
    List<BoardPrvc> selectFilesByBoardId(int boardId);

    // 파일 삭제 (수정 또는 게시글 삭제 시 사용)
    @Delete("DELETE FROM BoardFile WHERE FileId = #{fileId}")
    int deleteFile(int fileId);

    @Select("SELECT * FROM BoardFile WHERE FileId = #{fileId}")
    BoardPrvc getFileById(int fileId);

















}


