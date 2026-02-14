import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function BoardGraph({ boardStats, monthlyData }) {
    
    if (!boardStats || boardStats.length === 0) {
        return (
            <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ color: '#999' }}>📊 통계 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            
            {/* 1. 월별 작성 추이 (Line Chart) - 새로 추가 */}
            <div style={{ width: '100%', height: '350px' }}>
                <h4 style={styles.chartTitle}>📈 최근 6개월 작성 추이</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="게시글수" 
                            stroke="#ff7300" 
                            strokeWidth={3}
                            dot={{ r: 6 }}
                            activeDot={{ r: 8 }} 
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* 2. 막대 그래프 섹션 */}
                <div style={{ flex: 1, minWidth: '300px', height: '400px' }}>
                    <h4 style={styles.chartTitle}>📊 게시판별 활동량</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={boardStats} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="게시글수" fill="#8884d8" barSize={40} radius={[5, 5, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 3. 파이 차트 섹션 */}
                <div style={{ flex: 1, minWidth: '300px', height: '400px' }}>
                    <h4 style={styles.chartTitle}>🍰 게시판 점유율</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={boardStats}
                                cx="50%" cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="게시글수"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {boardStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

const styles = {
    chartTitle: { textAlign: 'center', marginBottom: '20px', color: '#2d3436', fontWeight: '700' }
};

export default BoardGraph;