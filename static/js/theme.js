/*
   Light / dark theme
   The site follows the visitor's OS setting. The navbar toggle overrides it,
   and the choice is remembered in this browser; picking the theme the OS
   already asks for drops the override, so the site follows the OS again.

   Load this synchronously in <head>, before static/css/index.css, so a stored
   choice is applied before the first paint (no flash of the wrong theme).
   The colours themselves live in index.css under [data-theme].
*/
(function () {
  var root = document.documentElement;
  var KEY = 'olar-theme';
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try {
      if (value) localStorage.setItem(KEY, value);
      else localStorage.removeItem(KEY);
    } catch (e) { /* private mode or blocked storage: the toggle still works for this page */ }
  }
  function systemTheme() { return mq && mq.matches ? 'dark' : 'light'; }
  function current() { return root.getAttribute('data-theme') || systemTheme(); }

  var stored = read();
  if (stored === 'light' || stored === 'dark') root.setAttribute('data-theme', stored);

  var ICONS =
    '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
    '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';

  function label(button) {
    var text = current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    button.setAttribute('aria-label', text);
    button.setAttribute('title', text);
  }

  function mount() {
    var nav = document.querySelector('.navbar');
    if (!nav || nav.querySelector('.theme-toggle')) return;
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML = ICONS;
    label(button);
    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      if (next === systemTheme()) {
        root.removeAttribute('data-theme');
        write(null);
      } else {
        root.setAttribute('data-theme', next);
        write(next);
      }
      label(button);
    });
    nav.appendChild(button);
  }

  // main.js navigates between pages by swapping document.body.innerHTML (a
  // view-transition router). Scripts in swapped-in HTML never run, so this
  // file is not re-executed on those navigations: watch the body and put the
  // button back whenever a new navbar arrives without one. data-theme lives on
  // <html>, which the router keeps, so the theme itself carries over.
  function start() {
    mount();
    // Keep the label right if the OS theme flips while the page is open
    if (mq) {
      var onChange = function () {
        var button = document.querySelector('.theme-toggle');
        if (button) label(button);
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
    if (window.MutationObserver) {
      new MutationObserver(mount).observe(document.body, { childList: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
