package vfive.gw.attendance.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class DutySkedListDTO {
	private int scheId;
	private String scheTtl;
	private String empNm;
	private String trgtYmd;
	private String prgrStts;
	private LocalDateTime regDtm;
	private LocalDateTime modDtm;
}
