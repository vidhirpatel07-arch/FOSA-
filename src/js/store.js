// api.js replacing store.js
const API_URL = '/api';

export const getSessions = async (eventId = null) => {
  const url = eventId ? `${API_URL}/sessions?eventId=${eventId}` : `${API_URL}/sessions`;
  const res = await fetch(url);
  return await res.json();
};

export const addSession = async (sessionData, token) => {
  const res = await fetch(`${API_URL}/admin/sessions`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(sessionData)
  });
  return await res.json();
};

export const deleteSession = async (sessionId, token) => {
  const res = await fetch(`${API_URL}/admin/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};

export const getEvents = async () => {
  const res = await fetch(`${API_URL}/events`);
  return await res.json();
};

export const saveEvent = async (eventData, token) => {
  const res = await fetch(`${API_URL}/admin/events`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eventData)
  });
  return await res.json();
};

export const deleteEvent = async (eventId, token) => {
  const res = await fetch(`${API_URL}/admin/events/${eventId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};

export const getConfig = async () => {
  const res = await fetch(`${API_URL}/config`);
  return await res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return await res.json();
};

export const addBooking = async (formData) => {
  const res = await fetch(`${API_URL}/book`, {
    method: 'POST',
    body: formData
  });
  return await res.json();
};

export const getAdminBookings = async (token) => {
  const res = await fetch(`${API_URL}/admin/bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};

export const updateCapacity = async (sessionId, capacity, token) => {
  const res = await fetch(`${API_URL}/admin/capacity`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ sessionId, capacity })
  });
  return await res.json();
};

export const approveBooking = async (bookingId, token) => {
  const res = await fetch(`${API_URL}/admin/approve`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ bookingId })
  });
  return await res.json();
};

export const getAdminConfig = async (token) => {
  const res = await fetch(`${API_URL}/admin/config`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await res.json();
};

export const updateAdminConfig = async (key, value, token) => {
  const res = await fetch(`${API_URL}/admin/config`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ key, value })
  });
  return await res.json();
};

export const getTicketDetails = async (bookingId) => {
  const res = await fetch(`${API_URL}/ticket/${bookingId}`);
  if(!res.ok) return null;
  return await res.json();
};

export const getNotifications = async (userId) => {
  const res = await fetch(`${API_URL}/notifications/${userId}`);
  return await res.json();
};

export const markNotificationsRead = async (ids) => {
  const res = await fetch(`${API_URL}/notifications/read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids })
  });
  return await res.json();
};

// Simple anonymous userId for notifications
export const getUserId = () => {
  let uid = localStorage.getItem('fosa_user_id');
  if (!uid) {
    uid = 'USR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    localStorage.setItem('fosa_user_id', uid);
  }
  return uid;
};

