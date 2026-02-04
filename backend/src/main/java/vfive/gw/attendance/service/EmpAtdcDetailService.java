package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.EmpAtdcDetailDTO;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class EmpAtdcDetailService {

    @Resource
    private AtdcMapper mapper;

    // 상세 내역 조회
    public List<EmpAtdcDetailDTO> execute(EmpAtdcRequestDTO req) {
        // 기간 미선택 시 기본값 설정 (예: 최근 1개월) 로직 추가 가능
        return mapper.selectEmpAtdcDetail(req);
    }
}