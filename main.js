let TAGS = [];
let SPOTS = [];

function drawTagButtons() {
  const tagFilter = document.querySelector('.tag-filter');
  let html = '<span>ジャンル:</span>';
  html += '<button class="tag-btn active" data-tag="all">全て</button>';
  TAGS.forEach(t => {
      html += `<button class="tag-btn" data-tag="${t.id}">${t.label}</button>`;
  });
  tagFilter.innerHTML = html;
}

function drawSpots() {
  document.querySelectorAll('section[data-area]').forEach(sec => sec.innerHTML = '');
  const spotsByArea = {};
  SPOTS.forEach(s => {
      if (!spotsByArea[s.area]) spotsByArea[s.area] = [];
      spotsByArea[s.area].push(s);
  });
  Object.keys(spotsByArea).forEach(area => {
      const section = document.getElementById(area);
      if (!section) return;
      let html = `<h2>${section.dataset.title}</h2><ul>`;
      spotsByArea[area].forEach(spot => {
          html += `<li class="spot" data-tags="${spot.tags.join(' ')}">
              <strong>${spot.name}</strong>
              <span style="font-size:90%;">（${spot.desc}）</span>
              <a href="${spot.url}" target="_blank">地図</a>
              <span class="tags">${
              spot.tags.map(tid => `<span>${TAGS.find(t => t.id === tid).label}</span>`).join('')
              }</span>
          </li>`;
      });
      html += '</ul>';
      section.innerHTML = html;
  });
}

function setupFiltering() {
  drawTagButtons();
  drawSpots();

  const tagBtns = document.querySelectorAll('.tag-btn');
  tagBtns.forEach(btn => {
      btn.addEventListener('click', function () {
          tagBtns.forEach(b => b.classList.remove('active'));
          this.classList.add('active');
          const tag = this.dataset.tag;
          document.querySelectorAll('.spot').forEach(spot => {
              if(tag === 'all') {
                  spot.style.display = '';
              } else {
                  spot.style.display = spot.dataset.tags.split(' ').includes(tag) ? '' : 'none';
              }
          });
      });
  });
}

// JSONファイルをロードして開始
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    TAGS = data.tags;
    SPOTS = data.spots;
    setupFiltering();
  });
