import{k as $,f as B,m as E,n as I,g as S,o as L}from"./store-DDWtH5Ds.js";/* empty css              */document.addEventListener("DOMContentLoaded",async()=>{await P();const e={root:null,rootMargin:"0px",threshold:.1},r=new IntersectionObserver((s,i)=>{s.forEach(l=>{l.isIntersecting&&(l.target.classList.add("visible"),i.unobserve(l.target))})},e);document.querySelectorAll(".fade-up").forEach(s=>{r.observe(s)}),document.addEventListener("click",s=>{const i=s.target.closest(".faq-question");if(!i)return;const l=i.closest(".faq-item");if(!l)return;const d=l.classList.contains("active"),g=l.parentElement;if(g&&g.querySelectorAll(".faq-item").forEach(m=>{m.classList.remove("active");const u=m.querySelector("span");u&&(u.textContent="+")}),!d){l.classList.add("active");const m=l.querySelector("span");m&&(m.textContent="-")}});const t=document.getElementById("toggle-details-btn"),o=document.getElementById("workshop-details");t&&o&&t.addEventListener("click",()=>{o.classList.toggle("expanded"),t.innerText=o.classList.contains("expanded")?"Show Less Details":"Know More About Event"}),k(),setInterval(k,5e3);const a=document.getElementById("back-to-top");window.addEventListener("scroll",()=>{window.scrollY>300?a.classList.add("visible"):a.classList.remove("visible")})});async function P(){const[e,r]=await Promise.all([$(),B()]),t=e.hero_images||[],o=document.getElementById("hero-carousel-container");if(o&&t.length>0){let s=t.map((i,l)=>`
      <div class="carousel-card">
        <img src="${i}" alt="Slide ${l+1}" />
      </div>
    `).join("");o.innerHTML=`
      <div class="carousel-track" id="slider-track">
        ${s}
      </div>
      <div class="slider-nav">
        <button class="slider-btn" id="slide-prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="slider-dots" id="slider-dots">
          ${t.map((i,l)=>`<div class="dot ${l===0?"active":""}" data-index="${l}"></div>`).join("")}
        </div>
        <button class="slider-btn" id="slide-next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `,T()}const a=document.getElementById("events-container");if(a){let s=`
      <div style="text-align: center; margin-bottom: 7rem;">
        <h2 style="font-size: 3.5rem; color: var(--color-primary-charcoal); margin-bottom: 0.5rem; font-family: var(--font-heading);">Upcoming Events</h2>
        <div style="width: 80px; height: 2px; background-color: var(--color-accent-gold); margin: 0 auto 1.5rem auto;"></div>
        <p style="color: var(--color-secondary-taupe); max-width: 650px; margin: 0 auto; font-size: 1.15rem; line-height: 1.6;">Discover our specialized workshops combining fitness, focus, and connection with nature.</p>
      </div>
    `;r.forEach(i=>{const l=(i.tags||[]).map(c=>`<span class="wc-tag">${c}</span>`).join(""),d=(i.timeline||[]).map(c=>`<div class="timeline-item"><strong>${c.time}:</strong> ${c.desc}</div>`).join(""),g=(i.faqs||[]).map(c=>`
        <div class="faq-item">
          <div class="faq-question">${c.q} <span>+</span></div>
          <p class="faq-answer">${c.a}</p>
        </div>
      `).join(""),m=(i.gallery||[]).map(c=>`<img src="${c}" alt="Gallery image" />`).join(""),u=i.gallery&&i.gallery.length>0?`
        <h3 class="mb-sm">Gallery</h3>
        <div class="card-gallery mb-md">
          ${m}
        </div>
      `:"";s+=`
      <div class="workshop-card fade-up">
        <div class="wc-header">
          <img src="${i.hero_image||"/images/pilates_2.jpg"}" alt="${i.title}" class="wc-img" />
        </div>
        
        <div class="wc-body" style="text-align: left;">
          <div class="wc-tags" style="margin-bottom: 1.5rem;">
            ${l}
          </div>
          <h2 style="font-size: 2.2rem; color: var(--color-primary-charcoal); margin-bottom: 2.5rem; line-height: 1.2;">${i.title}</h2>

          <div class="wc-stats" style="text-align: left; justify-content: flex-start; gap: 2rem; flex-wrap: wrap; border-bottom: 1px solid #cbd5e1; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div>
              <div class="stat-title">Date</div>
              <div class="stat-val" style="font-size: 1.1rem;">${i.date}</div>
            </div>
            ${i.session_text?`
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Sessions</div>
              <div class="stat-val" style="font-size: 1.1rem;">${i.session_text}</div>
            </div>`:""}
            ${i.price?`
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Price</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${i.discount_price?`<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.9rem; margin-right: 5px;">₹${i.price}</span>₹${i.discount_price}`:`₹${i.price}`}
              </div>
            </div>`:""}
            ${i.location_text?`
            <div style="width: 100%; margin-top: 0.5rem;">
              <div class="stat-title">Location</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${i.location_link?`<a href="${i.location_link}" target="_blank" style="color: var(--color-primary-charcoal); text-decoration: underline; text-underline-offset: 4px;">${i.location_text}</a>`:i.location_text}
              </div>
            </div>`:""}
          </div>
          
          <p class="mb-md" style="color: #475569; font-style: italic; line-height: 1.6; font-size: 1.05rem;">
            "${i.description}"
          </p>

          <div class="wc-actions">
            <button class="btn btn-outline toggle-details-btn">Know More About Event</button>
            <button class="btn btn-primary" onclick="window.startBooking('${i.id}')">Enroll Now</button>
          </div>

          <div class="wc-expandable workshop-details">
            <div style="margin-top: var(--spacing-md); border-top: 1px solid var(--color-primary-beige); padding-top: var(--spacing-sm);">
              <h3 class="mb-sm">Experience Timeline</h3>
              <div class="timeline mb-md">
                ${d}
              </div>
              
              ${u}
              
              <h3 class="mb-sm">FAQ</h3>
              <div class="faq-container mb-md">
                ${g}
              </div>
              <div class="text-center mt-md">
                <button class="btn btn-primary" onclick="window.startBooking('${i.id}')" style="width:100%;">Reserve Your Spot</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `}),a.innerHTML=s,document.querySelectorAll(".toggle-details-btn").forEach((i,l)=>{const d=document.querySelectorAll(".workshop-details")[l];i.addEventListener("click",()=>{d.classList.toggle("expanded"),i.innerText=d.classList.contains("expanded")?"Show Less Details":"Know More About Event"})})}}function T(){const e=document.getElementById("slider-track"),r=document.getElementById("slide-prev"),t=document.getElementById("slide-next"),o=document.querySelectorAll(".slider-dots .dot");let a=Array.from(document.querySelectorAll(".carousel-card"));if(e&&a.length>0){const s=a.length,i=440;let l;for(let y=0;y<2;y++)a.forEach(v=>e.appendChild(v.cloneNode(!0)));const d=Array.from(document.querySelectorAll(".carousel-card"));setTimeout(()=>{e.style.scrollBehavior="auto",e.scrollLeft=s*i,e.style.scrollBehavior="smooth",g()},100);const g=()=>{const y=e.getBoundingClientRect().left+e.clientWidth/2;let v=d[0],f=1/0;d.forEach(p=>{const x=p.getBoundingClientRect().left+p.clientWidth/2,b=Math.abs(y-x);b<f&&(f=b,v=p)}),d.forEach(p=>p.classList.remove("active")),v.classList.add("active");const w=d.indexOf(v)%s;o.forEach(p=>p.classList.remove("active")),o[w]&&o[w].classList.add("active")};e.addEventListener("scroll",()=>{g(),e.scrollLeft<i?(e.style.scrollBehavior="auto",e.scrollLeft+=s*i,e.style.scrollBehavior="smooth"):e.scrollLeft>(d.length-2)*i&&(e.style.scrollBehavior="auto",e.scrollLeft-=s*i,e.style.scrollBehavior="smooth")},{passive:!0});const m=()=>e.scrollBy({left:i,behavior:"smooth"}),u=()=>e.scrollBy({left:-i,behavior:"smooth"});t&&t.addEventListener("click",()=>{m(),h()}),r&&r.addEventListener("click",()=>{u(),h()}),o.forEach((y,v)=>{y.addEventListener("click",()=>{const f=d.findIndex(b=>b.classList.contains("active")),x=(Math.floor(f/s)*s+v-f)*i;e.scrollBy({left:x,behavior:"smooth"}),h()})});const c=()=>{l=setInterval(m,2500)},h=()=>{clearInterval(l),c()};c(),e.addEventListener("mouseenter",()=>clearInterval(l)),e.addEventListener("mouseleave",c),e.addEventListener("touchstart",()=>clearInterval(l),{passive:!0}),e.addEventListener("touchend",c,{passive:!0})}}window.toggleMenu=()=>{document.getElementById("side-menu").classList.toggle("open")};async function k(){const e=E(),r=await I(e),t=document.getElementById("notif-count");if(!t)return;const o=r.filter(a=>!a.isRead);o.length>0?(t.innerText=o.length,t.style.display="flex"):t.style.display="none"}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("booking-modal"),r=document.getElementById("close-modal");r&&r.addEventListener("click",()=>{e.classList.remove("active")})});let n={sessionId:null,participants:1,details:{},price:1500};window.startBooking=async(e=null)=>{n.sessionId=null,n.participants=1,n.details=[],n.price=0;const r=document.getElementById("booking-modal"),t=document.getElementById("booking-flow");t.innerHTML='<div style="text-align:center; padding: 2rem;">Loading sessions...</div>',r.classList.add("active");const o=await S(e);if(o.length===0){t.innerHTML='<div style="text-align:center; padding: 2rem;">No sessions available for this event yet. Check back later!</div>';return}t.innerHTML=C(o)};function C(e){return`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Select Your Session</h2>
    <p class="text-center mb-md" style="color: var(--color-secondary-taupe);">Choose the experience that fits your schedule.</p>
    
    <div class="session-selection-container mb-lg">
      ${e.map(t=>{const o=t.booked>=t.capacity;return`
      <div class="session-card ${o?"full":""}" onclick="${o?"":`window.selectSession('${t.id}', ${t.price})`}">
        <div class="session-info">
          <h4 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 5px; color: var(--color-primary-charcoal);">${t.name}</h4>
          <p style="color: var(--color-secondary-taupe); font-size: 0.95rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${t.time}</p>
        </div>
        <div class="session-price">
          ${o?'<span style="color: red; font-weight: 600;">Sold Out</span>':""}
        </div>
      </div>
    `}).join("")}
    </div>
  `}window.selectSession=(e,r)=>{n.sessionId=e,n.price=r,window.goToStep2()};window.goToStep2=()=>{const e=document.getElementById("booking-flow");let r="";for(let t=0;t<n.participants;t++){const o=t===0,a=n.details[t]||{};let s="";o&&(s=`
        <div class="form-group">
          <input type="email" class="form-control" id="p-email-${t}" placeholder="Email Address" required value="${a.email||""}">
        </div>
        <div class="form-group">
          <input type="tel" class="form-control" id="p-phone-${t}" placeholder="WhatsApp / Phone Number" required value="${a.phone||""}">
        </div>
      `),r+=`
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal); border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${o?"Primary Contact (Participant 1)":"Participant "+(t+1)}</h4>
        <div class="form-group">
          <input type="text" class="form-control" id="p-name-${t}" placeholder="Full Name" required value="${a.name||""}">
        </div>
        <div class="form-group">
          <input type="number" class="form-control" id="p-age-${t}" placeholder="Age" min="18" required value="${a.age||""}">
        </div>
        ${s}
      </div>
    `}e.innerHTML=`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Participant Details</h2>
    
    <div class="form-group mb-md" style="background: var(--color-primary-cream); padding: 1.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-primary-beige);">
      <label style="font-weight:600; margin-bottom:10px; display:block; color: var(--color-primary-charcoal);">Number of Participants</label>
      <select class="form-control" id="participant-count" onchange="window.updateTotalStep2()" style="border: 1px solid var(--color-primary-beige);">
        <option value="1" ${n.participants===1?"selected":""}>1 Person</option>
        <option value="2" ${n.participants===2?"selected":""}>2 People</option>
        <option value="3" ${n.participants===3?"selected":""}>3 People</option>
        <option value="4" ${n.participants===4?"selected":""}>4 People</option>
      </select>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 1rem; border-top: 1px solid var(--color-primary-beige); padding-top: 1rem;">
        <span style="color: var(--color-secondary-taupe); font-weight: 500;">Subtotal</span>
        <span style="font-size:1.2rem; font-family:var(--font-heading); color: var(--color-primary-charcoal);">₹<span id="booking-total-s2">${(n.price*n.participants).toLocaleString()}</span></span>
      </div>
    </div>
    
    ${r}
    
    <div style="display:flex; justify-content:space-between; margin-top:var(--spacing-md);">
      <button class="btn btn-outline" onclick="window.startBooking()">Back</button>
      <button class="btn btn-primary" onclick="window.goToStep3()">Continue</button>
    </div>
  `};window.saveStep2Data=()=>{for(let e=0;e<n.participants;e++){n.details[e]||(n.details[e]={});const r=document.getElementById(`p-name-${e}`);r&&(n.details[e].name=r.value);const t=document.getElementById(`p-age-${e}`);if(t&&(n.details[e].age=t.value),e===0){const o=document.getElementById(`p-email-${e}`);o&&(n.details[e].email=o.value);const a=document.getElementById(`p-phone-${e}`);a&&(n.details[e].phone=a.value)}}};window.updateTotalStep2=()=>{window.saveStep2Data();const e=parseInt(document.getElementById("participant-count").value);n.participants=e,window.goToStep2()};window.goToStep3=()=>{window.saveStep2Data();for(let a=0;a<n.participants;a++){const s=n.details[a];if(!s.name||!s.age){alert(`Please fill name and age for Participant ${a+1}.`);return}if(a===0&&(!s.email||!s.phone)){alert("Please fill email and phone for the Primary Contact.");return}}const e=document.getElementById("booking-flow");let r="";for(let a=0;a<n.participants;a++){const s=n.details[a];r+=`
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal); border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${s.name}'s Experience</h4>
        
        <div class="form-group">
          <label style="display:block; font-size:0.9rem; margin-bottom:5px;">Pilates Experience</label>
          <select class="form-control" id="p-pilates-${a}">
            <option value="Beginner" ${s.pilates==="Beginner"?"selected":""}>Beginner</option>
            <option value="Some Experience" ${s.pilates==="Some Experience"?"selected":""}>Some Experience</option>
            <option value="Experienced" ${s.pilates==="Experienced"?"selected":""}>Experienced</option>
          </select>
        </div>
        
        <div class="form-group">
          <label style="display:block; font-size:0.9rem; margin-bottom:5px;">Horse Riding Experience</label>
          <select class="form-control" id="p-horse-${a}">
            <option value="Beginner" ${s.horse==="Beginner"?"selected":""}>Beginner</option>
            <option value="Never Ridden" ${s.horse==="Never Ridden"?"selected":""}>Never Ridden</option>
            <option value="Some Experience" ${s.horse==="Some Experience"?"selected":""}>Some Experience</option>
            <option value="Experienced" ${s.horse==="Experienced"?"selected":""}>Experienced</option>
          </select>
        </div>
        
        <div class="form-group" style="margin-bottom:0;">
          <textarea class="form-control" id="p-medical-${a}" rows="2" placeholder="Relevant allergies / physical considerations">${s.medical||""}</textarea>
        </div>
      </div>
    `}const t=n.details[0],o=`
    <div style="margin-bottom: 2rem; padding: 1.5rem; background: var(--color-primary-cream); border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
      <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal);">Group Emergency Contact</h4>
      <div class="form-group">
        <input type="text" class="form-control" id="b-em-name" placeholder="Emergency Contact Name" value="${t.emName||""}" required>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <input type="tel" class="form-control" id="b-em-phone" placeholder="Emergency Contact Number" value="${t.emPhone||""}" required>
      </div>
    </div>
  `;e.innerHTML=`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Experience & Safety</h2>
    
    ${r}
    ${o}
    
    <div style="display:flex; justify-content:space-between; margin-top:var(--spacing-md);">
      <button class="btn btn-outline" onclick="window.goToStep2()">Back</button>
      <button class="btn btn-primary" onclick="window.goToStep4()">Proceed to Payment</button>
    </div>
  `};window.goToStep4=()=>{for(let o=0;o<n.participants;o++)n.details[o].pilates=document.getElementById(`p-pilates-${o}`).value,n.details[o].horse=document.getElementById(`p-horse-${o}`).value,n.details[o].medical=document.getElementById(`p-medical-${o}`).value;if(n.details[0].emName=document.getElementById("b-em-name").value,n.details[0].emPhone=document.getElementById("b-em-phone").value,!n.details[0].emName||!n.details[0].emPhone){alert("Please provide an emergency contact.");return}const e=n.price*n.participants,r=document.getElementById("booking-flow");r.innerHTML=`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Secure Payment</h2>
    
    <div class="payment-premium-box mb-md">
      <div class="payment-summary">
        <p class="summary-label">Total Amount to Pay</p>
        <h3 class="summary-total">₹${e.toLocaleString()}</h3>
        <p class="summary-sub">For ${n.participants} participant${n.participants>1?"s":""}</p>
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
  `,document.getElementById("b-receipt").addEventListener("change",o=>{const a=document.getElementById("file-name-display");o.target.files.length>0?a.innerText="Selected: "+o.target.files[0].name:a.innerText=""})};window.submitBooking=async()=>{const e=document.getElementById("b-terms").checked,r=document.getElementById("b-receipt").files[0];if(!e){alert("You must agree to the no-refund policy before proceeding.");return}if(!r){alert("Please upload your payment screenshot.");return}const t=document.getElementById("submit-btn");t.innerText="Processing...",t.disabled=!0;const o=new FormData;o.append("sessionId",n.sessionId),o.append("participants",n.participants),o.append("details",JSON.stringify(n.details.slice(0,n.participants))),o.append("userId",E()),o.append("receipt",r);try{const a=await L(o);if(a.success){const s=document.getElementById("booking-flow");s.innerHTML=`
        <div style="text-align:center; padding: var(--spacing-lg) 0;">
          <div style="margin-bottom:var(--spacing-sm);">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 class="mb-sm">Registration Submitted</h2>
          <p class="mb-md" style="font-size:1.1rem; color:var(--color-secondary-taupe);">Your payment is pending review.</p>
          
          <div style="background:var(--color-primary-cream); padding:var(--spacing-md); border-radius:var(--radius-sm); text-align:left; max-width:400px; margin:0 auto var(--spacing-md);">
            <p><strong>Booking ID:</strong> ${a.bookingId}</p>
            <p class="mt-md" style="font-size:0.9rem;">Once the admin verifies your payment, you will receive a confirmation message in the <strong>Notifications</strong> tab (accessible from the top right menu), as well as on your registered WhatsApp number.</p>
          </div>
          
          <button class="btn btn-primary" onclick="document.getElementById('booking-modal').classList.remove('active')">Return to Website</button>
        </div>
      `}else alert("Error submitting booking: "+(a.error||"Unknown error")),t.innerText="Submit Booking",t.disabled=!1}catch{alert("Network error."),t.innerText="Submit Booking",t.disabled=!1}};
