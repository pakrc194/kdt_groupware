package vfive.gw.attendance.dto.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class LeaveDTO {
	
	@Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class Info {
      private int totalDays;  // 총 연차
      private int usedDays;   // 사용 연차
      private int leftDays;   // 잔여 연차
  }

  @Data
  @AllArgsConstructor
  @NoArgsConstructor
  public static class History {
      private String leaveDate;  // 휴가 일자
      private String leaveType;  // 휴가 종류 (연차, 반차 등)
      private String reason;     // 사유
  }

}
