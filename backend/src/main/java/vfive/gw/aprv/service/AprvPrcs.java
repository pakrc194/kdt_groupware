package vfive.gw.aprv.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.Resource;
import vfive.gw.aprv.dto.request.AprvPrcsRequest;
import vfive.gw.aprv.mapper.AprvPostMapper;


@Service
public class AprvPrcs {
	@Resource
	AprvPostMapper postMapper;
	
	@Transactional
	public Object load(AprvPrcsRequest ap) {
		ap.setAprvPrcsDt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
		
		postMapper.docSttsUpdate(ap);
		postMapper.uAprvPrcs(ap);
		
		return Map.of("res","success");
	}
}
