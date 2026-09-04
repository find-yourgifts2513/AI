import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UploadModal from './components/UploadModal';
import AuthModal from './components/AuthModal';

import DashboardPage from './pages/DashboardPage';
import WardrobePage from './pages/WardrobePage';
import OutfitGeneratorPage from './pages/OutfitGeneratorPage';
import SkinTonePage from './pages/SkinTonePage';
import SchedulerPage from './pages/SchedulerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TryOnPage from './pages/TryOnPage';

function MainAppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { token } = useAuth();

  const { getBackgroundGradient } = useTheme();

  if (!token) {
    return <AuthModal />;
  }

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-500 ${getBackgroundGradient()}`}>
      
      {/* Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'dashboard' && (
          <DashboardPage setActivePage={setActivePage} onOpenUpload={() => setUploadModalOpen(true)} />
        )}
        {activePage === 'wardrobe' && (
          <WardrobePage onOpenUpload={() => setUploadModalOpen(true)} />
        )}
        {activePage === 'generator' && (
          <OutfitGeneratorPage />
        )}
        {activePage === 'skintone' && (
          <SkinTonePage />
        )}
        {activePage === 'scheduler' && (
          <SchedulerPage />
        )}
        {activePage === 'analytics' && (
          <AnalyticsPage />
        )}
        {activePage === 'tryon' && (
          <TryOnPage />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onItemUploaded={() => {
          if (activePage === 'wardrobe') window.location.reload();
        }}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
