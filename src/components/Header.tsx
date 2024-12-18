import React, { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Menu } from './Menu';
import { GameHistory } from './GameHistory';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setIsMenuOpen(false);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleMenuClick}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <MenuIcon size={24} className="dark:text-white" />
          </button>
          <h1 className="text-xl font-bold dark:text-white">QW Track</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      {isMenuOpen && (
        <Menu
          onClose={handleCloseMenu}
          onShowHistory={handleShowHistory}
        />
      )}

      {showHistory && (
        <GameHistory onClose={handleCloseHistory} />
      )}
    </>
  );
};