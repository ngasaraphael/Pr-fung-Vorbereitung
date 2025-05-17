import { useNavigate } from 'react-router-dom';
import { FaBook, FaHeadphones, FaCubes, FaBookOpen, FaPuzzlePiece, FaClipboardList, FaKeyboard, FaTags, FaPenFancy} from "react-icons/fa";
import '../css/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (section) => {
    if (section === 'exam') {
      navigate('/exam');
    } else {
      navigate(`/quiz/${section}`);
    }
  };

  return (
    <div className="homepage">
      <h1>Los geht’s!</h1>
      <p>Wähle einen Abschnitt:</p>

        <div className="card-container">
          <div className="card" onClick={() => handleNavigate('reading-matching')}>
            <FaPuzzlePiece className="card-icon" />
            <div>Leseverstehen Teil 1</div>
          </div>
          <div className="card" onClick={() => navigate('/quiz/reading-long')}>
            <FaBookOpen className="card-icon" />Leseverstehen Teil 2
          </div>
          <div className="card" onClick={() => handleNavigate('reading-ads')}>
            <FaTags className="card-icon" />
            <div>Leseverstehen Teil 3</div>
          </div>
           <div className="card " onClick={() => handleNavigate('sprachbausteine-mcq')}>
            <FaPenFancy className="card-icon" />
            Sprachbausteine Teil 1
          </div>
          
          <div className="card" onClick={() => handleNavigate('fill-blanks')}>
            <FaKeyboard className="card-icon" />
            Sprachbausteine Teil 2
          </div>
          <div className="card" onClick={() => handleNavigate('reading')}>
            <FaBook className="card-icon" />
            <div>Lesen</div>
          </div>

      

          

          <div className="card " onClick={() => handleNavigate('listening')}>
            <FaHeadphones className="card-icon" />
            <div>Hören</div>
          </div>
          <div className="card " onClick={() => handleNavigate('satzbau')}>
            <FaCubes className="card-icon" />
            <div>Satzbau</div>
          </div>
          <div className="card exam" onClick={() => handleNavigate('exam')}>
            <FaClipboardList className="card-icon" />
            <div>Gesamte Prüfung</div>
          </div>
        </div>
    </div>
  );
}

export default HomePage;
