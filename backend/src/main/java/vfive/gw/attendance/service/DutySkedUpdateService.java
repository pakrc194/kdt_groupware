package vfive.gw.attendance.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.DutyRequestDTO;
import vfive.gw.attendance.dto.response.DutySkedListDTO;
import vfive.gw.attendance.mapper.DutyMapper;

@Service
public class DutySkedUpdateService {

	@Resource
	private DutyMapper mapper;
	
	@Transactional
	public void execute(DutyRequestDTO req) {
		mapper.updateDutyMaster(req);
		
		mapper.deleteDutyDetails(req);
		
		if(req.getDetails() != null && !req.getDetails().isEmpty()) {
			mapper.insertDutyDetails(req.getDetails());
		}
	}
	
	@Transactional
  public void confirmDutySchedule(DutyRequestDTO req) {
		
		System.out.println("req: "+req);
    // 1. 현재 결재 대상인 근무표 정보 가져오기
    DutySkedListDTO currentDuty = mapper.selectDutyById(req);
    System.out.println("currentDuty: "+currentDuty);
    if (currentDuty == null) {
        throw new RuntimeException("존재하지 않는 근무표입니다.");
    }

    // 2. 중복 체크 (같은 부서, 같은 날짜에 이미 확정된 게 있는지)
    int alreadyConfirmedCount = mapper.countConfirmedDuty(currentDuty);
    System.out.println("alreadyConfirmedCount: "+alreadyConfirmedCount);

    if (alreadyConfirmedCount > 0) {
        // 이미 확정된 근무표가 있다면 예외 발생
        throw new IllegalStateException("해당 부서의 해당 날짜에는 이미 확정된 근무표가 존재합니다.");
    }

    // 3. 업데이트 진행
    mapper.updateDutyToConfirmed(req);
    System.out.println("업데이트 까지 됐나????");
  }
	
}
