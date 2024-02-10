import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/settings.css';

function Settings() {
    const [difficulty, setDifficulty] = useState('easy');
    const navigate = useNavigate();

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const startGame = () => {
        navigate(`/game/${difficulty}`);
    };

    return (
        <div>
            <h1>Настройки игры</h1>
            <div>
                <label>
                    Выберите уровень сложности:
                    <select value={difficulty} onChange={handleDifficultyChange}>
                        <option value="easy">Простой</option>
                        <option value="medium">Средний</option>
                        <option value="hard">Сложный</option>
                    </select>
                </label>
            </div>
            <button onClick={startGame}>Начать игру</button>
            <Link to="/leaderboard" className="link-button">Таблица лидеров</Link>
        </div>
    );
}

export default Settings;
