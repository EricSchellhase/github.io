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

// News functionality
(function() {
    const newsContainer = document.getElementById('news-container');
    const newsForm = document.getElementById('news-form');

    async function loadNews() {
        try {
            const response = await fetch('news.json');
            const data = await response.json();
            
            newsContainer.innerHTML = data.news.map(item => `
                <article class="news-card">
                    <time>${formatDate(item.date)}</time>
                    <h3>${item.title}</h3>
                    <p>${item.content}</p>
                </article>
            `).join('');
        } catch (error) {
            console.error('Error loading news:', error);
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('news-title').value;
        const content = document.getElementById('news-content').value;

        try {
            const response = await fetch('save_news.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content })
            });

            const result = await response.json();
            
            if (result.success) {
                newsForm.reset();
                loadNews();
            }
        } catch (error) {
            console.error('Error saving news:', error);
        }
    });

    // Load news when the tab is shown
    document.getElementById('news-btn').addEventListener('click', loadNews);
    
    // Initial load if news tab is active
    if (document.getElementById('news-tab').classList.contains('active')) {
        loadNews();
    }
})();
