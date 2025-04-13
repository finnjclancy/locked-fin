'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryEditForm from './EntryEditForm';

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
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
      
      // Reset expanded and editing states if they were for this entry
      if (expandedId === id) {
        setExpandedId(null);
      }
      if (isEditing === id) {
        setIsEditing(null);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Exit edit mode when collapsing
    if (isEditing === id && expandedId === id) {
      setIsEditing(null);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(null);
  };

  const handleEditComplete = () => {
    setIsEditing(null);
    fetchEntries();
  };

  if (loading) {
    return <div className="text-center py-10 text-black">Loading entries...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 font-medium">{error}</div>;
  }

  if (entries.length === 0) {
    return <div className="text-center py-10 text-black">No diary entries yet.</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-2xl">
      {entries.map((entry) => (
        <div 
          key={entry.id} 
          className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 
              onClick={() => toggleExpand(entry.id)}
              className="text-xl font-semibold text-black hover:text-blue-700 transition-colors cursor-pointer"
            >
              {entry.title}
            </h2>
            <div className="flex space-x-2">
              {expandedId === entry.id && isEditing !== entry.id && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(entry.id);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 text-sm font-medium"
                >
                  Edit
                </button>
              )}
              <button
                onClick={(e) => handleDelete(entry.id, e)}
                disabled={deletingId === entry.id}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {deletingId === entry.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-black mb-4">
            {new Date(entry.date).toLocaleDateString()}
            {entry.updatedAt && (
              <span className="ml-2 font-medium">(Updated)</span>
            )}
          </div>
          
          {isEditing === entry.id ? (
            <EntryEditForm
              entryId={entry.id}
              initialTitle={entry.title}
              initialContent={entry.content}
              onCancel={handleEditCancel}
              onComplete={handleEditComplete}
            />
          ) : (
            <>
              {expandedId === entry.id ? (
                <div className="prose text-black mb-4">
                  {entry.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                  <button
                    onClick={() => setExpandedId(null)}
                    className="text-blue-700 hover:text-blue-900 font-medium mt-2"
                  >
                    Collapse
                  </button>
                </div>
              ) : (
                <div>
                  <div className="prose text-black line-clamp-3 mb-3">
                    {entry.content.split('\n')[0]}
                  </div>
                  <button 
                    onClick={() => toggleExpand(entry.id)}
                    className="text-blue-700 hover:text-blue-900 font-medium hover:underline"
                  >
                    Read more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
} 