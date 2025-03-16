// apps/frontend/src/features/tdp-lg/pages/BidStatusUpdates.tsx
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import io, { Socket } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import {initSocket, getSocket} from '../../../utils/socket';
// Optional interface for updated bids
interface UpdatedBid {
  bid_id?: string;
  bid_status?: string;
  [key: string]: any; // fallback for any other fields
}

// trial
// Interface for notifications
interface Notification {
  id: string;
  message: string;
  createdAt: string;
}
// trial
const BidStatusUpdates: React.FC = () => {
  const [connected, setConnected] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [updates, setUpdates] = useState<UpdatedBid[]>([]);
  const [waitingMessage, setWaitingMessage] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    const token = localStorage.getItem('access_token') || '';
    const socket = initSocket(token);

    socket.on('connect', () => {
      console.log('Connected to socket:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
      setConnected(false);
    });

    socket.on('bidStatusUpdated', (data: { bid: { bid_id: string; bid_status: string } }) => {
      console.log('Received bid status update:', data);
      toast.info(`Bid status updated: ${data.bid.bid_id} => ${data.bid.bid_status}`);
      setUpdates(prev => [...prev, data.bid]);
      setLastUpdateTime(Date.now());
    });

    socket.on('notification', (data: { id: string; message: string }) => {
      console.log('New notification:', data);
      toast.success(data.message);
      setNotifications(prev => [
        { ...data, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('bidStatusUpdated');
      socket.off('notification');
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

{/* trial */}
      <h3>Notifications:</h3>
      {notifications.length === 0 ? (
        <p>No notifications received yet.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li key={notif.id}>
              {notif.message} - <small>{new Date(notif.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

{/* trial */}
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
