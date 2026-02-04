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
	private String creator;
	private boolean isTop;
	
	
	private String temId;
}
