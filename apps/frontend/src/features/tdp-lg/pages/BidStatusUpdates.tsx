// apps/frontend/src/features/tdp-lg/pages/BidStatusUpdates.tsx
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';

// Optional interface for updated bids
interface UpdatedBid {
  bid_id?: string;
  bid_status?: string;
  [key: string]: any; // fallback for any other fields
}

const BidStatusUpdates: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [updates, setUpdates] = useState<UpdatedBid[]>([]);
  const [waitingMessage, setWaitingMessage] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);

  // We'll wait 30 seconds before showing "Waiting for latest status update..."
  const WAIT_INTERVAL_MS = 30000;

  useEffect(() => {
    // We set an interval to check if we've received updates in the last 30s
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastUpdateTime > WAIT_INTERVAL_MS) {
        setWaitingMessage('Waiting for the latest status update…');
      } else {
        setWaitingMessage('');
      }
    }, 5000); // check every 5s

    return () => clearInterval(intervalId);
  }, [lastUpdateTime]);

  useEffect(() => {
    // On mount, connect to Socket.IO
    const token = localStorage.getItem('access_token'); 
    // If your Node code requires a Bearer token in the handshake, 
    // you might pass it as a query param or in an auth header 
    // (Socket.IO doesn't natively do headers without extra config).
    
    // Example: pass token as a query param
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
      query: {
        token: token || '',
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
      setConnected(false);
    });

    // Listen for 'bidStatusUpdated' events from the backend
    socket.on('bidStatusUpdated', (data: { bid: UpdatedBid }) => {
      console.log('Received bid status update:', data);
      // Show a toast notification
      toast.info(`Bid status updated: ${data.bid.bid_id} => ${data.bid.bid_status}`);

      // Update local list of updates
      setUpdates(prev => [...prev, data.bid]);
      // Refresh lastUpdateTime so we don't show the waiting message
      setLastUpdateTime(Date.now());
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Bid Status Updates</h2>
      <p>
        Socket Connection Status: {connected ? 'Connected' : 'Not Connected'}
      </p>
      {waitingMessage && (
        <p style={{ color: 'orange' }}>{waitingMessage}</p>
      )}

      <h3>Recent Updates:</h3>
      {updates.length === 0 ? (
        <p>No updates received yet.</p>
      ) : (
        <ul>
          {updates.map((bid, idx) => (
            <li key={idx}>
              <strong>Bid ID:</strong> {bid.bid_id || 'N/A'} |{' '}
              <strong>Status:</strong> {bid.bid_status || 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BidStatusUpdates;
