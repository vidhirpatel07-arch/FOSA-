import { login, getSessions, getAdminBookings, updateCapacity, approveBooking, deleteBooking, getAdminConfig, updateAdminConfig, getEvents, saveEvent, deleteEvent, addSession, deleteSession } from './store.js';

let authToken = localStorage.getItem('adminToken');

document.addEventListener('DOMContentLoaded', () => {
  if (authToken) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    renderDashboard();
  } else {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
  }
});

window.loginAdmin = async () => {
  const email = document.getElementById('admin-email').value;
  const pass = document.getElementById('admin-password').value;
  
  try {
    const res = await login(email, pass);
    if (res.success) {
      authToken = res.token;
      localStorage.setItem('adminToken', authToken);
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('admin-dashboard').style.display = 'block';
      renderDashboard();
    } else {
      alert(res.error || 'Login failed');
    }
  } catch (e) {
    alert('Network error');
  }
};

window.logoutAdmin = () => {
  authToken = null;
  localStorage.removeItem('adminToken');
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('admin-dashboard').style.display = 'none';
};

window.downloadBackup = async () => {
  try {
    const res = await fetch('/api/admin/backup', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error('Failed to download backup');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fosa_backup_${new Date().toISOString().split('T')[0]}.sqlite`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch(e) {
    alert('Backup failed: ' + e.message);
  }
};

window.downloadBookingsCSV = async () => {
  try {
    const res = await fetch('/api/admin/export-bookings', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (!res.ok) throw new Error('Failed to download CSV');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FOSA_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch(e) {
    alert('CSV Export failed: ' + e.message);
  }
};

window.switchTab = (tabId) => {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(`tab-${tabId}`).classList.add('active');
  document.getElementById(`btn-${tabId}`).classList.add('active');
  
  if(tabId === 'hero') renderHeroTab();
  if(tabId === 'events') renderEventsTab();
};

async function renderDashboard() {
  await renderBookings();
  
  if (!window.dashboardPoller) {
    window.dashboardPoller = setInterval(() => {
      const tab = document.getElementById('tab-bookings');
      if (tab && tab.classList.contains('active')) {
        renderBookings();
      }
    }, 10000);
  }
}

async function renderBookings() {
  try {
    const [sessions, bookings] = await Promise.all([getSessions(), getAdminBookings(authToken)]);
    const bookingsContainer = document.getElementById('admin-bookings');
    bookingsContainer.innerHTML = '';
    
    if (bookings.length === 0) {
      bookingsContainer.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No bookings yet.</td></tr>';
      return;
    }
    
    bookings.forEach(booking => {
      const session = sessions.find(s => s.id === booking.sessionId);
      const price = session ? session.price : 0;
      const total = price * booking.participants; // Note: if discounted price exists, logic needs expansion
      
      const isPending = booking.status === 'Pending Approval';
      const badgeClass = isPending ? 'badge-pending' : 'badge-confirmed';
      
      const detailsArray = Array.isArray(booking.details) ? booking.details : [booking.details];
      const primary = detailsArray[0] || {};
      
      let actions = '';
      if (isPending) {
        actions = `<button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="window.approve('${booking.id}')">Approve</button>`;
      } else {
        const ticketUrl = `${window.location.origin}/receipt.html?id=${booking.id}`;
        const waText = encodeURIComponent(`Hi ${primary.name}, your booking (${booking.id}) is confirmed! Here is your entry ticket: ${ticketUrl}`);
        actions = `
          <div style="display:flex; flex-direction:column; gap:5px;">
            <div>
              <a href="https://wa.me/91${primary.phone}?text=${waText}" target="_blank" class="receipt-link" style="font-size:0.8rem; margin-right:10px;">WhatsApp</a>
              <a href="mailto:${primary.email}?subject=Booking Confirmed&body=${waText}" class="receipt-link" style="font-size:0.8rem;">Email</a>
            </div>
            <a href="${ticketUrl}" target="_blank" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; text-align:center;">View Ticket</a>
          </div>
        `;
      }
      
      actions += `<div style="margin-top: 8px;"><button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: #ef4444; border-color: #ef4444; width: 100%;" onclick="if(confirm('Are you sure you want to permanently remove this booking?')) window.removeBooking('${booking.id}')">Remove</button></div>`;

      
      let receiptHtml = '';
      if (booking.receiptUrl) {
        receiptHtml = `<br><span class="receipt-link" onclick="window.viewReceipt('${booking.receiptUrl}')" style="font-size:0.8rem;">Payment Screenshot</span>`;
      }
      
      let participantsHtml = `<div style="font-weight:600;">${primary.name}</div>
                              <div style="color:#64748b; font-size:0.85rem;">${primary.phone} | ${primary.email}</div>
                              <div style="color:#64748b; font-size:0.8rem; margin-top:4px;">Age: ${primary.age} | Pil: ${primary.pilates} | Hor: ${primary.horse}</div>`;
      
      if (booking.participants > 1 && detailsArray.length > 1) {
        participantsHtml += `<div style="margin-top: 8px; font-size: 0.85rem; padding-top: 8px; border-top: 1px dashed #e2e8f0;"><strong>Additional:</strong><ul style="margin: 4px 0 0 15px; padding:0;">`;
        const limit = Math.min(booking.participants, detailsArray.length);
        for(let i=1; i<limit; i++) {
          const p = detailsArray[i];
          participantsHtml += `<li>${p.name || 'N/A'} (Age: ${p.age || '-'}) - Pil: ${p.pilates || '-'}, Hor: ${p.horse || '-'}</li>`;
        }
        participantsHtml += `</ul></div>`;
      }
      
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="vertical-align: top;"><strong>${booking.id}</strong>${receiptHtml}</td>
        <td style="vertical-align: top;">${participantsHtml}</td>
        <td style="vertical-align: top;">
          <div>${session ? session.name : booking.sessionId}</div>
          <div style="color:#64748b; font-size:0.85rem;">${booking.participants} persons | ₹${total.toLocaleString()}</div>
        </td>
        <td style="vertical-align: top;"><span class="badge ${badgeClass}">${booking.status}</span></td>
        <td style="vertical-align: top;">${actions}</td>
      `;
      bookingsContainer.appendChild(tr);
    });
  } catch (e) {
    if(e.message && e.message.includes('401')) window.logoutAdmin();
  }
}

window.approve = async (bookingId) => {
  if(!confirm(`Approve booking ${bookingId}?`)) return;
  const res = await approveBooking(bookingId, authToken);
  if(res.success) renderBookings();
  else alert(res.error);
};

window.removeBooking = async (bookingId) => {
  const res = await deleteBooking(bookingId, authToken);
  if(res.success) renderBookings();
  else alert(res.error || 'Failed to remove booking');
};

window.viewReceipt = (url) => {
  document.getElementById('receipt-img').src = url;
  document.getElementById('receipt-modal').classList.add('active');
};

window.renderEventSessions = async (eventId) => {
  const sessions = await getSessions(eventId);
  const container = document.getElementById('editor-sessions-list');
  container.innerHTML = '';
  
  if (sessions.length === 0) {
    container.innerHTML = '<div style="color:#64748b; font-size: 0.9rem;">No sessions created yet.</div>';
    return;
  }
  
  sessions.forEach(session => {
    const div = document.createElement('div');
    div.style.padding = '1rem';
    div.style.border = '1px solid #e2e8f0';
    div.style.borderRadius = '8px';
    div.style.position = 'relative';
    div.innerHTML = `
      <h4 style="margin-bottom:0.3rem; font-size:1rem;">${session.name} <span style="color:#64748b; font-size:0.85rem;">(${session.time})</span></h4>
      <p style="margin: 0.3rem 0; font-size: 0.9rem;">Spots Booked: <strong style="font-size:1.1rem;">${session.booked}</strong> / ${session.capacity}</p>
      <div style="display:flex; align-items:center; gap:0.5rem; margin-top:0.5rem;">
        <label style="font-size:0.85rem;">Capacity:</label>
        <input type="number" id="cap-${session.id}" value="${session.capacity}" style="width:60px; padding:0.3rem; border:1px solid #cbd5e1; border-radius:4px; font-size: 0.85rem;">
        <button class="btn btn-primary" style="padding: 0.3rem 0.6rem; font-size:0.8rem;" onclick="window.updateCap('${session.id}')">Save</button>
      </div>
      <button onclick="window.deleteSessionRecord('${session.id}')" style="position: absolute; top: 0.5rem; right: 0.5rem; background: none; border: none; color: red; font-size: 1.2rem; cursor: pointer;">&times;</button>
    `;
    container.appendChild(div);
  });
};

window.createSession = async () => {
  const eventId = document.getElementById('edit-event-id').value;
  const name = document.getElementById('new-session-name').value;
  const time = document.getElementById('new-session-time').value;
  const capacity = document.getElementById('new-session-capacity').value;
  const price = document.getElementById('new-session-price').value;
  
  if (!eventId || !name || !time || !capacity || !price) {
    alert("Please fill all fields.");
    return;
  }
  
  const res = await addSession({ eventId, name, time, capacity, price }, authToken);
  if (res.success) {
    document.getElementById('new-session-name').value = '';
    document.getElementById('new-session-time').value = '';
    document.getElementById('add-session-form').style.display = 'none';
    window.renderEventSessions(eventId);
  } else {
    alert('Failed to create session');
  }
};

window.deleteSessionRecord = async (sessionId) => {
  if (!confirm("Are you sure you want to delete this session?")) return;
  const res = await deleteSession(sessionId, authToken);
  if (res.success) {
    const eventId = document.getElementById('edit-event-id').value;
    window.renderEventSessions(eventId);
  } else {
    alert('Failed to delete session');
  }
};

window.updateCap = async (sessionId) => {
  const newCap = parseInt(document.getElementById(`cap-${sessionId}`).value);
  const res = await updateCapacity(sessionId, newCap, authToken);
  if(res.success) renderSessionsTab();
  else alert('Error');
};

async function renderEventsTab() {
  const events = await getEvents();
  const container = document.getElementById('admin-events-list');
  container.innerHTML = '';
  
  events.forEach(evt => {
    container.innerHTML += `
      <div style="padding: 1.5rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 1rem;">
        <h4 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${evt.title}</h4>
        <p style="color: #64748b; font-size: 0.9rem;">Date: ${evt.date}</p>
        <p style="font-size: 0.95rem; margin-top: 0.5rem;">${evt.description}</p>
        <div style="margin-top: 1rem;">
          <button class="btn btn-outline" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;" onclick='window.openEventEditor(${JSON.stringify(evt).replace(/'/g, "&#39;")})'>Edit Event</button>
        </div>
      </div>
    `;
  });
}

let heroImagesCache = [];
async function renderHeroTab() {
  const config = await getAdminConfig(authToken);
  heroImagesCache = config.hero_images || [];
  
  const container = document.getElementById('admin-hero-images');
  container.innerHTML = '';
  
  heroImagesCache.forEach((imgUrl, index) => {
    container.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 4px;">
        <div style="display:flex; align-items:center; gap: 1rem;">
          <img src="${imgUrl}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 4px;">
          <span style="font-size: 0.9rem;">${imgUrl}</span>
        </div>
        <button class="btn btn-outline" style="color: red; border-color: red; padding: 0.3rem 0.6rem;" onclick="window.removeHeroImage(${index})">Remove</button>
      </div>
    `;
  });
}

