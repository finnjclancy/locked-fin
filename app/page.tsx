'use client';

import { useState } from 'react';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEntryAdded = () => {
    // Trigger a refresh of the entry list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">My Diary</h1>
          <p className="mt-2 text-gray-600">Record and share your thoughts</p>
        </header>

        <div id="new-entry" className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">New Entry</h2>
          <EntryForm onEntryAdded={handleEntryAdded} />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Entries</h2>
            {refreshTrigger > 0 && (
              <span className="text-green-500 text-sm">Entry added successfully!</span>
            )}
          </div>
          <EntryList key={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
