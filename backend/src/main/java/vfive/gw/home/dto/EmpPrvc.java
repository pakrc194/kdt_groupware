package vfive.gw.home.dto;

import java.util.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EmpPrvc {
	private int empId, deptId, jbttlId, accessId;
	private String empSn, empNm, empPswd, empEmlAddr, empPhoto, empAddr, empTelNo, empActNo, empJncmpYmd, empRsgntnYmd, empAcntStts;
	private Date empBirth;
	
	
	public EmpPrvc(String empSn,String empNm, String empPswd
			) {
		super();
		this.empSn = empSn;
		this.empNm = empNm;
		this.empPswd = empPswd;
		
	}
}
