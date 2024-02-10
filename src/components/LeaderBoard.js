import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/leaderboard.css';

function LeaderBoard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const location = useLocation();

    useEffect(() => {
        const savedLeaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        setLeaderboard(savedLeaderboard);

        if (location.state && location.state.time) {

        }
    }, [location]);

    const addResultToLeaderboard = (time) => {
        if (playerName.trim() !== '') {
            const newEntry = { name: playerName, time };
            const updatedLeaderboard = [...leaderboard, newEntry];
            updatedLeaderboard.sort((a, b) => a.time - b.time);
            const trimmedLeaderboard = updatedLeaderboard.slice(0, 10);

            localStorage.setItem('leaderboard', JSON.stringify(trimmedLeaderboard));
            setLeaderboard(trimmedLeaderboard);
            setPlayerName('');
        }
    };

    return (
        <div>
            <h1>Таблица лидеров</h1>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index}>
                        {index + 1}. {entry.name} - {entry.time} сек
                    </li>
                ))}
            </ul>
            {location.state && location.state.time ? (
                <div>
                    <label>
                        Введите ваше имя:
                        <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                    </label>
                    <button onClick={() => addResultToLeaderboard(location.state.time)}>
                        Добавить результат в таблицу лидеров
                    </button>
                </div>
            ) : null}
            <Link to="/settings" className="link-button">Вернуться к настройкам</Link>
        </div>
    );
}

export default LeaderBoard;
