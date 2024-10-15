import './App.css';
import GmailApiQuickstart from "./components/gmailApiIntegration/gmailApiIntegration"
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import Auth from "./Oath";
import SuccessLogin from "./sucess";
import GmailApiIntegration from "./components/gmailApiIntegration/gmailApiIntegration";
function App() {
  return (
      <Router>
          <Routes>
              <Route path={'/'} element={<GmailApiIntegration/>} />
              <Route path={'/auth'} element={<Auth/>} />
              <Route path={'/success'} element={<SuccessLogin/>}/>
          </Routes>
      </Router>
    //<GmailApiQuickstart></GmailApiQuickstart>
  );
}

export default App;
