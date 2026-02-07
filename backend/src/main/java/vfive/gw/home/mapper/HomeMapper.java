package vfive.gw.home.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import vfive.gw.home.dto.EmpPrvc;

@Mapper
public interface HomeMapper {
	

//	@Select("select * from SCHED")
//	List<Sched> shedList();
	
	@Select("SELECT " +
      "    E.EMP_SN, " +
      "    E.EMP_NM, " +
      "    D.DEPT_NAME, " +
      "    J.JBTTL_NM, " +
      "    E.EMP_EML_ADDR, " +
      "    E.EMP_PHOTO " +
      "FROM EMP_PRVC E " +
      "LEFT JOIN DEPT_INFO D ON E.DEPT_ID = D.DEPT_ID " +
      "LEFT JOIN JBTTL_INFO J ON E.JBTTL_ID = J.JBTTL_ID " +
      "WHERE E.EMP_ID = #{empId}")
	EmpPrvc selectUserProfileByEmpId(int empId);
	
}
