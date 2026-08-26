(() => {
  const data = window.__vmIconGenClick;
  if (!data?.selector) return;
  const btn = document.querySelector(data.selector);
  if (!btn) return;

  btn.focus();
  for (const type of ['pointerover', 'pointerenter', 'pointerdown', 'mouseover', 'mouseenter', 'mousedown', 'mouseup', 'pointerup', 'click']) {
    const EventClass = type.startsWith('pointer') ? PointerEvent : MouseEvent;
    btn.dispatchEvent(new EventClass(type, { bubbles: true, cancelable: true, view: window }));
  }
  btn.click();
})();
