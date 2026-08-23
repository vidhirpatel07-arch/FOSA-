import { getSessions, addBooking, getUserId } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('booking-modal');
  const closeModalBtn = document.getElementById('close-modal');
  if(closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
});

let currentBooking = {
  sessionId: null,
  participants: 1,
  details: {},
  price: 1500
};

window.startBooking = async (eventId = null) => {
  currentBooking.sessionId = null;
  currentBooking.participants = 1;
  currentBooking.details = []; // Array of participant objects
  currentBooking.price = 0;
  
  const modal = document.getElementById('booking-modal');
  const flowContainer = document.getElementById('booking-flow');
  
  flowContainer.innerHTML = '<div style="text-align:center; padding: 2rem;">Loading sessions...</div>';
  modal.classList.add('active');
  
  // Fetch latest sessions from API
  const sessions = await getSessions(eventId);
  
  if (sessions.length === 0) {
    flowContainer.innerHTML = '<div style="text-align:center; padding: 2rem;">No sessions available for this event yet. Check back later!</div>';
    return;
  }
  
  flowContainer.innerHTML = generateStep1(sessions);
};

function generateStep1(sessions) {
  let sessionsHtml = sessions.map(session => {
    const isFull = session.booked >= session.capacity;
    return `
      <div class="session-card ${isFull ? 'full' : ''}" onclick="${isFull ? '' : `window.selectSession('${session.id}', ${session.price})`}">
        <div class="session-info">
          <h4 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 5px; color: var(--color-primary-charcoal);">${session.name}</h4>
          <p style="color: var(--color-secondary-taupe); font-size: 0.95rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${session.time}</p>
        </div>
        <div class="session-price">
          ${isFull ? '<span style="color: red; font-weight: 600;">Sold Out</span>' : ''}
        </div>
      </div>
    `;
  }).join('');

  return `
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Select Your Session</h2>
    <p class="text-center mb-md" style="color: var(--color-secondary-taupe);">Choose the experience that fits your schedule.</p>
    
    <div class="session-selection-container mb-lg">
      ${sessionsHtml}
    </div>
  `;
}

window.selectSession = (id, price) => {
  currentBooking.sessionId = id;
  currentBooking.price = price;
  window.goToStep2();
};

window.goToStep2 = () => {
  const flowContainer = document.getElementById('booking-flow');
  
  let participantForms = '';
  for(let i=0; i<currentBooking.participants; i++) {
    const isPrimary = i === 0;
    const p = currentBooking.details[i] || {};
    
    let extraFields = '';
    if (isPrimary) {
      extraFields = `
        <div class="form-group">
          <input type="email" class="form-control" id="p-email-${i}" placeholder="Email Address" required value="${p.email || ''}">
        </div>
        <div class="form-group">
          <input type="tel" class="form-control" id="p-phone-${i}" placeholder="WhatsApp / Phone Number" required value="${p.phone || ''}">
        </div>
      `;
    }
    
    participantForms += `
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal); border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${isPrimary ? 'Primary Contact (Participant 1)' : 'Participant ' + (i+1)}</h4>
        <div class="form-group">
          <input type="text" class="form-control" id="p-name-${i}" placeholder="Full Name" required value="${p.name || ''}">
        </div>
        <div class="form-group">
          <input type="number" class="form-control" id="p-age-${i}" placeholder="Age" min="18" required value="${p.age || ''}">
        </div>
        ${extraFields}
      </div>
    `;
  }

  flowContainer.innerHTML = `
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Participant Details</h2>
    
    <div class="form-group mb-md" style="background: var(--color-primary-cream); padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-primary-beige);">
      <label style="font-weight:600; margin-bottom:10px; display:block; color: var(--color-primary-charcoal);">Number of Participants</label>
      <select class="form-control" id="participant-count" onchange="window.updateTotalStep2()" style="border: 1px solid var(--color-primary-beige);">
        <option value="1" ${currentBooking.participants === 1 ? 'selected' : ''}>1 Person</option>
        <option value="2" ${currentBooking.participants === 2 ? 'selected' : ''}>2 People</option>
        <option value="3" ${currentBooking.participants === 3 ? 'selected' : ''}>3 People</option>
        <option value="4" ${currentBooking.participants === 4 ? 'selected' : ''}>4 People</option>
      </select>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 1rem; border-top: 1px solid var(--color-primary-beige); padding-top: 1rem;">
        <span style="color: var(--color-secondary-taupe); font-weight: 500;">Subtotal</span>
        <span style="font-size:1.2rem; font-family:var(--font-heading); color: var(--color-primary-charcoal);">₹<span id="booking-total-s2">${(currentBooking.price * currentBooking.participants).toLocaleString()}</span></span>
      </div>
    </div>
    
    ${participantForms}
    
    <div style="display:flex; justify-content:space-between; margin-top:var(--spacing-md);">
      <button class="btn btn-outline" onclick="window.startBooking()">Back</button>
      <button class="btn btn-primary" onclick="window.goToStep3()">Continue</button>
    </div>
  `;
};

