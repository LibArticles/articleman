
import { modifier } from 'ember-modifier';

export default modifier((element: HTMLElement, [callback]: [() => void]) => {
  function handleClick(event: MouseEvent) {
    if (!element.contains(event.target as Node)) {
      callback();
    }
  }

  document.addEventListener('click', handleClick);

  return () => {
    document.removeEventListener('click', handleClick);
  };
});
