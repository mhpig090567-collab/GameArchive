/* ============================================
   GameVerse — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  let allGames = [];
  let currentCategory = 'all';
  let currentSlide = 0;
  let heroInterval = null;

  // ---- DOM References ----
  const gamesGrid = document.getElementById('games-grid');
  const gamesCount = document.getElementById('games-count');
  const categoriesList = document.getElementById('categories-list');
  const searchInput = document.getElementById('search-input');
  const heroSlider = document.getElementById('hero-slider');
  const heroDots = document.getElementById('hero-dots');
  const heroPrev = document.getElementById('hero-prev');
  const heroNext = document.getElementById('hero-next');

  // ---- Init ----
  async function init() {
    try {
      const res = await fetch('data/games.json');
      const data = await res.json();
      allGames = data.games;
    } catch {
      allGames = [];
    }
    renderHero();
    renderGames(allGames);
    bindEvents();
    startHeroAutoplay();
  }

  // ============================================
  // HERO SLIDER
  // ============================================
  function renderHero() {
    const featured = allGames.filter(g => g.featured);
    if (featured.length === 0) return;

    // Remove existing slides (keep arrows)
    heroSlider.querySelectorAll('.hero__slide').forEach(s => s.remove());

    featured.forEach((game, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero__slide' + (i === 0 ? ' hero__slide--active' : '');
      slide.innerHTML = `
        <img class="hero__slide-bg" src="${game.thumbnail}" alt="${game.title}" loading="lazy">
        <div class="hero__slide-overlay"></div>
        <div class="hero__slide-content">
          <span class="hero__slide-tag">⭐ 추천 게임</span>
          <h2 class="hero__slide-title">${game.title}</h2>
          <p class="hero__slide-desc">${game.description}</p>
          <button class="hero__slide-cta" data-game-id="${game.id}">▶ 지금 플레이</button>
        </div>
      `;
      // Insert before arrows
      heroSlider.insertBefore(slide, heroPrev);
    });

    // Dots
    heroDots.innerHTML = '';
    featured.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' hero__dot--active' : '');
      dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      heroDots.appendChild(dot);
    });
  }

  function goToSlide(index) {
    const slides = heroSlider.querySelectorAll('.hero__slide');
    const dots = heroDots.querySelectorAll('.hero__dot');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('hero__slide--active');
    dots[currentSlide].classList.remove('hero__dot--active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('hero__slide--active');
    dots[currentSlide].classList.add('hero__dot--active');
  }

  function startHeroAutoplay() {
    stopHeroAutoplay();
    heroInterval = setInterval(() => {
      const slides = heroSlider.querySelectorAll('.hero__slide');
      goToSlide(currentSlide + 1);
    }, 5000);
  }

  function stopHeroAutoplay() {
    if (heroInterval) {
      clearInterval(heroInterval);
      heroInterval = null;
    }
  }

  // ============================================
  // GAMES GRID
  // ============================================
  function renderGames(games) {
    gamesGrid.innerHTML = '';
    gamesCount.textContent = `${games.length}개의 게임`;

    if (games.length === 0) {
      gamesGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">
          😢 조건에 맞는 게임이 없습니다.
        </div>
      `;
      return;
    }

    games.forEach((game, i) => {
      const card = document.createElement('article');
      card.className = 'game-card';
      card.style.animationDelay = `${i * 0.08}s`;
      card.setAttribute('data-game-id', game.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${game.title} 플레이`);

      card.innerHTML = `
        <div class="game-card__image-wrap">
          <img class="game-card__image" src="${game.thumbnail}" alt="${game.title}" loading="lazy">
          <div class="game-card__play-overlay">
            <div class="game-card__play-btn">▶</div>
          </div>
        </div>
        <div class="game-card__info">
          <h3 class="game-card__title">${game.title}</h3>
          <span class="game-card__category">${getCategoryLabel(game.category)}</span>
        </div>
      `;

      gamesGrid.appendChild(card);
    });
  }

  function getCategoryLabel(cat) {
    const labels = {
      arcade: '🕹️ 아케이드',
      puzzle: '🧩 퍼즐',
      strategy: '♟️ 전략',
      multiplayer: '👥 멀티플레이어'
    };
    return labels[cat] || cat;
  }

  function filterGames() {
    let filtered = allGames;

    // Category filter
    if (currentCategory !== 'all') {
      filtered = filtered.filter(g => g.category === currentCategory);
    }

    // Search filter
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(g =>
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query)
      );
    }

    renderGames(filtered);
  }

  // ============================================
  // EVENT BINDINGS
  // ============================================
  function bindEvents() {
    // Category buttons
    categoriesList.addEventListener('click', (e) => {
      const btn = e.target.closest('.categories__btn');
      if (!btn) return;

      categoriesList.querySelectorAll('.categories__btn').forEach(b => {
        b.classList.remove('categories__btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('categories__btn--active');
      btn.setAttribute('aria-selected', 'true');

      currentCategory = btn.dataset.category;
      filterGames();
    });

    // Search input
    searchInput.addEventListener('input', filterGames);

    // Hero arrows
    heroPrev.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startHeroAutoplay(); // reset timer
    });

    heroNext.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startHeroAutoplay();
    });

    // Game card click
    gamesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.game-card');
      if (!card) return;
      const gameId = card.dataset.gameId;
      handleGameLaunch(gameId);
    });

    // Hero CTA click
    heroSlider.addEventListener('click', (e) => {
      const cta = e.target.closest('.hero__slide-cta');
      if (!cta) return;
      const gameId = cta.dataset.gameId;
      handleGameLaunch(gameId);
    });

    // Keyboard support for game cards
    gamesGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.game-card');
        if (card) {
          e.preventDefault();
          handleGameLaunch(card.dataset.gameId);
        }
      }
    });
  }

  function handleGameLaunch(gameId) {
    const game = allGames.find(g => g.id === gameId);
    if (!game) return;
    // Placeholder: future game launch logic
    alert(`🎮 "${game.title}" 게임을 시작합니다!\n\n(게임 실행 화면은 추후 구현 예정)`);
  }

  // ---- Start ----
  document.addEventListener('DOMContentLoaded', init);
})();
