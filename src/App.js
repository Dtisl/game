import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Settings from './components/Settings';
import Game from './components/Game';
import LeaderBoard from './components/LeaderBoard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/settings" element={<Settings />} />
                <Route path="/game/:difficulty" element={<Game />} />
                <Route path="/leaderboard" element={<LeaderBoard />} />
            </Routes>
        </Router>
    );
}

export default App;
