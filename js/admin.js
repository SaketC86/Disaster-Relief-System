document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});

function renderDashboard() {
  const posts = JSON.parse(localStorage.getItem('reliefPosts')) || [];
  
  let sosCount = 0;
  let resCount = 0;

  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  posts.forEach((post, index) => {
    if (post.category === 'SOS') sosCount++;
    if (post.category === 'RESOURCE') resCount++;

    const badgeColor = post.category === 'SOS' ? '#e11d48' : '#10b981';
    const triageText = post.triage ? post.triage.level : post.category;
    
    const row = `
      <tr>
        <td><b>${post.type}</b></td>
        <td>${post.name}</td>
        <td>${post.location || 'N/A'}</td>
        <td><span style="background: ${badgeColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${triageText}</span></td>
        <td><button class="resolve-btn" onclick="resolveTicket(${index})">Resolve</button></td>
      </tr>
    `;
    tableBody.insertAdjacentHTML('beforeend', row);
  });

  document.getElementById('sosCount').innerText = sosCount;
  document.getElementById('resCount').innerText = resCount;
  document.getElementById('totalCount').innerText = posts.length;

  if(posts.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#a1a1aa;">Database is empty.</td></tr>';
  }

  drawChart(sosCount, resCount);
}

let systemChartInstance = null;
function drawChart(sos, res) {
  const ctx = document.getElementById('systemChart').getContext('2d');
  
  if (systemChartInstance) systemChartInstance.destroy(); // Prevent overlapping charts

  systemChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Critical SOS Alerts', 'Available Resources'],
      datasets: [{
        data: [sos, res],
        backgroundColor: ['#e11d48', '#10b981'],
        borderColor: '#27272a',
        borderWidth: 2,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#e2e8f0', font: { family: 'Inter', size: 14 } }
        }
      }
    }
  });
}

window.resolveTicket = function(index) {
  let posts = JSON.parse(localStorage.getItem('reliefPosts')) || [];
  posts.splice(index, 1); 
  localStorage.setItem('reliefPosts', JSON.stringify(posts));
  renderDashboard(); 
}

window.clearSystemData = function() {
  if(confirm('🚨 WARNING: Are you sure you want to permanently purge all system data? This cannot be undone.')) {
    localStorage.removeItem('reliefPosts');
    location.reload(); 
  }
}
