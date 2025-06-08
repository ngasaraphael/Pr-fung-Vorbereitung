import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { LevelProvider } from './context/LevelContext';
import SprachbausteineTeil1 from './pages/SprachbausteineTeil1';

import HomePage from './pages/HomePage';

import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import LeseverstehenTeil2 from './pages/LeseverstehenTeil2';
import LeseverstehenTeil1 from './pages/LeseverstehenTeil1';
import LeseverstehenTeil3 from './pages/LeseverstehenTeil3';
import SprachbausteineTeil2 from './pages/SprachbausteineTeil2';
import HoerverstehenTeil1 from './pages/HoerverstehenTeil1';
import HoerverstehenTeil2 from './pages/HoerverstehenTeil2';
import HoerverstehenTeil3 from './pages/HoerverstehenTeil3';
import ExaminationPage from './pages/ExaminationPage';
import Email from './pages/Email';








function App() {
  return (
    <LevelProvider> 
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/quiz/reading-long" element={<LeseverstehenTeil2 />} />
          <Route path="/quiz/reading-matching" element={<LeseverstehenTeil1 />} />
          <Route path="/quiz/reading-ads" element={<LeseverstehenTeil3 />} />
          <Route path="/quiz/fill-blanks" element={<SprachbausteineTeil2 />} />
          <Route path="/quiz/sprachbausteine-mcq" element={<SprachbausteineTeil1 />} />
          <Route path="/quiz/listening1" element={<HoerverstehenTeil1 />} />
          <Route path="/quiz/listening2" element={<HoerverstehenTeil2 />} /> 
          <Route path="/quiz/listening3" element={<HoerverstehenTeil3 />} />
          <Route path="/quiz/email" element={<Email />} />
          <Route path="/exam" element={<ExaminationPage />} />
        </Routes>
      </Router>
    </LevelProvider> 
  );
}

export default App;
