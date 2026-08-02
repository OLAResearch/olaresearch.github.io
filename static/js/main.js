/* 
   BibTeX Copy to Clipboard 
   Usage: Requires a button with class "copy-button" and a target element with ID "bibtex-code"
*/
function copyTextToClipboard(text, successCallback) {
  let successful = false;
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    successful = document.execCommand('copy');
    document.body.removeChild(textArea);
  } catch (err) {
    console.error('Fallback copy threw error: ', err);
  }

  if (successful) {
    successCallback();
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(successCallback)
      .catch(err => {
        console.error('Clipboard API copy failed: ', err);
      });
  } else {
    console.error('All clipboard copy methods failed');
  }
}

function copyBibTeX() {
  const bibtexCode = document.getElementById('bibtex-code');
  if (!bibtexCode) return;
  
  const text = bibtexCode.innerText;
  copyTextToClipboard(text, () => {
    const button = document.querySelector('.copy-button');
    if (!button) return;
    
    const originalText = button.innerText;
    button.innerText = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.innerText = originalText;
      button.classList.remove('copied');
    }, 2000);
  });
}

/* Mobile Navigation Hamburger Menu Toggle (Event Delegation) */
document.addEventListener('click', (e) => {
  const burger = e.target.closest('.navbar-burger');
  if (burger) {
    const menu = document.querySelector('.navbar-menu');
    if (menu) {
      menu.classList.toggle('is-active');
      const icon = burger.querySelector('i');
      if (icon) {
        if (menu.classList.contains('is-active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    }
  }
});

/* Normalize pathnames for reliable comparison (e.g. '/' and '/index.html' match) */
const normalizePath = (path) => {
  let p = path;
  if (p.endsWith('/')) p += 'index.html';
  if (!p.startsWith('/')) p = '/' + p;
  return p;
};

/* Modern UX View Transitions SPA Router */
const handleNavigation = async (url, hash = '') => {
  if (!document.startViewTransition) {
    window.location.href = url + hash;
    return;
  }

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Fetch failed');
    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    document.startViewTransition(() => {
      document.title = doc.title;
      document.head.innerHTML = doc.head.innerHTML;
      document.body.innerHTML = doc.body.innerHTML;
      
      if (hash) {
        const id = hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      } else {
        window.scrollTo(0, 0);
      }
      if (typeof initMermaid === 'function') initMermaid();
    });
  } catch (err) {
    console.error('Navigation transition failed:', err);
    window.location.href = url + hash;
  }
};

// Intercept local link clicks
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link) {
    const targetUrl = link.href;
    
    // Safety check for empty links/anchors
    if (!targetUrl || targetUrl.startsWith('javascript:')) return;
    
    try {
      const urlObj = new URL(targetUrl);
      
      // Check if it is same-origin, not a download link, and doesn't have target="_blank"
      if (
        urlObj.origin === window.location.origin &&
        !link.hasAttribute('download') &&
        link.getAttribute('target') !== '_blank'
      ) {
        const currentUrl = new URL(window.location.href);
        const normalizedCurrent = normalizePath(currentUrl.pathname);
        const normalizedTarget = normalizePath(urlObj.pathname);
        
        if (normalizedCurrent === normalizedTarget) {
          // Same page link
          if (urlObj.hash) {
            e.preventDefault();
            const id = urlObj.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, null, urlObj.hash);
            }
            
            // Close mobile menu if open
            const menu = document.querySelector('.navbar-menu');
            if (menu) {
              menu.classList.remove('is-active');
              const burger = document.querySelector('.navbar-burger i');
              if (burger) {
                burger.classList.remove('fa-times');
                burger.classList.add('fa-bars');
              }
            }
          }
        } else {
          // Different page link (either with or without hash)
          e.preventDefault();
          const pathAndHash = urlObj.pathname + urlObj.search + urlObj.hash;
          window.history.pushState({}, '', pathAndHash);
          handleNavigation(urlObj.pathname + urlObj.search, urlObj.hash);
        }
      }
    } catch (err) {
      // Ignored for non-standard URLs
    }
  }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const currentUrl = new URL(window.location.href);
  handleNavigation(currentUrl.pathname + currentUrl.search, currentUrl.hash);
});

/* Publications Page Functionality (Persists across SPA navigations) */
function toggleBibtex(key) {
  const box = document.getElementById(`bib-${key}`);
  const btn = document.getElementById(`btn-${key}`);
  if (box && btn) {
    const isShown = box.classList.contains('show');
    if (isShown) {
      box.classList.remove('show');
      btn.classList.remove('active');
    } else {
      box.classList.add('show');
      btn.classList.add('active');
      
      const pre = document.getElementById(`code-${key}`);
      if (pre) {
        copyTextToClipboard(pre.innerText, () => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        });
      }
    }
  }
}

function copyBibtexCode(key) {
  const pre = document.getElementById(`code-${key}`);
  const copyBtn = document.getElementById(`copy-btn-${key}`);
  if (pre && copyBtn) {
    const text = pre.innerText;
    copyTextToClipboard(text, () => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    });
  }
}

function filterPublications() {
  const searchInput = document.getElementById('pub-search');
  if (!searchInput) return;
  const searchQuery = searchInput.value.toLowerCase().trim();
  
  const activePill = document.querySelector('.filter-pill.active');
  const activeFilter = activePill ? activePill.dataset.filter : 'all';

  const pubItems = document.querySelectorAll('.publication-item');
  const yearGroups = document.querySelectorAll('.year-group');

  pubItems.forEach(item => {
    const title = item.dataset.title.toLowerCase();
    const authors = item.dataset.authors.toLowerCase();
    const venue = item.dataset.venue.toLowerCase();
    const year = item.dataset.year;
    
    const matchesSearch = title.includes(searchQuery) || 
                          authors.includes(searchQuery) || 
                          venue.includes(searchQuery) || 
                          year.includes(searchQuery);
                          
    const matchesFilter = activeFilter === 'all' || year === activeFilter;

    if (matchesSearch && matchesFilter) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

  yearGroups.forEach(group => {
    const items = group.querySelectorAll('.publication-item');
    let hasVisible = false;
    items.forEach(item => {
      if (item.style.display !== 'none') {
        hasVisible = true;
      }
    });
    if (hasVisible) {
      group.style.display = 'block';
    } else {
      group.style.display = 'none';
    }
  });
}

// Event Delegation for Publications Page Search & Filtering
document.addEventListener('input', (e) => {
  if (e.target && e.target.id === 'pub-search') {
    filterPublications();
  }
});

document.addEventListener('click', (e) => {
  const pill = e.target.closest('.filter-pill');
  if (pill) {
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    filterPublications();
  }
});

/* Mermaid initialization for SPA and initial load */
async function initMermaid() {
  if (document.querySelector('.mermaid')) {
    try {
      const { default: mermaid } = await import('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs');
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: 'base',
        themeVariables: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '18px',
          primaryColor: '#fdfdfd',
          primaryTextColor: '#333333',
          primaryBorderColor: '#e2e8f0',
          lineColor: '#cbd5e1',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#ffffff',
          cScale0: '#E6F4EA',
          cScale1: '#FCE8E6',
          cScale2: '#E8F0FE',
          cScale3: '#FEF7E0',
          cScale4: '#F3E8FD',
          cScale5: '#E0F2F1'
        }
      });
      await mermaid.run({ querySelector: '.mermaid' });
    } catch (err) {
      console.error('Mermaid init failed', err);
    }
  }
}
document.addEventListener('DOMContentLoaded', initMermaid);
