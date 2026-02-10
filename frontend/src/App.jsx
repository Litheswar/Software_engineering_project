import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import PostItemPage from './pages/PostItemPage';
import ActivityPage from './pages/ActivityPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/post" element={<PostItemPage />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
