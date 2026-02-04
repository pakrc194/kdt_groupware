package vfive.gw.attendance.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class MyAtdcStatDTO {
	private Summary summary;
  private LeaveInfo leaveInfo;
  private List<LeaveHistory> leaveHistory;
	
	@Data
  @AllArgsConstructor
  public static class Summary {
      private int totalWorkDays;     // 총 근무일
      private String streakDays;     // 개근 기록
      private double avgWeeklyHours; // 주당 평균 근무시간
  }

  @Data
  @AllArgsConstructor
  public static class LeaveInfo {
      private double total;
      private double used;
      private double remain;
  }

  @Data
  public static class LeaveHistory {
      private String leaveDate;
      private String status;
  }
	
}
