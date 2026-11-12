/**
 * News Page Logic - Tải và hiển thị danh sách bài viết từ Backend API
 */

let allPostsList = [];
let selectedNewsCat = 'all';
let newsSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  updateNavbarUser();
  loadPosts();
});

async function loadPosts() {
  const container = document.getElementById('newsGridContainer');
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
    if (!res.ok) throw new Error('Không thể tải bài viết');

    allPostsList = await res.json();
    renderNewsGrid();
  } catch (err) {
    console.error('Lỗi tải bài viết:', err);
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #dc2626;">
          <p style="font-weight: 700; font-size: 1.1rem;">⚠️ Không thể tải danh sách bài viết.</p>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Vui lòng kiểm tra API backend tại cổng 8080.</p>
        </div>
      `;
    }
  }
}

function filterNewsCategory(cat, btnEl) {
  selectedNewsCat = cat;
  if (btnEl) {
    btnEl.parentElement.querySelectorAll('.news-cat-pill').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  }
  renderNewsGrid();
}

function handleSearchNews(val) {
  newsSearchQuery = (val || '').toLowerCase().trim();
  renderNewsGrid();
}

function renderNewsGrid() {
  const container = document.getElementById('newsGridContainer');
  if (!container) return;

  let filtered = [...allPostsList];

  if (selectedNewsCat !== 'all') {
    filtered = filtered.filter(p => (p.category || '').toLowerCase() === selectedNewsCat.toLowerCase());
  }

  if (newsSearchQuery) {
    filtered = filtered.filter(p => 
      (p.title || '').toLowerCase().includes(newsSearchQuery) || 
      (p.summary || '').toLowerCase().includes(newsSearchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: white; border-radius: 12px; border: 1px dashed var(--border-color);">
        <div style="font-size: 3rem; margin-bottom: 0.8rem;">📰</div>
        <h3 style="color: #1e293b; margin: 0 0 0.5rem;">Không tìm thấy bài viết nào phù hợp</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Hãy thử chọn chuyên mục khác hoặc tìm kiếm với từ khóa khác.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(renderNewsCard).join('');
}

function renderNewsCard(post) {
  const imgUrl = post.thumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600';
  const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật';
  const commentCount = (post.comments && post.comments.length) || 0;
  const views = post.views || 0;

  return `
    <a href="news-detail.html?id=${post.id}" class="news-card news-card-interactive">
      <div class="news-img-wrap">
        <img src="${imgUrl}" alt="${post.title}" class="news-img" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'">
      </div>
      <div class="news-body">
        <span class="news-tag">${post.category || 'TIN CÔNG NGHỆ'}</span>
        <h2 class="news-title">${post.title}</h2>
        <p class="news-excerpt">${post.summary || ''}</p>
        <div class="news-meta-info">
          <span>✍️ ${post.author || 'SiSi Tech'}</span>
          <span>📅 ${dateStr}</span>
          <span style="margin-left:auto;">💬 ${commentCount}</span>
          <span>👁️ ${views}</span>
        </div>
      </div>
    </a>
  `;
}
