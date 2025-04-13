'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EntryEditForm from '../../components/EntryEditForm';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  updatedAt?: string;
}

export default function EntryPage({ params }: { params: { id: string } }) {
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/entries/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Entry not found');
          }
          throw new Error('Failed to fetch entry');
        }
        const data = await response.json();
        setEntry(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading entry...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="mb-4">{error}</p>
          <Link 
            href="/"
            className="text-blue-500 hover:underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Entry not found</p>
          <Link 
            href="/"
            className="text-blue-500 hover:underline"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/"
            className="text-blue-500 hover:underline flex items-center"
          >
            ← Back to all entries
          </Link>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-8">
          {isEditing ? (
            <EntryEditForm 
              entryId={entry.id}
              initialTitle={entry.title}
              initialContent={entry.content}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">{entry.title}</h1>
              <div className="text-sm text-gray-500 mb-6">
                {new Date(entry.date).toLocaleDateString()} at{' '}
                {new Date(entry.date).toLocaleTimeString()}
                {entry.updatedAt && (
                  <span className="ml-2">
                    (Updated: {new Date(entry.updatedAt).toLocaleDateString()})
                  </span>
                )}
              </div>
              
              <div className="prose max-w-none">
                {entry.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 