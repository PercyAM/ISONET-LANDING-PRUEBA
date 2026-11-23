(() => {
  const init = () => {
    document.querySelectorAll('#soluciones .home-solutions-tabs').forEach((root) => {
      if (root.dataset.tabsReady) return;
      root.dataset.tabsReady = 'true';
      const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
      const activate = (tab, moveFocus = false) => {
        tabs.forEach((item) => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
          const panel = root.querySelector(`#${CSS.escape(item.getAttribute('aria-controls'))}`);
          if (panel) panel.hidden = !selected;
        });
        if (moveFocus) tab.focus();
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activate(tab));
        tab.addEventListener('keydown', (event) => {
          let next = index;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          else return;
          event.preventDefault();
          activate(tabs[next], true);
        });
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('isonet:navigated', init);
})();
