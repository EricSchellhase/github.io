// Theme toggle logic: speichert Auswahl in localStorage, nutzt System-Default falls nicht gesetzt
(function () {
  const btn = document.getElementById('theme-toggle');
  const body = document.body;

  function applyTheme(theme) {
    if (theme === 'night') {
      body.classList.add('night');
      btn.textContent = '☀️';
      btn.setAttribute('aria-label', 'Wechsel zu Hellmodus');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      body.classList.remove('night');
      btn.textContent = '🌙';
      btn.setAttribute('aria-label', 'Wechsel zu Nachtmodus');
      btn.setAttribute('aria-pressed', 'false');
    }
    localStorage.setItem('theme', theme);
  }

  // Initial: gespeicherte Einstellung oder System-Preference
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefersDark ? 'night' : 'light'));

  btn.addEventListener('click', () => {
    applyTheme(body.classList.contains('night') ? 'light' : 'night');
  });
})();

// Tab functionality
(function() {
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  function switchTab(oldTab, newTab) {
    newTab.focus();
    newTab.setAttribute('aria-selected', 'true');
    oldTab.setAttribute('aria-selected', 'false');
    oldTab.focus();
    
    const newPanelId = newTab.getAttribute('aria-controls');
    const newPanel = document.getElementById(newPanelId);
    const oldPanelId = oldTab.getAttribute('aria-controls');
    const oldPanel = document.getElementById(oldPanelId);

    oldPanel.classList.remove('active');
    newPanel.classList.add('active');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', e => {
      const currentTab = document.querySelector('[aria-selected="true"]');
      if (e.currentTarget !== currentTab) {
        switchTab(currentTab, e.currentTarget);
      }
    });
  });
})();

// Subtabs functionality
(function() {
    const subtabs = document.querySelectorAll('.subtabs-nav button');
    
    function switchSubTab(oldTab, newTab) {
        newTab.setAttribute('aria-selected', 'true');
        oldTab.setAttribute('aria-selected', 'false');
        
        const newPanelId = newTab.getAttribute('aria-controls');
        const oldPanelId = oldTab.getAttribute('aria-controls');
        
        document.getElementById(oldPanelId).classList.remove('active');
        document.getElementById(newPanelId).classList.add('active');
    }
    
    subtabs.forEach(tab => {
        tab.addEventListener('click', e => {
            const currentTab = document.querySelector('.subtabs-nav button[aria-selected="true"]');
            if (e.currentTarget !== currentTab) {
                switchSubTab(currentTab, e.currentTarget);
            }
        });
    });
})();

// News functionality
const newsHandler = {
    init() {
        this.newsContainer = document.getElementById('news-container');
        this.newsForm = document.getElementById('news-form');
        
        if (!this.newsContainer || !this.newsForm) {
            console.error('News container oder form nicht gefunden');
            return;
        }
        
        this.bindEvents();
        this.loadNews();
    },

    bindEvents() {
        this.newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveNews();
        });
    },

    async loadNews() {
        try {
            // Versuche zuerst JSON zu laden
            const response = await fetch('assets/news.json?t=' + new Date().getTime());
            if (response.ok) {
                const data = await response.json();
                this.renderNews(data.news);
            } else {
                // Fallback: Lade aus localStorage
                this.loadFromLocalStorage();
            }
        } catch (error) {
            console.log('JSON nicht verfügbar, lade aus localStorage');
            this.loadFromLocalStorage();
        }
    },

    loadFromLocalStorage() {
        const stored = localStorage.getItem('news');
        const news = stored ? JSON.parse(stored) : [];
        this.renderNews(news);
    },

    renderNews(news) {
        this.newsContainer.innerHTML = news.map(item => `
            <article class="news-card">
                <img src="${item.image}" alt="" class="news-image">
                <div class="news-content">
                    <time>${this.formatDate(item.date)}</time>
                    <h3>${item.title}</h3>
                    <p class="news-excerpt">${item.excerpt}</p>
                    <p class="news-full">${item.content}</p>
                </div>
            </article>
        `).join('');
    },

    async saveNews() {
        const titleInput = document.getElementById('news-title');
        const dateInput = document.getElementById('news-date');
        const imageInput = document.getElementById('news-image');
        const excerptInput = document.getElementById('news-excerpt');
        const contentInput = document.getElementById('news-content');
        
        if (!titleInput.value || !dateInput.value || !imageInput.value || !excerptInput.value || !contentInput.value) {
            alert('Bitte alle Felder ausfüllen');
            return;
        }
        
        try {
            // Lade existierende News aus localStorage
            const stored = localStorage.getItem('news');
            const news = stored ? JSON.parse(stored) : [];
            
            // Generiere neue ID
            const maxId = news.length > 0 ? Math.max(...news.map(n => n.id || 0)) : 0;
            
            const newItem = {
                id: maxId + 1,
                title: titleInput.value,
                date: dateInput.value,
                image: imageInput.value,
                excerpt: excerptInput.value,
                content: contentInput.value
            };
            
            // Füge am Anfang hinzu
            news.unshift(newItem);
            
            // Speichere in localStorage (max 10 News)
            localStorage.setItem('news', JSON.stringify(news.slice(0, 10)));
            
            // Reset form
            [titleInput, dateInput, imageInput, excerptInput, contentInput].forEach(input => input.value = '');
            alert('News erfolgreich hinzugefügt!');
            await this.loadNews();
            
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Fehler beim Speichern der News: ' + error.message);
        }
    },

    formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('de-DE', options);
    }
};

// Initialize news functionality after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    newsHandler.init();
});
