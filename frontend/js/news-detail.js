/**
 * News Detail Logic - Xem toàn bộ bài viết và bình luận bài viết
 */

let currentPostId = null;
let currentPost = null;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  currentPostId = params.get('id');

  updateNavbarUser();

  // Tự động điền họ tên, email nếu người dùng đã đăng nhập
  const currentUser = getCurrentUser();
  if (currentUser) {
    const authorInput = document.getElementById('commentAuthor');
    const emailInput = document.getElementById('commentEmail');
    if (authorInput) authorInput.value = currentUser.fullName || currentUser.username;
    if (emailInput && currentUser.email) emailInput.value = currentUser.email;
  }

  if (currentPostId) {
    loadPostDetail(currentPostId);
    loadRecentPostsSidebar();
  } else {
    document.getElementById('articleTitle').textContent = 'Không tìm thấy bài viết';
    document.getElementById('articleContent').innerHTML = `
      <div style="text-align: center; padding: 3rem 0;">
        <p style="color: #dc2626; font-size: 1.1rem; font-weight: 700;">⚠️ Liên kết bài viết không hợp lệ hoặc không tồn tại.</p>
        <a href="news.html" class="btn-buy" style="display: inline-block; margin-top: 1rem; text-decoration: none;">← Quay lại danh sách tin tức</a>
      </div>
    `;
  }
});

async function loadPostDetail(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`);
    if (!res.ok) throw new Error('Không thể tải bài viết');

    currentPost = await res.json();

    document.title = `${currentPost.title} - SiSi Shop`;

    document.getElementById('breadcrumbTitle').textContent = currentPost.title;
    document.getElementById('articleTitle').textContent = currentPost.title;
    document.getElementById('articleCategory').textContent = (currentPost.category || 'TIN CÔNG NGHỆ').toUpperCase();
    document.getElementById('articleAuthor').innerHTML = `✍️ ${currentPost.author || 'Ban biên tập SiSi Tech'}`;
    
    const dateStr = currentPost.createdAt ? new Date(currentPost.createdAt).toLocaleDateString('vi-VN') : 'Vừa xong';
    document.getElementById('articleDate').innerHTML = `📅 ${dateStr}`;
    document.getElementById('articleViews').innerHTML = `👁️ ${currentPost.views || 1} lượt xem`;

    if (currentPost.summary) {
      document.getElementById('articleSummary').textContent = currentPost.summary;
      document.getElementById('articleSummary').style.display = 'block';
    } else {
      document.getElementById('articleSummary').style.display = 'none';
    }

    if (currentPost.thumbnail) {
      const thumb = document.getElementById('articleThumbnail');
      thumb.src = currentPost.thumbnail;
      thumb.style.display = 'block';
    }

    // Hiển thị nội dung chi tiết bài viết
    const contentArea = document.getElementById('articleContent');
    contentArea.innerHTML = currentPost.content || '<p>Chưa có nội dung chi tiết cho bài viết này.</p>';

    // Hiển thị danh sách bình luận
    renderComments(currentPost.comments || []);

  } catch (err) {
    console.error('Lỗi khi tải chi tiết bài viết:', err);
    document.getElementById('articleContent').innerHTML = `
      <div style="text-align: center; padding: 3rem 0; color: #dc2626;">
        <p>⚠️ Không thể kết nối tới hệ thống để lấy bài viết. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

function renderComments(comments) {
  const container = document.getElementById('commentsList');
  const countBadge = document.getElementById('commentsCountBadge');
  const countHeader = document.getElementById('articleCommentsCount');

  if (countBadge) countBadge.textContent = comments.length;
  if (countHeader) countHeader.innerHTML = `💬 ${comments.length} bình luận`;

  if (!container) return;

  if (comments.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); background: #f8fafc; border-radius: 8px;">
        Chưa có bình luận nào cho bài viết này. Hãy là người đầu tiên chia sẻ ý kiến của bạn!
      </div>
    `;
    return;
  }

  container.innerHTML = comments.map(c => {
    const initial = (c.authorName ? c.authorName.charAt(0).toUpperCase() : 'U');
    const dateStr = c.createdAt ? new Date(c.createdAt).toLocaleString('vi-VN') : 'Vừa xong';
    return `
      <div class="comment-card">
        <div class="comment-header">
          <div class="comment-author-box">
            <div class="comment-avatar">${initial}</div>
            <div>
              <div style="font-weight: 700; color: #1e293b; font-size: 0.92rem;">${c.authorName}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${dateStr}</div>
            </div>
          </div>
          <span style="font-size: 0.8rem; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 12px; font-weight: 600;">Đã xác nhận</span>
        </div>
        <div style="font-size: 0.95rem; color: #334155; line-height: 1.5; margin-top: 0.5rem; padding-left: 48px;">
          ${c.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }).join('');
}

async function handleSendComment(e) {
  e.preventDefault();
  if (!currentPostId) return;

  const authorName = document.getElementById('commentAuthor').value.trim();
  const authorEmail = document.getElementById('commentEmail').value.trim();
  const content = document.getElementById('commentContent').value.trim();

  if (!authorName || !content) {
    showToast('Vui lòng điền họ tên và nội dung bình luận!');
    return;
  }

  const btn = document.getElementById('btnSubmitComment');
  btn.disabled = true;
  btn.textContent = 'Đang gửi...';

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${currentPostId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, authorEmail, content })
    });

    if (!res.ok) throw new Error('Không thể gửi bình luận');

    const newComment = await res.json();
    showToast('🎉 Bình luận của bạn đã được đăng thành công!');

    document.getElementById('commentContent').value = '';

    // Cập nhật danh sách bình luận trên giao diện
    if (!currentPost.comments) currentPost.comments = [];
    currentPost.comments.unshift(newComment);
    renderComments(currentPost.comments);

  } catch (err) {
    console.error('Lỗi gửi bình luận:', err);
    showToast('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại!');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Gửi bình luận 💬';
  }
}

async function loadRecentPostsSidebar() {
  const container = document.getElementById('recentPostsWidget');
  if (!container) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/posts?status=PUBLISHED`);
    if (!res.ok) return;

    const posts = await res.json();
    // Lọc bỏ bài hiện tại và lấy 4 bài khác
    const otherPosts = posts.filter(p => String(p.id) !== String(currentPostId)).slice(0, 4);

    if (otherPosts.length === 0) {
      container.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Không có bài viết khác.</p>';
      return;
    }

    container.innerHTML = otherPosts.map(p => {
      const img = p.thumbnail || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
      const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString('vi-VN') : '';
      return `
        <a href="news-detail.html?id=${p.id}" class="side-post-item">
          <img src="${img}" alt="${p.title}" class="side-post-thumb" onerror="this.src='https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300'">
          <div>
            <div class="side-post-title">${p.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">📅 ${dateStr}</div>
          </div>
        </a>
      `;
    }).join('');

  } catch (e) {
    console.error('Lỗi tải bài viết sidebar:', e);
  }
}
