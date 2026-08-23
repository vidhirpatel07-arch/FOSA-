import { getTicketDetails } from './store.js';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('id');
  
  if (!bookingId) {
    showError();
    return;
  }
  
  const data = await getTicketDetails(bookingId);
  if (!data || !data.booking) {
    showError();
    return;
  }
  
  renderTicket(data);
});

function showError() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
}

function renderTicket(data) {
  const { booking, session, event } = data;
  const pDetails = booking.details;
  
  // Basic info
  document.getElementById('t-booking-id').innerText = booking.id;
  
  if (event) {
    document.getElementById('t-event-name').innerText = event.title;
    document.getElementById('t-date').innerText = event.date;
    document.getElementById('t-location').innerText = event.location_text || 'Force One Sports Academy';
  } else {
    document.getElementById('t-event-name').innerText = 'Unknown Event';
    document.getElementById('t-date').innerText = '--';
    document.getElementById('t-location').innerText = 'Force One Sports Academy';
  }
  
  if (session) {
    document.getElementById('t-session-name').innerText = session.name;
    document.getElementById('t-time').innerText = session.time;
    const finalPrice = session.discountPrice || session.price || 0;
    const total = finalPrice * booking.participants;
    document.getElementById('t-amount').innerText = `₹${total.toLocaleString()}`;
  } else {
    document.getElementById('t-session-name').innerText = booking.sessionId;
    document.getElementById('t-time').innerText = '--';
    document.getElementById('t-amount').innerText = '--';
  }
  
  // Participant Info
  document.getElementById('t-pax').innerText = booking.participants;
  
  if (pDetails && pDetails.length > 0) {
    const primary = pDetails[0];
    document.getElementById('t-name').innerText = primary.name;
    document.getElementById('t-contact').innerText = primary.phone || primary.email || '';
    
    if (pDetails.length > 1) {
      const addList = document.getElementById('t-add-list');
      for (let i = 1; i < pDetails.length; i++) {
        const li = document.createElement('li');
        li.innerText = `${pDetails[i].name} (Age: ${pDetails[i].age})`;
        addList.appendChild(li);
      }
      document.getElementById('t-additional').style.display = 'block';
    }
  }
  
  // Status check
  const statusEl = document.getElementById('t-status');
  if (booking.status.toLowerCase().includes('pending')) {
    statusEl.innerText = 'PENDING';
    statusEl.style.borderColor = '#eab308';
    statusEl.style.color = '#eab308';
  } else if (booking.status.toLowerCase().includes('reject')) {
    statusEl.innerText = 'REJECTED';
    statusEl.style.borderColor = '#ef4444';
    statusEl.style.color = '#ef4444';
  } else {
    statusEl.innerText = 'CONFIRMED';
    statusEl.style.borderColor = '#22c55e';
    statusEl.style.color = '#22c55e';
  }
  
  // Hide loader, show ticket
  document.getElementById('loader').style.display = 'none';
  document.getElementById('ticket-card').style.display = 'block';
  
  // Set real QR Code
  const qrImg = document.getElementById('t-qrcode');
  const ticketUrl = encodeURIComponent(window.location.origin + '/receipt.html?id=' + booking.id);
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketUrl}`;
  qrImg.style.display = 'block';
}

