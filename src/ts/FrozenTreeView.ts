import { FrozenTreeViewLayout } from './FrozenTreeViewLayout';
import { FrozenTreeViewVScrollbar } from './FrozenTreeViewVScrollbar';
import { FrozenTreeViewHScrollbar } from './FrozenTreeViewHScrollbar';
import { FrozenTreeViewGrid } from './FrozenTreeViewGrid';

export class FrozenTreeView {
  public layout: FrozenTreeViewLayout;
  public vScrollbar: FrozenTreeViewVScrollbar;
  public hScrollbar: FrozenTreeViewHScrollbar;
  public grid: FrozenTreeViewGrid;

  constructor(private parentElement: HTMLElement) {
    const frozenWidth = '600px';
    const textHeight = '16px';

    this.layout = new FrozenTreeViewLayout(
      parentElement,
      frozenWidth,
      textHeight,
      this
    );

    this.vScrollbar = new FrozenTreeViewVScrollbar(this.layout);
    this.hScrollbar = new FrozenTreeViewHScrollbar(this.layout);
    this.grid = new FrozenTreeViewGrid(this);
  }
}
