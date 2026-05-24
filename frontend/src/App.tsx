import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RecruiterDashboard from './components/RecruiterDashboard';
import AddCandidateForm from './components/AddCandidateForm';
import Positions from './components/Positions';
import PositionDetail from './components/PositionDetail';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/positions" replace />} />
        <Route path="/dashboard" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidateForm />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
