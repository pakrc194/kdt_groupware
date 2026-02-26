package vfive.gw.attendance.dto.domain;

import java.time.LocalTime;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class workTypeCdDTO {
	private String wrkCd, wrkNm;
	@JsonFormat(pattern = "HH:mm:ss")
  private LocalTime strtTm;
  @JsonFormat(pattern = "HH:mm:ss")
  private LocalTime endTm;
  private int brkTmMin;
	
}
