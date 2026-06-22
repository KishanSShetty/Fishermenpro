import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import EmergencyProcedures from './pages/EmergencyProcedures';
import Methodology from './pages/Methodology';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/emergency-procedures" element={<EmergencyProcedures />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
