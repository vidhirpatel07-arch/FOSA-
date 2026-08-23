import { getNotifications, getUserId, markNotificationsRead, getConfig, getEvents } from './store.js';

document.addEventListener('DOMContentLoaded', async () => {
  await renderDynamicContent();
  
  // Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
  });

  // Global Event Delegation for FAQs (Fixes mobile touch issues and dynamic rendering bugs)
  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;
    const item = question.closest('.faq-item');
    if (!item) return;

    const isActive = item.classList.contains('active');
    
    // Close other FAQs in the same container
    const container = item.parentElement;
    if (container) {
      container.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        const span = faq.querySelector('span');
        if (span) span.textContent = '+';
      });
    }

    if (!isActive) {
      item.classList.add('active');
      const span = item.querySelector('span');
      if (span) span.textContent = '-';
    }
  });

  // Workshop Details Expand
  const toggleBtn = document.getElementById('toggle-details-btn');
  const detailsArea = document.getElementById('workshop-details');
  if (toggleBtn && detailsArea) {
    toggleBtn.addEventListener('click', () => {
      detailsArea.classList.toggle('expanded');
      toggleBtn.innerText = detailsArea.classList.contains('expanded') ? 'Show Less Details' : 'Know More About Event';
    });
  }

  // FAQ Accordion is now handled via event delegation globally.

  // Load Notifications
  loadNotifications();
  setInterval(loadNotifications, 5000);
  
  // Back to Top Button
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
});

