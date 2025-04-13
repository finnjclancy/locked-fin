'use client';

import Link from 'next/link';

export default function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-black">My Diary</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button 
                  onClick={() => scrollToSection('entries-section')}
                  className="text-black hover:text-blue-700 transition-colors font-medium bg-transparent border-none cursor-pointer"
                >
                  Entries
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('new-entry')}
                  className="text-black hover:text-blue-700 transition-colors font-medium bg-transparent border-none cursor-pointer"
                >
                  New Entry
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 