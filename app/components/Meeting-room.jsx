'use client';
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useEffect, useRef, useState } from 'react';

import '@stream-io/video-react-sdk/dist/css/styles.css';

const MeetingRoom = ({ callId, userId, onLeave }) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState(null);
  const [error, setError] = useState(null);

  const joinRef = useRef();
  const leaveRef = useRef();

  const callType = 'default';

  useEffect(() => {
    if (!client || joinRef.current) return;

    joinRef.current = true;
    const init = async () => {
      try {
        const myCall = client.call(callType, callId);
        await myCall.getOrCreate({
          data: {
            created_by: userId,
            members: [{ user_id: userId, role: 'call_member' }],
          },
        });

        await myCall.join();
        await myCall.startClosedCaptions({ language: 'en' });

        myCall.on('call.session_ended', () => {
          console.log('Session ended');
          onLeave?.();
        });

        setCall(myCall);
      } catch (err) {
        setError(err.message);
      }
    };

    init();

    return () => {
      if (call && !leaveRef.current) {
        leaveRef.current = true;
        call.stopClosedCaptions().catch(() => {});
        call.leave().catch(() => {});
      }
    };
  }, [client, callId, userId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Error: {error}
      </div>
    );
  }

  if (!call) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="animate-spin h-16 w-16 border-t-4 border-blue-500 rounded-full" />
        <p className="mt-4 text-lg">Loading meeting</p>
      </div>
    );
  }

  const handleLeaveClick = async () => {
    if (leaveRef.current) {
      onLeave?.();
      return;
    }

    leaveRef.current = true;

    try {
      if (call) {
        await call.stopClosedCaptions().catch(() => {});
        await call.leave().catch(() => {});
      }
    } catch (err) {
      console.log('Error leaving call : ', err);
    } finally {
      onLeave?.();
    }
  };

  return (
    <StreamCall client={client} call={call}>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 w-full">
        <div className=" text-white container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 h-screen">
            <div className="flex flex-col gap-4">
              {/* speaker layout */}
              <div className="flex-1 rounded-xl bg-gray-800 border-gray-700 overflow-hidden shadow-2xl">
                <SpeakerLayout />
              </div>

              {/* call controls */}

              <div className="flex justify-center pb-4 bg-gray-800 rounded-full px-8 py-4 border border-gray-700 shadow-xl w-fit mx-auto">
                <CallControls onLeave={handleLeaveClick} />
              </div>
            </div>
            {/* transcription */}
            <div className="relative px-4 py-2 bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
              <div className=""></div>
              Transcription Placeholder
            </div>
          </div>
        </div>
      </div>
    </StreamCall>
  );
};

export default MeetingRoom;
