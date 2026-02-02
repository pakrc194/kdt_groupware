package vfive.gw.board.dto;

import java.sql.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BoardPrvc {
	
	private int BoardId, Views;
	private String Title,Creator ;
	private  Date CreatedAt ;
}
