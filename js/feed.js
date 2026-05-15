document.addEventListener('DOMContentLoaded', () => {
  const feedContainer = document.getElementById('feedContainer');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  let posts = JSON.parse(localStorage.getItem('reliefPosts')) || [];

  function renderFeed(filter = 'ALL') {
    feedContainer.innerHTML = '';
    
    const filteredPosts = posts.filter(post => filter === 'ALL' || post.category === filter);

    if (filteredPosts.length === 0) {
      feedContainer.innerHTML = '<p style="text-align:center; color:#a1a1aa; margin-top: 3rem;">No active logs found for this category.</p>';
      return;
    }

    filteredPosts.forEach(post => {
 
      const timeDiff = Math.floor((new Date() - new Date(post.timestamp)) / 60000);
      let timeString = timeDiff < 1 ? 'Just now' : timeDiff < 60 ? `${timeDiff} mins ago` : `${Math.floor(timeDiff/60)} hrs ago`;
      
      const isSOS = post.category === 'SOS';
      const iconClass = isSOS ? 'icon-sos' : 'icon-resource';
      const faIcon = isSOS ? 'fa-truck-medical' : 'fa-box-open';
      
      const locationText = post.location || 'Location Not Provided';
      const contactOrQty = isSOS 
        ? `<span><i class="fa-solid fa-phone"></i> ${post.contact}</span>`
        : `<span><i class="fa-solid fa-layer-group"></i> Qty: ${post.quantity}</span>`;

      const triageBadge = post.triage 
        ? `<span class="triage-badge" style="background: ${post.triage.color};">${post.triage.level}</span>` 
        : `<span class="triage-badge" style="background: ${isSOS ? '#e11d48' : '#10b981'};">${isSOS ? 'SOS' : 'RESOURCE'}</span>`;

      const cardHTML = `
        <div class="feed-card">
          <div class="feed-icon ${iconClass}"><i class="fa-solid ${faIcon}"></i></div>
          <div class="feed-content">
            <h3>${post.type} ${triageBadge}</h3>
            <div class="meta">
              <span><i class="fa-solid fa-clock"></i> ${timeString}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${locationText}</span>
              ${contactOrQty}
            </div>
            <p>Logged by: <b>${post.name}</b></p>
          </div>
        </div>
      `;
      feedContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  renderFeed();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderFeed(e.target.getAttribute('data-filter'));
    });
  });
});
