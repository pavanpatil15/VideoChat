import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import AuthProvider from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';
import Home from './pages/Home';
import History from './pages/History';

function App() {
  return (
    <div className='App' >
      <Router>
        <AuthProvider>
          <Routes>
            {/* Define your routes here */}
            <Route path="/" element={<LandingPage />} />

            <Route path="/auth" element={<Authentication />} />

            <Route path="/home" element={<Home />} />

            <Route path="/history" element={<History />} />

            <Route path="/:url" element={<VideoMeet />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
