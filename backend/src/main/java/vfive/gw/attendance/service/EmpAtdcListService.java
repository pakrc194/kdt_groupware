package vfive.gw.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import vfive.gw.attendance.dto.request.EmpAtdcRequestDTO;
import vfive.gw.attendance.dto.response.EmpAtdcListDTO;
import vfive.gw.attendance.mapper.AtdcMapper;

@Service
public class EmpAtdcListService {

    @Resource
    private AtdcMapper mapper;

    public List<EmpAtdcListDTO> execute(EmpAtdcRequestDTO req) {
        // 검색어 가공 (필요한 경우 DTO 내부 값을 직접 수정하거나 새로 세팅)
        if (req.getEmpNm() != null) {
            req.setEmpNm(req.getEmpNm().trim());
        }
        return mapper.selectEmpAtdcStats(req);
    }
}
