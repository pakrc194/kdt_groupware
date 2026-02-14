import React from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';

function FacilityRepairStat({ facRep }) {
    const totalCount = facRep.length;
    const now = new Date();

    // 최근 12개월 배열 생성 (오늘 기준 역산)
    const recentMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
        };
    });

    // 월별 데이터 가공
    const chartData = recentMonths.map(({ year, month }) => {
        const monthStr = `${year}.${String(month).padStart(2, "0")}`;
        const count = facRep.filter(item => {
            const itemDate = new Date(item.schedStartDate);
            return itemDate.getFullYear() === year && (itemDate.getMonth() + 1) === month;
        }).length;

        return {
            name: monthStr,
            "보수/수리": count,
        };
    });

    return (
        <div className="facility-repair-stat" style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>🛠 시설 보수/수리 현황 (최근 1년)</h2>
                <span style={{ fontWeight: 'bold' }}>총 {totalCount}건</span>
            </div>

            {/* 차트 영역 */}
            <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
                        />
                        <Legend />
                        <Bar 
                            dataKey="보수/수리" 
                            fill="#82ca9d"  /* 보수/수리는 주의를 요하는 색상인 오렌지 계열로 설정 */
                            isAnimationActive={true} 
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 리스트 영역 */}
            <div style={{ marginTop: '20px', maxHeight: '400px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa' }}>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                            <th style={{ padding: '12px' }}>작업 명칭</th>
                            <th style={{ padding: '12px' }}>점검/수리일</th>
                            <th style={{ padding: '12px' }}>상세 내역</th>
                            <th style={{ padding: '12px' }}>장소</th>
                            <th style={{ padding: '12px' }}>담당자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facRep.length > 0 ? (
                            facRep
                                .sort((a, b) => new Date(b.schedStartDate) - new Date(a.schedStartDate))
                                .map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{item.schedTitle}</td>
                                        <td style={{ padding: '12px' }}>{item.schedStartDate.split(" ")[0]}</td>
                                        <td style={{ padding: '12px', color: '#666', fontSize: '0.9em' }}>{item.schedDetail}</td>
                                        <td style={{ padding: '12px' }}>{item.locNm || '현장'}</td>
                                        <td style={{ padding: '12px' }}>{item.empNm}</td>
                                    </tr>
                                ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>해당 기간 내 보수 내역이 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FacilityRepairStat;