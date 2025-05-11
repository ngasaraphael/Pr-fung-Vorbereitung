import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { LevelProvider } from './context/LevelContext';
import MCQFillBlanksQuiz from './pages/MCQFillBlanksQuiz';

import HomePage from './pages/HomePage';
import QuizPage from './pages/ReadingQuizPage';
import ExamPage from './pages/ExamPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import GroupedReadingQuiz from './pages/GroupedReadingQuiz';
import MatchingReadingQuiz from './pages/MatchingReadingQuiz';
import MatchingAdQuiz from './pages/MatchingAdsReadingQuiz';
import FillInTheBlanksQuiz from './pages/FillInTheBlanksQuiz';



function App() {
  return (
    <LevelProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:section" element={<QuizPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/quiz/reading-long" element={<GroupedReadingQuiz />} />
           <Route path="/quiz/reading-matching" element={<MatchingReadingQuiz />} />
           <Route path="/quiz/reading-ads" element={<MatchingAdQuiz />} />
           <Route path="/quiz/fill-blanks" element={<FillInTheBlanksQuiz />} />
           <Route path="/quiz/sprachbausteine-mcq" element={<MCQFillBlanksQuiz />} />

        </Routes>
      </Router>
    </LevelProvider>
  );
}

export default App;