async function renderDynamicContent() {
  const [config, events] = await Promise.all([getConfig(), getEvents()]);
  
  // --- HERO RENDER ---
  const heroImages = config.hero_images || [];
  const heroContainer = document.getElementById('hero-carousel-container');
  if (heroContainer && heroImages.length > 0) {
    let cardsHtml = heroImages.map((src, i) => `
      <div class="carousel-card">
        <img src="${src}" alt="Slide ${i+1}" />
      </div>
    `).join('');
    
    heroContainer.innerHTML = `
      <div class="carousel-track" id="slider-track">
        ${cardsHtml}
      </div>
      <div class="slider-nav">
        <button class="slider-btn" id="slide-prev">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="slider-dots" id="slider-dots">
          ${heroImages.map((_, i) => `<div class="dot ${i===0?'active':''}" data-index="${i}"></div>`).join('')}
        </div>
        <button class="slider-btn" id="slide-next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;
    initHeroSlider();
  }
  
  // --- EVENTS RENDER ---
  const eventsContainer = document.getElementById('events-container');
  if (eventsContainer) {
    let html = `
      <div style="text-align: center; margin-bottom: 7rem;">
        <h2 style="font-size: 3.5rem; color: var(--color-primary-charcoal); margin-bottom: 0.5rem; font-family: var(--font-heading);">Upcoming Events</h2>
        <div style="width: 80px; height: 2px; background-color: var(--color-accent-gold); margin: 0 auto 1.5rem auto;"></div>
        <p style="color: var(--color-secondary-taupe); max-width: 650px; margin: 0 auto; font-size: 1.15rem; line-height: 1.6;">Discover our specialized workshops combining fitness, focus, and connection with nature.</p>
      </div>
    `;
    
    events.forEach(evt => {
      const tagsHtml = (evt.tags || []).map(t => `<span class="wc-tag">${t}</span>`).join('');
      const timelineHtml = (evt.timeline || []).map(t => `<div class="timeline-item"><strong>${t.time}:</strong> ${t.desc}</div>`).join('');
      const faqsHtml = (evt.faqs || []).map(f => `
        <div class="faq-item">
          <div class="faq-question">${f.q} <span>+</span></div>
          <p class="faq-answer">${f.a}</p>
        </div>
      `).join('');
      
      const galleryImagesHtml = (evt.gallery || []).map(src => `<img src="${src}" alt="Gallery image" />`).join('');
      const galleryHtml = evt.gallery && evt.gallery.length > 0 ? `
        <h3 class="mb-sm">Gallery</h3>
        <div class="card-gallery mb-md">
          ${galleryImagesHtml}
        </div>
      ` : '';
      
      html += `
      <div class="workshop-card fade-up">
        <div class="wc-header">
          <img src="${evt.hero_image || '/images/pilates_2.jpg'}" alt="${evt.title}" class="wc-img" />
        </div>
        
        <div class="wc-body" style="text-align: left;">
          <div class="wc-tags" style="margin-bottom: 1.5rem;">
            ${tagsHtml}
          </div>
          <h2 style="font-size: 2.2rem; color: var(--color-primary-charcoal); margin-bottom: 2.5rem; line-height: 1.2;">${evt.title}</h2>

          <div class="wc-stats" style="text-align: left; justify-content: flex-start; gap: 2rem; flex-wrap: wrap; border-bottom: 1px solid #cbd5e1; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <div>
              <div class="stat-title">Date</div>
              <div class="stat-val" style="font-size: 1.1rem;">${evt.date}</div>
            </div>
            ${evt.session_text ? `
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Sessions</div>
              <div class="stat-val" style="font-size: 1.1rem;">${evt.session_text}</div>
            </div>` : ''}
            ${evt.price ? `
            <div style="border-left: 1px solid #cbd5e1; padding-left: 2rem;">
              <div class="stat-title">Price</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${evt.discount_price ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.9rem; margin-right: 5px;">₹${evt.price}</span>₹${evt.discount_price}` : `₹${evt.price}`}
              </div>
            </div>` : ''}
            ${evt.location_text ? `
            <div style="width: 100%; margin-top: 0.5rem;">
              <div class="stat-title">Location</div>
              <div class="stat-val" style="font-size: 1.1rem;">
                ${evt.location_link ? `<a href="${evt.location_link}" target="_blank" style="color: var(--color-primary-charcoal); text-decoration: underline; text-underline-offset: 4px;">${evt.location_text}</a>` : evt.location_text}
              </div>
            </div>` : ''}
          </div>
          
          <p class="mb-md" style="color: #475569; font-style: italic; line-height: 1.6; font-size: 1.05rem;">
            "${evt.description}"
          </p>

          <div class="wc-actions">
            <button class="btn btn-outline toggle-details-btn">Know More About Event</button>
            <button class="btn btn-primary" onclick="window.startBooking('${evt.id}')">Enroll Now</button>
          </div>

          <div class="wc-expandable workshop-details">
            <div style="margin-top: var(--spacing-md); border-top: 1px solid var(--color-primary-beige); padding-top: var(--spacing-sm);">
              <h3 class="mb-sm">Experience Timeline</h3>
              <div class="timeline mb-md">
                ${timelineHtml}
              </div>
              
              ${galleryHtml}
              
              <h3 class="mb-sm">FAQ</h3>
              <div class="faq-container mb-md">
                ${faqsHtml}
              </div>
              <div class="text-center mt-md">
                <button class="btn btn-primary" onclick="window.startBooking('${evt.id}')" style="width:100%;">Reserve Your Spot</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
    });
    eventsContainer.innerHTML = html;
    
    // Bind local events for new DOM elements
    document.querySelectorAll('.toggle-details-btn').forEach((btn, idx) => {
      const details = document.querySelectorAll('.workshop-details')[idx];
      btn.addEventListener('click', () => {
        details.classList.toggle('expanded');
        btn.innerText = details.classList.contains('expanded') ? 'Show Less Details' : 'Know More About Event';
      });
    });
  }
}

function initHeroSlider() {
  const sliderTrack = document.getElementById('slider-track');
  const slidePrevBtn = document.getElementById('slide-prev');
  const slideNextBtn = document.getElementById('slide-next');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let cards = Array.from(document.querySelectorAll('.carousel-card'));
  
  if (sliderTrack && cards.length > 0) {
    const originalCount = cards.length;
    const cardWidth = 440; // 420px + 20px gap
    let autoSlideInterval;
    
    // Clone cards for endless scrolling illusion (3 sets total)
    for(let i=0; i<2; i++) {
      cards.forEach(card => sliderTrack.appendChild(card.cloneNode(true)));
    }
    
    const allCards = Array.from(document.querySelectorAll('.carousel-card'));
    
    // Start at the middle set
    setTimeout(() => {
      sliderTrack.style.scrollBehavior = 'auto';
      sliderTrack.scrollLeft = originalCount * cardWidth;
      sliderTrack.style.scrollBehavior = 'smooth';
      updateActive();
    }, 100);

    const updateActive = () => {
      const trackCenter = sliderTrack.getBoundingClientRect().left + sliderTrack.clientWidth / 2;
      let closestCard = allCards[0];
      let minDistance = Infinity;
      
      allCards.forEach((card) => {
        const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
        const distance = Math.abs(trackCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });
      
      allCards.forEach(c => c.classList.remove('active'));
      closestCard.classList.add('active');
      
      const activeIdx = allCards.indexOf(closestCard) % originalCount;
      dots.forEach(d => d.classList.remove('active'));
      if(dots[activeIdx]) dots[activeIdx].classList.add('active');
    };

    sliderTrack.addEventListener('scroll', () => {
      updateActive();
      
      // Endless loop jump
      if (sliderTrack.scrollLeft < cardWidth) {
        sliderTrack.style.scrollBehavior = 'auto';
        sliderTrack.scrollLeft += originalCount * cardWidth;
        sliderTrack.style.scrollBehavior = 'smooth';
      } else if (sliderTrack.scrollLeft > (allCards.length - 2) * cardWidth) {
        sliderTrack.style.scrollBehavior = 'auto';
        sliderTrack.scrollLeft -= originalCount * cardWidth;
        sliderTrack.style.scrollBehavior = 'smooth';
      }
    }, {passive: true});
    
    const scrollToNext = () => sliderTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
    const scrollToPrev = () => sliderTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    
    if (slideNextBtn) slideNextBtn.addEventListener('click', () => {
      scrollToNext();
      resetInterval();
    });
    if (slidePrevBtn) slidePrevBtn.addEventListener('click', () => {
      scrollToPrev();
      resetInterval();
    });
    
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        const currentActive = allCards.findIndex(c => c.classList.contains('active'));
        const currentSetStart = Math.floor(currentActive / originalCount) * originalCount;
        const targetIndex = currentSetStart + idx;
        
        const scrollAmount = (targetIndex - currentActive) * cardWidth;
        sliderTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        resetInterval();
      });
    });
    
    const startInterval = () => {
      autoSlideInterval = setInterval(scrollToNext, 2500);
    };
    const resetInterval = () => {
      clearInterval(autoSlideInterval);
      startInterval();
    };
    
    startInterval();
    
    sliderTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    sliderTrack.addEventListener('mouseleave', startInterval);
    sliderTrack.addEventListener('touchstart', () => clearInterval(autoSlideInterval), {passive: true});
    sliderTrack.addEventListener('touchend', startInterval, {passive: true});
  }
}

// Menu Toggle
window.toggleMenu = () => {
  const menu = document.getElementById('side-menu');
  menu.classList.toggle('open');
};

async function loadNotifications() {
  const uid = getUserId();
  const notifs = await getNotifications(uid);
  const badge = document.getElementById('notif-count');
  
  if (!badge) return;
  
  const unread = notifs.filter(n => !n.isRead);
  if (unread.length > 0) {
    badge.innerText = unread.length;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

async function markCurrentNotificationsRead() {
  const uid = getUserId();
  const notifs = await getNotifications(uid);
  const unreadIds = notifs.filter(n => !n.isRead).map(n => n.id);
  
  if (unreadIds.length > 0) {
    await markNotificationsRead(unreadIds);
    document.getElementById('notif-count').style.display = 'none';
    setTimeout(loadNotifications, 500);
  }
}

