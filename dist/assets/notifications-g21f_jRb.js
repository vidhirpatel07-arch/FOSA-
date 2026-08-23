import{k as c,o as d,m}from"./store-C-SBEWck.js";/* empty css              */document.addEventListener("DOMContentLoaded",async()=>{const r=c(),i=document.getElementById("notifications-list");async function n(){const t=await m(r);if(t.length===0){i.innerHTML="<p>You have no notifications yet.</p>";return}function s(e){const a=new Date(e.replace(" ","T")+"Z");return a.toLocaleDateString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric"})+" at "+a.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}i.innerHTML=t.map(e=>`
          <div class="notif-card ${e.isRead?"read":""}">
            <p style="color: var(--color-primary-charcoal); line-height: 1.5; font-size: 1.05rem;">${e.message}</p>
            <div class="notif-time" style="color: var(--color-secondary-taupe); font-size: 0.85rem; margin-top: 10px; font-weight: 500;">
              ${s(e.createdAt)}
            </div>
          </div>
        `).join("")}await n(),setInterval(n,5e3);const o=notifs.filter(t=>!t.isRead).map(t=>t.id);o.length>0&&await d(o)});
