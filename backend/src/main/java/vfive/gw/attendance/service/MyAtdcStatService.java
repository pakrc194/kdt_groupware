package vfive.gw.attendance.service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import vfive.gw.attendance.dto.domain.LeaveDTO;
import vfive.gw.attendance.dto.response.MyAtdcStatDTO;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class MyAtdcStatService {
	
	@Resource
	AtdcMapper mapper;

	public MyAtdcStatDTO execute(HttpServletRequest request, HttpServletResponse response) {
		String year = request.getParameter("year");
		if (year == null || year.isEmpty()) year = String.valueOf(LocalDate.now().getYear());
		
		// 임시 하드코딩된 사원번호 2 (나중에 세션 등으로 대체)
		int empId = 2;

		// 1. 연차 정보 & 리스트 가져오기
		LeaveDTO.Info leaveInfo = mapper.selectLeaveInfo(empId, year);
		List<LeaveDTO.History> leaveHistory = mapper.selectLeaveHistory(empId, year);

		// 2. 근무 기록 가져오기
		List<Map<String, Object>> logs = mapper.selectRawWorkLogs(empId, year);
		
		int totalDays = logs.size();
		long totalWorkMinutes = 0;
		Set<LocalDate> attendedDates = new HashSet<>();

		for (Map<String, Object> log : logs) {
			LocalDateTime inDtm = (LocalDateTime) log.get("CLK_IN_DTM");
			LocalDateTime outDtm = (LocalDateTime) log.get("CLK_OUT_DTM");
			
			if (inDtm != null) {
				attendedDates.add(inDtm.toLocalDate());
				
				// 근무 시간 합산 (주당 평균용)
				if (outDtm != null) {
					totalWorkMinutes += Duration.between(inDtm, outDtm).toMinutes() - 60; // 점심시간 제외
				} else {
					totalWorkMinutes += 480; // 기록 없으면 8시간 기본
				}
			}
		}

		// 3. 현재 무결근 며칠차인지 계산 (Streak)
		int streakDays = 0;
		LocalDate checkDate = LocalDate.now();
		
		// 오늘이 주말이면 마지막 금요일부터 역추적 시작
		while (checkDate.getDayOfWeek() == DayOfWeek.SATURDAY || checkDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
			checkDate = checkDate.minusDays(1);
		}

		while (true) {
			// 평일인 경우에만 체크
			if (checkDate.getDayOfWeek() != DayOfWeek.SATURDAY && checkDate.getDayOfWeek() != DayOfWeek.SUNDAY) {
				if (attendedDates.contains(checkDate)) {
					streakDays++;
				} else {
					// 기록이 없는 평일을 만나면 중단
					break;
				}
			}
			checkDate = checkDate.minusDays(1);
			// 최대 1년치까지만 역추적 제한
			if (checkDate.getYear() < Integer.parseInt(year) || streakDays > 365) break;
		}

		// 4. 주당 평균 근무시간 계산
		int currentWeek = LocalDate.now().getYear() == Integer.parseInt(year) 
			? LocalDate.now().get(WeekFields.of(Locale.KOREA).weekOfYear()) 
			: 52;

		double weeklyHours = (totalDays > 0) ? (totalWorkMinutes / 60.0) / currentWeek : 0.0;

		// 5. 결과 조립 (Summary의 두 번째 인자에 streakDays를 문자열로 전달)
		MyAtdcStatDTO res = new MyAtdcStatDTO();
		res.setSummary(new MyAtdcStatDTO.Summary(
			totalDays, 
			String.valueOf(streakDays), 
			Math.round(weeklyHours * 10) / 10.0
		));
		res.setLeaveInfo(leaveInfo != null ? leaveInfo : new LeaveDTO.Info(0, 0, 0));
		res.setLeaveHistory(leaveHistory);

		return res;
	}
}