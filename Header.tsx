import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Menu, User, Settings, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#11131e] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 z-10 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search operators, vehicles..." 
            className="pl-9 pr-4 py-2 w-64 lg:w-80 bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
        
        <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-[#11131e]"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-300">Admin</span>
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#11131e] rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden z-20">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-900 dark:text-white font-medium">Administrator</p>
                <p className="text-xs text-slate-500 truncate">admin@alsundas.com</p>
              </div>
              <div className="p-1">
                <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full text-left" onClick={() => setUserMenuOpen(false)}>
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
                <Link to="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors w-full text-left" onClick={() => setUserMenuOpen(false)}>
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-1"></div>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors w-full text-left" onClick={() => setUserMenuOpen(false)}>
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
