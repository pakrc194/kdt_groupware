import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import BoardGraph from '../../Dashboard/component/BoardGraph'; 

function BoardDash() {
    const [boardStats, setBoardStats] = useState([]); // 게시판별 파이차트용
    const [monthlyData, setMonthlyData] = useState([]); // 월별 추이 라인차트용
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([])

    useEffect(() => {
        setIsLoading(true);
        
        // 모든 게시판 정보를 가져오는 API 호출
        fetcher(`/board/all-statistics`)
            .then(data => {
                const posts = Array.isArray(data) ? data : [];
                console.log("데이터 확인 :",posts)
                // setData(data)
                // --- 1. 게시판별 분포 가공 (Pie Chart) ---
                const statsMap = posts.reduce((acc, curr) => {
                    console.log("acc값 확인",acc)
                    const type = curr.boardType || '일반';
                    acc[type] = (acc[type] || 0) + 1;
                    return acc;
                }, {});

                const formattedStats = Object.keys(statsMap).map(key => ({
                    name: key === 'important' ? '중요공지'
                        : key === 'public' ? '공용게시판'
                        : key === 'SA' ? '안전관리'
                        : key === 'FA' ? '시설관리'
                        : key === 'HR' ? '인사'
                        : key === 'SO' ? '뷰티'
                        : key === 'WF' ? '여성패션'
                        : key === 'MyPosts' ? '내가쓴 게시글'
                        : key === 'FO' ? '식품 게시판' : key,
                    "게시글수": statsMap[key] // Recharts의 일반적인 명칭인 value로 세팅
                }));
                setBoardStats(formattedStats);

                // --- 2. 월별 작성 추이 가공 (Line Chart) ---
                const monthMap = posts.reduce((acc, curr) => {
                    if(!curr.createdAt) return acc;
                    // 날짜 형식이 '2024-05-20...' 일 경우 월 추출
                    const date = new Date(curr.createdAt);
                    const m = (date.getMonth() + 1) + '월';
                    acc[m] = (acc[m] || 0) + 1;
                    return acc;
                }, {});

                // 최근 6개월간의 라벨 생성 (데이터가 없어도 0으로 표시하기 위함)
                const last6Months = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const mName = (d.getMonth() + 1) + '월';
                    last6Months.push({ 
                        name: mName, 
                        "게시글수": monthMap[mName] || 0 
                    });
                }
                setMonthlyData(last6Months);

                setIsLoading(false);
            })
            .catch(e => {
                console.error("Dashboard fetch error:", e);
                setIsLoading(false);
            });
    }, []);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>📌 전사 게시판 활동 대시보드</h1>
                <p style={styles.subtitle}>전체 게시판의 업로드 현황과 트렌드를 분석합니다.</p>
            </header>

            {isLoading ? (
                <div style={styles.loading}>차트를 생성하는 중입니다...</div>
            ) : (
                <div style={styles.content}>
                    {/* 그래프 컴포넌트에 가공된 데이터 전달 */}
                    <BoardGraph 
                        boardStats={boardStats} 
                        monthlyData={monthlyData} 
                    />
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    header: { marginBottom: '40px', textAlign: 'center' },
    title: { fontSize: '32px', fontWeight: '800', color: '#2d3436', letterSpacing: '-1px' },
    subtitle: { color: '#636e72', marginTop: '10px', fontSize: '16px' },
    content: { 
        backgroundColor: '#fff', 
        borderRadius: '20px', 
        padding: '30px', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
    },
    loading: { textAlign: 'center', marginTop: '100px', fontSize: '20px', color: '#b2bec3' }
};

export default BoardDash;