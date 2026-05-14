let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentFilter = "all";
let chartInstance = null;

function renderStats() {
  const sos = posts.filter(p => p.type === "SOS").length;
  const res = posts.filter(p => p.type === "RESOURCE").length;
  document.getElementById("sosCount").textContent = sos;
  document.getElementById("resCount").textContent = res;
  document.getElementById("totalCount").textContent = posts.length;
}

function renderChart() {
  const sos = posts.filter(p => p.type === "SOS").length;
  const res = posts.filter(p => p.type === "RESOURCE").length;
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(document.getElementById("chart"), {
    type: 'bar',
    data: {
      labels: ['SOS Requests', 'Resources'],
      datasets: [{
        label: 'Count',
        data: [sos, res],
        backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(34,197,94,0.7)'],
        borderColor: ['#ef4444', '#22c55e'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

function renderPosts() {
  const list = document.getElementById("postsList");
  const filtered = currentFilter === "all" ? posts : posts.filter(p => p.type === currentFilter);

  if (filtered.length === 0) {
    list.innerHTML = '<div class="empty">No posts found.</div>';
    return;
  }

  list.innerHTML = filtered.map((post) => {
    const realIndex = posts.indexOf(post);
    if (post.type === "SOS") {
      return '<div class="post-card sos">' +
        '<div><strong>' + post.name + '</strong>' +
        '<p>' + post.emergency + ' &bull; ' + post.location + ' &bull; ' + post.contact + '</p></div>' +
        '<button class="resolve-btn" onclick="deletePost(' + realIndex + ')">Resolve</button>' +
        '</div>';
    } else {
      return '<div class="post-card resource">' +
        '<div><strong>' + post.helper + '</strong>' +
        '<p>' + post.resource + ' &bull; Qty: ' + post.quantity + '</p></div>' +
        '<button class="resolve-btn" onclick="deletePost(' + realIndex + ')">Remove</button>' +
        '</div>';
    }
  }).join('');
}

function deletePost(index) {
  posts.splice(index, 1);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderStats();
  renderChart();
  renderPosts();
}

function clearAll() {
  if (confirm("Clear all posts?")) {
    posts = [];
    localStorage.setItem("posts", JSON.stringify(posts));
    renderStats();
    renderChart();
    renderPosts();
  }
}

function filterPosts(type, btn) {
  currentFilter = type;
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderPosts();
}

renderStats();
renderChart();
renderPosts();