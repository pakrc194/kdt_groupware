package vfive.gw.board.dto;

import java.sql.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BoardPrvc {
	
	private int boardId, views;
	private String title,vreator ;
	private  Date createdAt ;
}
