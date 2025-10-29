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
    },

    async saveNews() {
        const titleInput = document.getElementById('news-title');
        const dateInput = document.getElementById('news-date');
        const imageInput = document.getElementById('news-image');
        const excerptInput = document.getElementById('news-excerpt');
        const contentInput = document.getElementById('news-content');
        
        try {
            const response = await fetch('save_news.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleInput.value,
                    date: dateInput.value,
                    image: imageInput.value,
                    excerpt: excerptInput.value,
                    content: contentInput.value
                })
            });

            const result = await response.json();
            
            if (result.success) {
                // Reset form
                [titleInput, dateInput, imageInput, excerptInput, contentInput].forEach(input => input.value = '');
                await this.loadNews();
            } else {
                alert('Fehler beim Speichern: ' + (result.error || 'Unbekannter Fehler'));
            }
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Fehler beim Speichern der News');
        }
    },

    async loadNews() {
        try {
            const response = await fetch('news.json?t=' + new Date().getTime());
            const data = await response.json();
            
            this.newsContainer.innerHTML = data.news.map(item => `
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
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsContainer.innerHTML = '<p>Fehler beim Laden der News.</p>';
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
