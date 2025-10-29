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