window.saveStep2Data = () => {
  for(let i=0; i<currentBooking.participants; i++) {
    if(!currentBooking.details[i]) currentBooking.details[i] = {};
    const n = document.getElementById(`p-name-${i}`);
    if(n) currentBooking.details[i].name = n.value;
    
    const a = document.getElementById(`p-age-${i}`);
    if(a) currentBooking.details[i].age = a.value;
    
    if (i === 0) {
      const e = document.getElementById(`p-email-${i}`);
      if(e) currentBooking.details[i].email = e.value;
      const ph = document.getElementById(`p-phone-${i}`);
      if(ph) currentBooking.details[i].phone = ph.value;
    }
  }
};

window.updateTotalStep2 = () => {
  window.saveStep2Data();
  const count = parseInt(document.getElementById('participant-count').value);
  currentBooking.participants = count;
  window.goToStep2();
};

window.goToStep3 = () => {
  window.saveStep2Data();
  
  // Validation
  for(let i=0; i<currentBooking.participants; i++) {
    const d = currentBooking.details[i];
    if (!d.name || !d.age) {
       alert(`Please fill name and age for Participant ${i+1}.`);
       return;
    }
    if (i === 0 && (!d.email || !d.phone)) {
       alert("Please fill email and phone for the Primary Contact.");
       return;
    }
  }
  
  const flowContainer = document.getElementById('booking-flow');
  
  let experienceForms = '';
  for(let i=0; i<currentBooking.participants; i++) {
    const d = currentBooking.details[i];
    experienceForms += `
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal); border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${d.name}'s Experience</h4>
        
        <div class="form-group">
          <label style="display:block; font-size:0.9rem; margin-bottom:5px;">Pilates Experience</label>
          <select class="form-control" id="p-pilates-${i}">
            <option value="Beginner" ${d.pilates === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Some Experience" ${d.pilates === 'Some Experience' ? 'selected' : ''}>Some Experience</option>
            <option value="Experienced" ${d.pilates === 'Experienced' ? 'selected' : ''}>Experienced</option>
          </select>
        </div>
        
        <div class="form-group">
          <label style="display:block; font-size:0.9rem; margin-bottom:5px;">Horse Riding Experience</label>
          <select class="form-control" id="p-horse-${i}">
            <option value="Beginner" ${d.horse === 'Beginner' ? 'selected' : ''}>Beginner</option>
            <option value="Never Ridden" ${d.horse === 'Never Ridden' ? 'selected' : ''}>Never Ridden</option>
            <option value="Some Experience" ${d.horse === 'Some Experience' ? 'selected' : ''}>Some Experience</option>
            <option value="Experienced" ${d.horse === 'Experienced' ? 'selected' : ''}>Experienced</option>
          </select>
        </div>
        
        <div class="form-group" style="margin-bottom:0;">
          <textarea class="form-control" id="p-medical-${i}" rows="2" placeholder="Relevant allergies / physical considerations">${d.medical || ''}</textarea>
        </div>
      </div>
    `;
  }
  
  const p = currentBooking.details[0];
  const emergencyForm = `
    <div style="margin-bottom: 2rem; padding: 1.5rem; background: var(--color-primary-cream); border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
      <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal);">Group Emergency Contact</h4>
      <div class="form-group">
        <input type="text" class="form-control" id="b-em-name" placeholder="Emergency Contact Name" value="${p.emName || ''}" required>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <input type="tel" class="form-control" id="b-em-phone" placeholder="Emergency Contact Number" value="${p.emPhone || ''}" required>
      </div>
    </div>
  `;

  flowContainer.innerHTML = `
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Experience & Safety</h2>
    
    ${experienceForms}
    ${emergencyForm}
    
    <div style="display:flex; justify-content:space-between; margin-top:var(--spacing-md);">
      <button class="btn btn-outline" onclick="window.goToStep2()">Back</button>
      <button class="btn btn-primary" onclick="window.goToStep4()">Proceed to Payment</button>
    </div>
  `;
};

