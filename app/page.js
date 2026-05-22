'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    const name = username.trim() === '' ? 'Guest' : username.trim();
    const meetingId = process.env.NEXT_PUBLIC_CALL_ID;
    router.push(`/meeting/${meetingId}?name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="bg-grey-800/60 rounded-2xl p-8 border border-gray-700 w-80 shadow-2xl">
        <header className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Enter your Name</h2>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-3 w-full rounded-lg bg-gray-700/80 border-gray-600 text-white"
            placeholder="Enter Name..."
          />
          <button
            onClick={handleJoin}
            className="mt-5 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium cursor-pointer"
          >
            Join Meeting
          </button>
        </header>
      </div>
    </div>
  );
}
