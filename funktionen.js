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
        this.bindEvents();
        this.loadNews(); // Initial load
    },

    bindEvents() {
        // Form submission
        this.newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveNews();
        });

        // Tab switch handlers
        document.getElementById('news-btn').addEventListener('click', () => this.loadNews());
        document.getElementById('view-news-btn').addEventListener('click', () => this.loadNews());
    },

    async loadNews() {
        try {
            const response = await fetch('news.json?t=' + new Date().getTime()); // Prevent caching
            const data = await response.json();
            
            this.newsContainer.innerHTML = data.news.map(item => `
                <article class="news-card">
                    <time>${this.formatDate(item.date)}</time>
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </article>
            `).join('');
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsContainer.innerHTML = '<p>Fehler beim Laden der News.</p>';
        }
    },

    async saveNews() {
        const titleInput = document.getElementById('news-title');
        const contentInput = document.getElementById('news-content');
        
        try {
            const response = await fetch('save_news.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleInput.value,
                    content: contentInput.value
                })
            });

            const result = await response.json();
            
            if (result.success) {
                titleInput.value = '';
                contentInput.value = '';
                
                // Switch to view tab and reload news
                document.getElementById('view-news-btn').click();
                await this.loadNews();
            } else {
                alert('Fehler beim Speichern: ' + (result.error || 'Unbekannter Fehler'));
            }
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Fehler beim Speichern der News');
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
