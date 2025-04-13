'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  updatedAt?: string;
}

export default function EntryList() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load diary entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Refresh the entries after deletion
      fetchEntries();
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading entries...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-10">No diary entries yet.</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <Link href={`/entry/${entry.id}`}>
              <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">{entry.title}</h2>
            </Link>
            <button
              onClick={(e) => handleDelete(entry.id, e)}
              disabled={deletingId === entry.id}
              className="text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
            >
              {deletingId === entry.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {new Date(entry.date).toLocaleDateString()}
            {entry.updatedAt && (
              <span className="ml-2">(Updated)</span>
            )}
          </div>
          <div className="prose line-clamp-3 mb-3">
            {entry.content.split('\n')[0]}
          </div>
          <Link 
            href={`/entry/${entry.id}`}
            className="text-blue-500 hover:underline"
          >
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
} 