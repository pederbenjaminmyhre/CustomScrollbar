import { FrozenTreeView } from './FrozenTreeView';

let frozenTreeView: FrozenTreeView | null = null;

document.addEventListener('DOMContentLoaded', () => {
  const parentElement = document.querySelector('.frozen-treeview-container') as HTMLElement;
  if (parentElement) {
    frozenTreeView = new FrozenTreeView(parentElement);
  }
});

// You can now reference frozenTreeView outside the event handler