window.goToStep4 = () => {
  // Save step 3 details
  for(let i=0; i<currentBooking.participants; i++) {
    currentBooking.details[i].pilates = document.getElementById(`p-pilates-${i}`).value;
    currentBooking.details[i].horse = document.getElementById(`p-horse-${i}`).value;
    currentBooking.details[i].medical = document.getElementById(`p-medical-${i}`).value;
  }
  currentBooking.details[0].emName = document.getElementById('b-em-name').value;
  currentBooking.details[0].emPhone = document.getElementById('b-em-phone').value;

  if (!currentBooking.details[0].emName || !currentBooking.details[0].emPhone) {
    alert("Please provide an emergency contact.");
    return;
  }

  const total = currentBooking.price * currentBooking.participants;
  
  const flowContainer = document.getElementById('booking-flow');
  flowContainer.innerHTML = `
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Secure Payment</h2>
    
    <div class="payment-premium-box mb-md">
      <div class="payment-summary">
        <p class="summary-label">Total Amount to Pay</p>
        <h3 class="summary-total">₹${total.toLocaleString()}</h3>
        <p class="summary-sub">For ${currentBooking.participants} participant${currentBooking.participants > 1 ? 's' : ''}</p>
      </div>
      <div class="payment-qr">
        <p class="qr-title">Scan & Pay via UPI</p>
        <img src="/images/qr_code.png" alt="PhonePe QR Code" class="qr-img" />
        <p class="qr-instruction">Use PhonePe, GPay, or Paytm</p>
      </div>
    </div>

    <div class="form-group upload-group">
      <label class="upload-label">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom: 10px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        <br/>
        <strong>Upload Payment Screenshot</strong>
        <span style="display:block; font-size:0.8rem; font-weight:normal; margin-top:5px; color:var(--color-secondary-taupe);">Supported formats: JPG, PNG</span>
        <input type="file" id="b-receipt" accept="image/*" class="file-input" required>
      </label>
      <div id="file-name-display" style="text-align: center; font-size: 0.9rem; margin-top: 10px; color: var(--color-accent-gold); font-weight: 500;"></div>
    </div>
    
    <div class="terms-box mb-md">
      <div style="display:flex; align-items:flex-start; gap:12px;">
        <input type="checkbox" id="b-terms" style="margin-top: 4px; width: 18px; height: 18px; accent-color: var(--color-accent-gold); cursor: pointer;">
        <label for="b-terms" style="font-size:0.95rem; line-height:1.5; color: var(--color-primary-charcoal); cursor: pointer;">
          I acknowledge that this workshop booking is <strong>non-refundable</strong>. I agree to the venue's safety terms and policies.
        </label>
      </div>
    </div>
    
    <div style="display:flex; justify-content:space-between; margin-top: 2rem;">
      <button class="btn btn-outline" onclick="window.goToStep3()">Back</button>
      <button class="btn btn-primary" onclick="window.submitBooking()" id="submit-btn" style="min-width: 150px;">Complete Booking</button>
    </div>
  `;

  // Attach listener to show filename
  const fileInput = document.getElementById('b-receipt');
  fileInput.addEventListener('change', (e) => {
    const display = document.getElementById('file-name-display');
    if (e.target.files.length > 0) {
      display.innerText = "Selected: " + e.target.files[0].name;
    } else {
      display.innerText = "";
    }
  });
};

window.submitBooking = async () => {
  const terms = document.getElementById('b-terms').checked;
  const receiptFile = document.getElementById('b-receipt').files[0];
  
  if (!terms) {
    alert("You must agree to the no-refund policy before proceeding.");
    return;
  }
  if (!receiptFile) {
    alert("Please upload your payment screenshot.");
    return;
  }
  
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.innerText = "Processing...";
  submitBtn.disabled = true;

  const formData = new FormData();
  formData.append('sessionId', currentBooking.sessionId);
  formData.append('participants', currentBooking.participants);
  formData.append('details', JSON.stringify(currentBooking.details.slice(0, currentBooking.participants)));
  formData.append('userId', getUserId());
  formData.append('receipt', receiptFile);
  
  try {
    const res = await addBooking(formData);
    
    if (res.success) {
      const flowContainer = document.getElementById('booking-flow');
      flowContainer.innerHTML = `
        <div style="text-align:center; padding: var(--spacing-lg) 0;">
          <div style="font-size:4rem; color:var(--color-accent-gold); margin-bottom:var(--spacing-sm);">âœ“</div>
          <h2 class="mb-sm">Registration Submitted</h2>
          <p class="mb-md" style="font-size:1.1rem; color:var(--color-secondary-taupe);">Your payment is pending review.</p>
          
          <div style="background:var(--color-primary-cream); padding:var(--spacing-md); border-radius:var(--radius-sm); text-align:left; max-width:400px; margin:0 auto var(--spacing-md);">
            <p><strong>Booking ID:</strong> ${res.bookingId}</p>
            <p class="mt-md" style="font-size:0.9rem;">Once the admin verifies your payment, you will receive a confirmation message in the <strong>Notifications</strong> tab (accessible from the top right menu), as well as on your registered WhatsApp number.</p>
          </div>
          
          <button class="btn btn-primary" onclick="document.getElementById('booking-modal').classList.remove('active')">Return to Website</button>
        </div>
      `;
    } else {
      alert("Error submitting booking: " + (res.error || "Unknown error"));
      submitBtn.innerText = "Submit Booking";
      submitBtn.disabled = false;
    }
  } catch(e) {
    alert("Network error.");
    submitBtn.innerText = "Submit Booking";
    submitBtn.disabled = false;
  }
};