window.addHeroImage = async () => {
  const url = document.getElementById('new-hero-url').value;
  if(!url) return;
  heroImagesCache.push(url);
  const res = await updateAdminConfig('hero_images', heroImagesCache, authToken);
  if(res.success) {
    document.getElementById('new-hero-url').value = '';
    renderHeroTab();
  } else alert('Error adding image');
};

window.removeHeroImage = async (index) => {
  heroImagesCache.splice(index, 1);
  const res = await updateAdminConfig('hero_images', heroImagesCache, authToken);
  if(res.success) renderHeroTab();
  else alert('Error removing image');
};

// --- EVENT EDITOR LOGIC ---
let editEventData = {
  id: '', title: '', description: '', date: '', hero_image: '',
  price: '', discount_price: '', session_text: '', location_text: '', location_link: '',
  tags: [], timeline: [], faqs: [], gallery: []
};

window.openEventEditor = (evt = null) => {
  editEventData = evt ? JSON.parse(JSON.stringify(evt)) : {
    id: '', title: '', description: '', date: '', hero_image: '',
    price: '', discount_price: '', session_text: '', location_text: '', location_link: '',
    tags: [], timeline: [], faqs: [], gallery: []
  };
  
  document.getElementById('editor-title').innerText = evt ? 'Edit Event' : 'Add Event';
  document.getElementById('btn-delete-event').style.display = evt ? 'block' : 'none';
  
  document.getElementById('edit-event-id').value = editEventData.id;
  document.getElementById('edit-title').value = editEventData.title;
  document.getElementById('edit-date').value = editEventData.date;
  document.getElementById('edit-desc').value = editEventData.description;
  document.getElementById('edit-hero').value = editEventData.hero_image;
  
  document.getElementById('edit-price').value = editEventData.price || '';
  document.getElementById('edit-discount-price').value = editEventData.discount_price || '';
  document.getElementById('edit-session-text').value = editEventData.session_text || '';
  document.getElementById('edit-loc-text').value = editEventData.location_text || '';
  document.getElementById('edit-loc-link').value = editEventData.location_link || '';
  
  if(!editEventData.tags) editEventData.tags = [];
  if(!editEventData.timeline) editEventData.timeline = [];
  if(!editEventData.faqs) editEventData.faqs = [];
  if(!editEventData.gallery) editEventData.gallery = [];
  
  if (evt) {
    document.getElementById('event-sessions-section').style.display = 'block';
    window.renderEventSessions(evt.id);
  } else {
    document.getElementById('event-sessions-section').style.display = 'none';
  }
  
  renderEditorArrays();
  document.getElementById('event-editor-modal').classList.add('active');
};

