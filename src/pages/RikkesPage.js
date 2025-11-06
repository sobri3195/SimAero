import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RikkesDashboard from '../components/rikkes/RikkesDashboard';
import RikkesNewExam from '../components/rikkes/RikkesNewExam';
import RikkesExamForm from '../components/rikkes/RikkesExamForm';
import RikkesPDFPreview from '../components/rikkes/RikkesPDFPreview';
import RikkesAnalytics from '../components/rikkes/RikkesAnalytics';

const RikkesPage = () => {
  return (
    <Routes>
      <Route path="/" element={<RikkesDashboard />} />
      <Route path="/new" element={<RikkesNewExam />} />
      <Route path="/exam/:id" element={<RikkesExamForm />} />
      <Route path="/preview/:id" element={<RikkesPDFPreview />} />
      <Route path="/analytics" element={<RikkesAnalytics />} />
    </Routes>
  );
};

export default RikkesPage;
