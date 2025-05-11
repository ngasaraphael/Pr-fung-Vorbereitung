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
          <div className="card reading" onClick={() => handleNavigate('reading')}>
            <FaBook className="card-icon" />
            <div>Lesen</div>
          </div>
          <div className="card group-reading" onClick={() => navigate('/quiz/reading-long')}>
            <FaBookOpen className="card-icon" /> Leseverstehen (Langtext)
          </div>
          <div className="card reading-ads-matching" onClick={() => handleNavigate('reading-ads')}>
            <FaTags className="card-icon" />
            <div>Lesen – Anzeigen Zuordnen</div>
          </div>
          <div className="card fill-blanks" onClick={() => handleNavigate('fill-blanks')}>
            <FaKeyboard className="card-icon" />
            Sprachbausteine (Lücken)
          </div>
          <div className="card mcqfill-blanks" onClick={() => handleNavigate('sprachbausteine-mcq')}>
            <FaPenFancy className="card-icon" />
            Sprachbausteine – Auswahl
          </div>
          <div className="card card-matching" onClick={() => handleNavigate('reading-matching')}>
            <FaPuzzlePiece className="card-icon" />
            <div>Lesen – Zuordnung</div>
          </div>
          

          <div className="card listening" onClick={() => handleNavigate('listening')}>
            <FaHeadphones className="card-icon" />
            <div>Hören</div>
          </div>
          <div className="card satzbau" onClick={() => handleNavigate('satzbau')}>
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
