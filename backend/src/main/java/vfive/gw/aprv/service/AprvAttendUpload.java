package vfive.gw.aprv.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvAttendUploadRequest;
import vfive.gw.aprv.mapper.AprvMapper;
import vfive.gw.aprv.mapper.AprvPostMapper;

@Service
public class AprvAttendUpload {
	@Resource
	AprvPostMapper postMapper;
	
	@Resource
	AprvMapper mapper;
	
	@Transactional
	public Object load(AprvAttendUploadRequest req) {
		LocalDate localDateStart =
			    LocalDate.parse(req.getDocStart(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		LocalDate localDateEnd =
			    LocalDate.parse(req.getDocEnd(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		
		List<LocalDate> dateList = new ArrayList<>();
		
		for (LocalDate d = localDateStart; !d.isAfter(localDateEnd); d = d.plusDays(1)) {
		    dateList.add(d);
		}
		
		int insertResult = mapper.insertAtdcHist(req.getEmpId(), dateList);
		if(insertResult==0) {
			throw new RuntimeException("휴가 등록 실패");
		}
			
		int updateResult = mapper.updateAnnlLvStts(req.getEmpId(), 2026, new BigDecimal(dateList.size()));
		if(updateResult==0) {
			throw new RuntimeException("연차 차감 실패");
		}
		System.out.println("AprvAttendUpload "+req);
		
		return Map.of("result", req);
	}
}
