'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white mt-12 py-6 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-black">
          <p>© {currentYear} My Diary. All rights reserved.</p>
          <p className="mt-2 font-medium">
            Share your thoughts with the world.
          </p>
        </div>
      </div>
    </footer>
  );
} 