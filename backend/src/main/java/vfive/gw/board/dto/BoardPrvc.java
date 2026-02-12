package vfive.gw.board.dto;


import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BoardPrvc {
	
	private int boardId;
	private String boardType;
	private String title;
	private String content;
	private Date createdAt ;
	private int views;
	private int empId;
	private String creator;
	private String isTop;// 상단 공지 등록
	private String empNm; // 사원이름
	
	
	private String temId;
	
	// 파일 업,다운 로드
	private int fileId;
    private String originName;
    private String savedPath;
    private long fileSize;
}
