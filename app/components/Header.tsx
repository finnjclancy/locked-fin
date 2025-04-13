'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">My Diary</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/#new-entry" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  New Entry
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
} 