import{j as $,e as B,k,m as I,g as S,n as L}from"./store-C-SBEWck.js";/* empty css              */document.addEventListener("DOMContentLoaded",async()=>{await q();const e={root:null,rootMargin:"0px",threshold:.1},r=new IntersectionObserver((t,c)=>{t.forEach(l=>{l.isIntersecting&&(l.target.classList.add("visible"),c.unobserve(l.target))})},e);document.querySelectorAll(".fade-up").forEach(t=>{r.observe(t)});const o=document.getElementById("toggle-details-btn"),i=document.getElementById("workshop-details");o&&i&&o.addEventListener("click",()=>{i.classList.toggle("expanded"),o.innerText=i.classList.contains("expanded")?"Show Less Details":"Know More About Event"});const a=document.querySelectorAll(".faq-item");a.forEach(t=>{t.querySelector(".faq-question").addEventListener("click",()=>{const l=t.classList.contains("active");a.forEach(m=>{m.classList.remove("active"),m.querySelector("span").textContent="+"}),l||(t.classList.add("active"),t.querySelector("span").textContent="-")})}),E(),setInterval(E,5e3);const s=document.getElementById("back-to-top");window.addEventListener("scroll",()=>{window.scrollY>300?s.classList.add("visible"):s.classList.remove("visible")})});async function q(){const[e,r]=await Promise.all([$(),B()]),o=e.hero_images||[],i=document.getElementById("hero-carousel-container");if(i&&o.length>0){let s=o.map((t,c)=>`
      <div class="carousel-card">
        <img src="${t}" alt="Slide ${c+1}" />
      </div>
    `).join("");i.innerHTML=`
      <div class="carousel-track" id="slider-track">
        ${s}
      </div>
      <div class="slider-nav">
        <button class="slider-btn" id="slide-prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="slider-dots" id="slider-dots">
          ${o.map((t,c)=>`<div class="dot ${c===0?"active":""}" data-index="${c}"></div>`).join("")}
        </div>
        <button class="slider-btn" id="slide-next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `,P()}const a=document.getElementById("events-container");if(a){let s=`
      <div style="text-align: center; margin-bottom: 7rem;">
        <h2 style="font-size: 3.5rem; color: var(--color-primary-charcoal); margin-bottom: 0.5rem; font-family: var(--font-heading);">Upcoming Events</h2>
        <div style="width: 80px; height: 2px; background-color: var(--color-accent-gold); margin: 0 auto 1.5rem auto;"></div>
        <p style="color: var(--color-secondary-taupe); max-width: 650px; margin: 0 auto; font-size: 1.15rem; line-height: 1.6;">Discover our specialized workshops combining fitness, focus, and connection with nature.</p>
      </div>
    `;r.forEach(t=>{const c=(t.tags||[]).map(d=>`<span class="wc-tag">${d}</span>`).join(""),l=(t.timeline||[]).map(d=>`<div class="timeline-item"><strong>${d.time}:</strong> ${d.desc}</div>`).join(""),m=(t.faqs||[]).map(d=>`
        <div class="faq-item">
          <div class="faq-question">${d.q} <span>+</span></div>
          <p class="faq-answer">${d.a}</p>
        </div>
      `).join(""),y=(t.gallery||[]).map(d=>`<img src="${d}" alt="Gallery image" />`).join(""),b=t.gallery&&t.gallery.length>0?`
        <h3 class="mb-sm">Gallery</h3>
        <div class="card-gallery mb-md">
          ${y}
        </div>
      `:"";s+=`
      <div class="workshop-card fade-up">
        <div class="wc-header">
          <img src="${t.hero_image||"/images/pilates_2.jpg"}" alt="${t.title}" class="wc-img" />
        </div>
        
        <div class="wc-body" style="text-align: left;">
          <div class="wc-tags" style="margin-bottom: 1.5rem;">
            ${c}
          </div>
          <h2 style="font-size: 2.2rem; color: var(--color-primary-charcoal); margin-bottom: 2.5rem; line-height: 1.2;">${t.title}</h2>

          <div class="wc-stats" style="text-align: left; justify-content: flex-start; gap: 2rem; flex-wrap: wrap; border-bottom: 1px solid #cbd5e1; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div>
              <div class="stat-title">Date</div>
              <div class="stat-val" style="font-size: 1.1rem;">${t.date}</div>
            </div>
            ${t.session_text?`
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Sessions</div>
              <div class="stat-val" style="font-size: 1.1rem;">${t.session_text}</div>
            </div>`:""}
            ${t.price?`
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Price</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${t.discount_price?`<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.9rem; margin-right: 5px;">₹${t.price}</span>₹${t.discount_price}`:`₹${t.price}`}
              </div>
            </div>`:""}
            ${t.location_text?`
            <div style="width: 100%; margin-top: 0.5rem;">
              <div class="stat-title">Location</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${t.location_link?`<a href="${t.location_link}" target="_blank" style="color: var(--color-primary-charcoal); text-decoration: underline; text-underline-offset: 4px;">${t.location_text}</a>`:t.location_text}
              </div>
            </div>`:""}
          </div>
          
          <p class="mb-md" style="color: #475569; font-style: italic; line-height: 1.6; font-size: 1.05rem;">
            "${t.description}"
          </p>

          <div class="wc-actions">
            <button class="btn btn-outline toggle-details-btn">Know More About Event</button>
            <button class="btn btn-primary" onclick="window.startBooking('${t.id}')">Enroll Now</button>
          </div>

          <div class="wc-expandable workshop-details">
            <div style="margin-top: var(--spacing-md); border-top: 1px solid var(--color-primary-beige); padding-top: var(--spacing-sm);">
              <h3 class="mb-sm">Experience Timeline</h3>
              <div class="timeline mb-md">
                ${l}
              </div>
              
              ${b}
              
              <h3 class="mb-sm">FAQ</h3>
              <div class="faq-container mb-md">
                ${m}
              </div>
              <div class="text-center mt-md">
                <button class="btn btn-primary" onclick="window.startBooking('${t.id}')" style="width:100%;">Reserve Your Spot</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `}),a.innerHTML=s,document.querySelectorAll(".toggle-details-btn").forEach((t,c)=>{const l=document.querySelectorAll(".workshop-details")[c];t.addEventListener("click",()=>{l.classList.toggle("expanded"),t.innerText=l.classList.contains("expanded")?"Show Less Details":"Know More About Event"})}),document.querySelectorAll(".faq-item").forEach(t=>{t.querySelector(".faq-question").addEventListener("click",()=>{const l=t.classList.contains("active");t.parentElement.querySelectorAll(".faq-item").forEach(m=>{m.classList.remove("active"),m.querySelector("span").textContent="+"}),l||(t.classList.add("active"),t.querySelector("span").textContent="-")})})}}function P(){const e=document.getElementById("slider-track"),r=document.getElementById("slide-prev"),o=document.getElementById("slide-next"),i=document.querySelectorAll(".slider-dots .dot");let a=Array.from(document.querySelectorAll(".carousel-card"));if(e&&a.length>0){const s=a.length,t=440;let c;for(let v=0;v<2;v++)a.forEach(g=>e.appendChild(g.cloneNode(!0)));const l=Array.from(document.querySelectorAll(".carousel-card"));setTimeout(()=>{e.style.scrollBehavior="auto",e.scrollLeft=s*t,e.style.scrollBehavior="smooth",m()},100);const m=()=>{const v=e.getBoundingClientRect().left+e.clientWidth/2;let g=l[0],u=1/0;l.forEach(p=>{const x=p.getBoundingClientRect().left+p.clientWidth/2,f=Math.abs(v-x);f<u&&(u=f,g=p)}),l.forEach(p=>p.classList.remove("active")),g.classList.add("active");const w=l.indexOf(g)%s;i.forEach(p=>p.classList.remove("active")),i[w]&&i[w].classList.add("active")};e.addEventListener("scroll",()=>{m(),e.scrollLeft<t?(e.style.scrollBehavior="auto",e.scrollLeft+=s*t,e.style.scrollBehavior="smooth"):e.scrollLeft>(l.length-2)*t&&(e.style.scrollBehavior="auto",e.scrollLeft-=s*t,e.style.scrollBehavior="smooth")},{passive:!0});const y=()=>e.scrollBy({left:t,behavior:"smooth"}),b=()=>e.scrollBy({left:-t,behavior:"smooth"});o&&o.addEventListener("click",()=>{y(),h()}),r&&r.addEventListener("click",()=>{b(),h()}),i.forEach((v,g)=>{v.addEventListener("click",()=>{const u=l.findIndex(f=>f.classList.contains("active")),x=(Math.floor(u/s)*s+g-u)*t;e.scrollBy({left:x,behavior:"smooth"}),h()})});const d=()=>{c=setInterval(y,2500)},h=()=>{clearInterval(c),d()};d(),e.addEventListener("mouseenter",()=>clearInterval(c)),e.addEventListener("mouseleave",d),e.addEventListener("touchstart",()=>clearInterval(c),{passive:!0}),e.addEventListener("touchend",d,{passive:!0})}}window.toggleMenu=()=>{document.getElementById("side-menu").classList.toggle("open")};async function E(){const e=k(),r=await I(e),o=document.getElementById("notif-count");if(!o)return;const i=r.filter(a=>!a.isRead);i.length>0?(o.innerText=i.length,o.style.display="flex"):o.style.display="none"}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("booking-modal"),r=document.getElementById("close-modal");r&&r.addEventListener("click",()=>{e.classList.remove("active")})});let n={sessionId:null,participants:1,details:{},price:1500};window.startBooking=async(e=null)=>{n.sessionId=null,n.participants=1,n.details=[],n.price=0;const r=document.getElementById("booking-modal"),o=document.getElementById("booking-flow");o.innerHTML='<div style="text-align:center; padding: 2rem;">Loading sessions...</div>',r.classList.add("active");const i=await S(e);if(i.length===0){o.innerHTML='<div style="text-align:center; padding: 2rem;">No sessions available for this event yet. Check back later!</div>';return}o.innerHTML=C(i)};function C(e){return`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Select Your Session</h2>
    <p class="text-center mb-md" style="color: var(--color-secondary-taupe);">Choose the experience that fits your schedule.</p>
    
    <div class="session-selection-container mb-lg">
      ${e.map(o=>{const i=o.booked>=o.capacity;return`
      <div class="session-card ${i?"full":""}" onclick="${i?"":`window.selectSession('${o.id}', ${o.price})`}">
        <div class="session-info">
          <h4 style="font-family: var(--font-heading); font-size: 1.3rem; margin-bottom: 5px; color: var(--color-primary-charcoal);">${o.name}</h4>
          <p style="color: var(--color-secondary-taupe); font-size: 0.95rem;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${o.time}</p>
        </div>
        <div class="session-price">
          ${i?'<span style="color: red; font-weight: 600;">Sold Out</span>':""}
        </div>
      </div>
    `}).join("")}
    </div>
  `}window.selectSession=(e,r)=>{n.sessionId=e,n.price=r,window.goToStep2()};window.goToStep2=()=>{const e=document.getElementById("booking-flow");let r="";for(let o=0;o<n.participants;o++){const i=o===0,a=n.details[o]||{};let s="";i&&(s=`
        <div class="form-group">
          <input type="email" class="form-control" id="p-email-${o}" placeholder="Email Address" required value="${a.email||""}">
        </div>
        <div class="form-group">
          <input type="tel" class="form-control" id="p-phone-${o}" placeholder="WhatsApp / Phone Number" required value="${a.phone||""}">
        </div>
      `),r+=`
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #fff; border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
        <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal); border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">${i?"Primary Contact (Participant 1)":"Participant "+(o+1)}</h4>
        <div class="form-group">
          <input type="text" class="form-control" id="p-name-${o}" placeholder="Full Name" required value="${a.name||""}">
        </div>
        <div class="form-group">
          <input type="number" class="form-control" id="p-age-${o}" placeholder="Age" min="18" required value="${a.age||""}">
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
  `};window.saveStep2Data=()=>{for(let e=0;e<n.participants;e++){n.details[e]||(n.details[e]={});const r=document.getElementById(`p-name-${e}`);r&&(n.details[e].name=r.value);const o=document.getElementById(`p-age-${e}`);if(o&&(n.details[e].age=o.value),e===0){const i=document.getElementById(`p-email-${e}`);i&&(n.details[e].email=i.value);const a=document.getElementById(`p-phone-${e}`);a&&(n.details[e].phone=a.value)}}};window.updateTotalStep2=()=>{window.saveStep2Data();const e=parseInt(document.getElementById("participant-count").value);n.participants=e,window.goToStep2()};window.goToStep3=()=>{window.saveStep2Data();for(let a=0;a<n.participants;a++){const s=n.details[a];if(!s.name||!s.age){alert(`Please fill name and age for Participant ${a+1}.`);return}if(a===0&&(!s.email||!s.phone)){alert("Please fill email and phone for the Primary Contact.");return}}const e=document.getElementById("booking-flow");let r="";for(let a=0;a<n.participants;a++){const s=n.details[a];r+=`
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
    `}const o=n.details[0],i=`
    <div style="margin-bottom: 2rem; padding: 1.5rem; background: var(--color-primary-cream); border: 1px solid var(--color-primary-beige); border-radius: var(--radius-sm);">
      <h4 style="margin-bottom: 1rem; color: var(--color-primary-charcoal);">Group Emergency Contact</h4>
      <div class="form-group">
        <input type="text" class="form-control" id="b-em-name" placeholder="Emergency Contact Name" value="${o.emName||""}" required>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <input type="tel" class="form-control" id="b-em-phone" placeholder="Emergency Contact Number" value="${o.emPhone||""}" required>
      </div>
    </div>
  `;e.innerHTML=`
    <h2 class="mb-sm text-center" style="font-family: var(--font-heading); color: var(--color-primary-charcoal);">Experience & Safety</h2>
    
    ${r}
    ${i}
    
    <div style="display:flex; justify-content:space-between; margin-top:var(--spacing-md);">
      <button class="btn btn-outline" onclick="window.goToStep2()">Back</button>
      <button class="btn btn-primary" onclick="window.goToStep4()">Proceed to Payment</button>
    </div>
  `};window.goToStep4=()=>{for(let i=0;i<n.participants;i++)n.details[i].pilates=document.getElementById(`p-pilates-${i}`).value,n.details[i].horse=document.getElementById(`p-horse-${i}`).value,n.details[i].medical=document.getElementById(`p-medical-${i}`).value;if(n.details[0].emName=document.getElementById("b-em-name").value,n.details[0].emPhone=document.getElementById("b-em-phone").value,!n.details[0].emName||!n.details[0].emPhone){alert("Please provide an emergency contact.");return}const e=n.price*n.participants,r=document.getElementById("booking-flow");r.innerHTML=`
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
  `,document.getElementById("b-receipt").addEventListener("change",i=>{const a=document.getElementById("file-name-display");i.target.files.length>0?a.innerText="Selected: "+i.target.files[0].name:a.innerText=""})};window.submitBooking=async()=>{const e=document.getElementById("b-terms").checked,r=document.getElementById("b-receipt").files[0];if(!e){alert("You must agree to the no-refund policy before proceeding.");return}if(!r){alert("Please upload your payment screenshot.");return}const o=document.getElementById("submit-btn");o.innerText="Processing...",o.disabled=!0;const i=new FormData;i.append("sessionId",n.sessionId),i.append("participants",n.participants),i.append("details",JSON.stringify(n.details.slice(0,n.participants))),i.append("userId",k()),i.append("receipt",r);try{const a=await L(i);if(a.success){const s=document.getElementById("booking-flow");s.innerHTML=`
        <div style="text-align:center; padding: var(--spacing-lg) 0;">
          <div style="font-size:4rem; color:var(--color-accent-gold); margin-bottom:var(--spacing-sm);">âœ“</div>
          <h2 class="mb-sm">Registration Submitted</h2>
          <p class="mb-md" style="font-size:1.1rem; color:var(--color-secondary-taupe);">Your payment is pending review.</p>
          
          <div style="background:var(--color-primary-cream); padding:var(--spacing-md); border-radius:var(--radius-sm); text-align:left; max-width:400px; margin:0 auto var(--spacing-md);">
            <p><strong>Booking ID:</strong> ${a.bookingId}</p>
            <p class="mt-md" style="font-size:0.9rem;">Once the admin verifies your payment, you will receive a confirmation message in the <strong>Notifications</strong> tab (accessible from the top right menu), as well as on your registered WhatsApp number.</p>
          </div>
          
          <button class="btn btn-primary" onclick="document.getElementById('booking-modal').classList.remove('active')">Return to Website</button>
        </div>
      `}else alert("Error submitting booking: "+(a.error||"Unknown error")),o.innerText="Submit Booking",o.disabled=!1}catch{alert("Network error."),o.innerText="Submit Booking",o.disabled=!1}};
