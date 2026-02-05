package vfive.gw.attendance.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vfive.gw.attendance.dto.domain.LeaveDTO;

@Data
public class MyAtdcStatDTO {
	// 근태통계
	private Summary summary;
	// 연차관련
  private LeaveDTO.Info leaveInfo;
  private List<LeaveDTO.History> leaveHistory;
	
	@Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Summary {
      private int totalWorkDays;     // 총 근무일
      private String streakDays;     // 개근 기록
      private double avgWeeklyHours; // 주당 평균 근무시간
  }

	
}