function renderEditorArrays() {
  // Tags
  document.getElementById('edit-tags-container').innerHTML = editEventData.tags.map((t, i) => `
    <div style="background:#e2e8f0; padding:0.2rem 0.6rem; border-radius:16px; font-size:0.8rem; display:flex; gap:5px; align-items:center;">
      ${t} <span style="cursor:pointer; color:red; font-weight:bold;" onclick="window.removeEditorTag(${i})">&times;</span>
    </div>
  `).join('');
  
  // Timeline
  document.getElementById('edit-timeline-container').innerHTML = editEventData.timeline.map((t, i) => `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">
      <div><strong>${t.time}:</strong> ${t.desc}</div>
      <button class="btn btn-outline" style="color:red; border-color:red; padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.removeEditorTimeline(${i})">Remove</button>
    </div>
  `).join('');
  
  // FAQs
  document.getElementById('edit-faqs-container').innerHTML = editEventData.faqs.map((f, i) => `
    <div style="border-bottom:1px solid #e2e8f0; padding-bottom:5px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <strong>Q: ${f.q}</strong>
        <button class="btn btn-outline" style="color:red; border-color:red; padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.removeEditorFaq(${i})">Remove</button>
      </div>
      <div style="font-size:0.9rem; color:#64748b;">A: ${f.a}</div>
    </div>
  `).join('');
  
  // Gallery
  document.getElementById('edit-gallery-container').innerHTML = editEventData.gallery.map((g, i) => `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">
      <div style="display:flex; gap:10px; align-items:center;">
        <img src="${g}" style="width:40px; height:30px; object-fit:cover; border-radius:4px;">
        <span style="font-size:0.85rem; color:#64748b;">${g}</span>
      </div>
      <button class="btn btn-outline" style="color:red; border-color:red; padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.removeEditorGallery(${i})">Remove</button>
    </div>
  `).join('');
}

