import React, { useState } from 'react';

function TeamSelectPopup({ teamList, onClose, onSelect, selectedTeams }) {
    const [selected, setSelected] = useState(selectedTeams);

    const toggleTeam = (team) => {
        if (selected.find(t => t.deptId === team.deptId)) {
            setSelected(selected.filter(t => t.deptId !== team.deptId));
        } else {
            setSelected([...selected, team]);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 300, left: 1000, background: 'white', border: '1px solid black', padding: 20 }}>
            <h3>담당팀 선택</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {teamList.map(team => (
                    <li key={team.deptId}>
                        <label>
                            <input
                                type="checkbox"
                                checked={!!selected.find(t => t.deptId == team.deptId)}
                                onChange={() => toggleTeam(team)}
                            />
                            {team.deptName}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={() => onSelect(selected)}>확인</button>
            <button onClick={onClose}>취소</button>
        </div>
    );
}


export default TeamSelectPopup;
