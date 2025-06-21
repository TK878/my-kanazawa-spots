let TAGS = [];
let SPOTS = [];

let activeTag = "all";
let activeArea = "station"; // ← 初回は station 表示

function drawTagButtons() {
  const tagFilter = document.querySelector('.tag-filter');
  let html = '<button type="button" class="tag-btn active" data-tag="all">全て</button>';
  TAGS.forEach(t => {
    html += `<button type="button" class="tag-btn" data-tag="${t.id}">${t.label}</button>`;
  });
  tagFilter.innerHTML = html;

  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTag = btn.dataset.tag;
      document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function drawAreaButtons() {
  const areaFilter = document.querySelector('.area-filter');
  const sections = document.querySelectorAll('section[data-area][data-title]');
  let html = '<button type="button" class="area-btn" data-area="all">全て</button>';

  sections.forEach(sec => {
    const id = sec.getAttribute('data-area');
    const title = sec.getAttribute('data-title');
    const isActive = id === activeArea ? ' active' : '';
    html += `<button type="button" class="area-btn${isActive}" data-area="${id}">${title}</button>`;
  });
  areaFilter.innerHTML = html;

  document.querySelectorAll('.area-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeArea = btn.dataset.area;
      document.querySelectorAll('.area-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });
}

function drawSpotsForArea(areaId) {
  const section = document.getElementById(areaId);
  if (!section || section.hasChildNodes()) return;

  const spots = SPOTS.filter(s => s.area === areaId);
  if (spots.length === 0) return;

  let html = `<h2>${section.dataset.title}</h2><ul>`;
  spots.forEach(spot => {
    html += `<li class="spot" data-tags="${spot.tags.join(' ')}" data-area="${spot.area}">
      <a href="${spot.url}" target="_blank" class="spot-name">${spot.name}</a>
      <span class="spot-desc">${spot.desc}</span>
      <div class="tags">${
        spot.tags.map(tid => `<span>${TAGS.find(t => t.id === tid).label}</span>`).join('')
      }</div>
    </li>`;
  });
  html += '</ul>';
  section.innerHTML = html;
}

function applyFilters() {
  const sections = document.querySelectorAll('section[data-area]');

  sections.forEach(sec => {
    const area = sec.dataset.area;

    // 遅延描画：必要なエリアだけ描画
    if (activeArea === 'all' || area === activeArea) {
      drawSpotsForArea(area);
    }
  });

  const spots = document.querySelectorAll('.spot');
  spots.forEach(spot => {
    const tags = spot.dataset.tags.split(' ');
    const area = spot.dataset.area;
    const tagMatch = activeTag === 'all' || tags.includes(activeTag);
    const areaMatch = activeArea === 'all' || area === activeArea;
    spot.style.display = tagMatch && areaMatch ? '' : 'none';
  });

  sections.forEach(sec => {
    const visible = sec.querySelector('.spot:not([style*="display: none"])');
    sec.style.display = visible ? '' : 'none';
  });
}

function adjustStickyOffsets() {
  requestAnimationFrame(() => {
    const header = document.querySelector('header');
    const areaFilter = document.querySelector('.area-filter');
    const tagFilter = document.querySelector('.tag-filter');

    const headerHeight = header.offsetHeight;
    const areaHeight = areaFilter.offsetHeight;

    areaFilter.style.top = `${headerHeight}px`;
    tagFilter.style.top = `${headerHeight + areaHeight}px`;
  });
}

window.addEventListener('load', adjustStickyOffsets);
window.addEventListener('resize', adjustStickyOffsets);

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    TAGS = data.tags;
    SPOTS = data.spots;
    drawTagButtons();
    drawAreaButtons();
    setTimeout(adjustStickyOffsets, 0);
    drawSpotsForArea(activeArea); // 初回は station だけ描画
    applyFilters();
  });
