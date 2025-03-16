// subscriptions/bidSubscription.ts
import { supabase } from '../utils/supabaseClient'; // adjust the path as needed
import { Server } from 'socket.io';

// This function initializes the subscription and emits events to connected clients via Socket.IO.
export function initSupaBaseSubscription(io: Server) {
  const bidChannel = supabase
    .channel('submitted_bids_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'submitted_bids',
      },
      (payload) => {
        const newBid = payload.new;
        console.log('New row inserted into submitted_bids:', newBid);
        // Emit the bid update event to all connected clients
        io.emit('bidStatusUpdated', { bid: newBid });
      }
    )
    .subscribe();
const tenderChannel = supabase
    .channel('submitted_tenderChannel_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'submitted_tenders',
      },
      (payload) => {
        const newTender = payload.new;
        console.log('New row inserted into submitted_bids:', newTender);
        // Emit the bid update event to all connected clients
        io.emit('subTenderUpdated', { tender: newTender });
      }
    )
    .subscribe();

  return ;
}