// Add/Remove Helpers
window.addEditorTag = () => {
  const v = document.getElementById('new-tag').value;
  if(v) { editEventData.tags.push(v); document.getElementById('new-tag').value = ''; renderEditorArrays(); }
};
window.removeEditorTag = (i) => { editEventData.tags.splice(i, 1); renderEditorArrays(); };

window.addEditorTimeline = () => {
  const t = document.getElementById('new-tl-time').value;
  const d = document.getElementById('new-tl-desc').value;
  if(t && d) { editEventData.timeline.push({time:t, desc:d}); document.getElementById('new-tl-time').value=''; document.getElementById('new-tl-desc').value=''; renderEditorArrays(); }
};
window.removeEditorTimeline = (i) => { editEventData.timeline.splice(i, 1); renderEditorArrays(); };

window.addEditorFaq = () => {
  const q = document.getElementById('new-faq-q').value;
  const a = document.getElementById('new-faq-a').value;
  if(q && a) { editEventData.faqs.push({q, a}); document.getElementById('new-faq-q').value=''; document.getElementById('new-faq-a').value=''; renderEditorArrays(); }
};
window.removeEditorFaq = (i) => { editEventData.faqs.splice(i, 1); renderEditorArrays(); };

window.addEditorGallery = () => {
  const g = document.getElementById('new-gallery-url').value;
  if(g) { editEventData.gallery.push(g); document.getElementById('new-gallery-url').value=''; renderEditorArrays(); }
};
window.removeEditorGallery = (i) => { editEventData.gallery.splice(i, 1); renderEditorArrays(); };

// Save & Delete
window.saveCurrentEvent = async () => {
  editEventData.title = document.getElementById('edit-title').value;
  editEventData.date = document.getElementById('edit-date').value;
  editEventData.description = document.getElementById('edit-desc').value;
  editEventData.hero_image = document.getElementById('edit-hero').value;
  
  editEventData.price = document.getElementById('edit-price').value;
  editEventData.discount_price = document.getElementById('edit-discount-price').value;
  editEventData.session_text = document.getElementById('edit-session-text').value;
  editEventData.location_text = document.getElementById('edit-loc-text').value;
  editEventData.location_link = document.getElementById('edit-loc-link').value;
  
  if(!editEventData.title || !editEventData.date) return alert('Title and date required');
  
  const res = await saveEvent(editEventData, authToken);
  if(res.success) {
    document.getElementById('event-editor-modal').classList.remove('active');
    renderEventsTab();
  } else {
    alert(res.error || 'Error saving event');
  }
};

window.deleteCurrentEvent = async () => {
  if(!confirm('Are you sure you want to completely delete this event?')) return;
  const res = await deleteEvent(editEventData.id, authToken);
  if(res.success) {
    document.getElementById('event-editor-modal').classList.remove('active');
    renderEventsTab();
  } else {
    alert(res.error || 'Error deleting event');
  }
};

