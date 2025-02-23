import { FrozenTreeViewLayout } from './FrozenTreeViewLayout';

export class FrozenTreeViewHScrollbar {
  public svgLeftArrow: SVGSVGElement;
  public svgRightArrow: SVGSVGElement;
  public thumbTrack: HTMLDivElement;
  public thumb: HTMLDivElement;

  constructor(private layout: FrozenTreeViewLayout) {
    // Create SVG left arrow
    this.svgLeftArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgLeftArrow.setAttribute('width', '20');
    this.svgLeftArrow.setAttribute('height', '16');
    this.svgLeftArrow.setAttribute('viewBox', '0 0 20 16');
    this.svgLeftArrow.style.position = 'absolute';
    this.svgLeftArrow.style.top = '0px';
    this.svgLeftArrow.style.left = '0px';

    const leftPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leftPath.setAttribute('d', 'M2 8l8-6v12z');
    leftPath.setAttribute('fill', 'black');

    this.svgLeftArrow.appendChild(leftPath);
    this.layout.horizontalScrollbar.appendChild(this.svgLeftArrow);

    this.svgLeftArrow.addEventListener('click', () => {
      console.log("Left arrow clicked");
      let grid = this.layout.frozenTreeView.grid;
      let columnIncrement = -grid.scrollColumnIncrement;
      grid.firstVisibleTreeColumn = grid.firstVisibleTreeColumn + columnIncrement;
      grid.scrollDown();
    });

    // Create SVG right arrow
    this.svgRightArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgRightArrow.setAttribute('width', '20');
    this.svgRightArrow.setAttribute('height', '16');
    this.svgRightArrow.setAttribute('viewBox', '0 0 20 16');
    this.svgRightArrow.style.position = 'absolute';
    this.svgRightArrow.style.top = '0px';
    this.svgRightArrow.style.right = '0px';

    const rightPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rightPath.setAttribute('d', 'M18 8l-8-6v12z');
    rightPath.setAttribute('fill', 'black');

    this.svgRightArrow.appendChild(rightPath);
    this.layout.horizontalScrollbar.appendChild(this.svgRightArrow);

    this.svgRightArrow.addEventListener('click', () => {
      console.log("Right arrow clicked");
      let grid = this.layout.frozenTreeView.grid;
      let columnIncrement = grid.scrollColumnIncrement;
      grid.firstVisibleTreeColumn = grid.firstVisibleTreeColumn + columnIncrement;
      grid.scrollDown();

    });

    // Create thumbTrack
    this.thumbTrack = document.createElement('div');
    this.thumbTrack.style.position = 'absolute';
    this.thumbTrack.style.top = '4px';
    this.thumbTrack.style.bottom = '4px';
    this.thumbTrack.style.left = '16px';
    this.thumbTrack.style.right = '16px';
    this.thumbTrack.style.backgroundColor = 'lightgray';
    this.layout.horizontalScrollbar.appendChild(this.thumbTrack);

    this.thumbTrack.addEventListener('click', this.onThumbTrackClick.bind(this));

    // Create thumb
    this.thumb = document.createElement('div');
    this.thumb.style.position = 'absolute';
    this.thumb.style.left = '0px';
    this.thumb.style.top = '0px';
    this.thumb.style.bottom = '0px';
    this.thumb.style.width = '100px';
    this.thumb.style.backgroundColor = 'darkgray';
    this.thumbTrack.appendChild(this.thumb);

    // Enable dragging of thumb
    this.thumb.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
  }

  private onThumbMouseDown(event: MouseEvent) {
    event.preventDefault();
    const startX = event.clientX;
    const startLeft = this.thumb.offsetLeft;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      let newLeft = startLeft + deltaX;
      const maxLeft = this.thumbTrack.clientWidth - this.thumb.clientWidth;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      this.thumb.style.left = `${newLeft}px`;

      // Log the left position of the thumb and the width difference
      console.log(`Thumb left position: ${newLeft}px`);
      console.log(`Width difference: ${this.thumbTrack.getBoundingClientRect().width - this.thumb.clientWidth}px`);

      let grid = this.layout.frozenTreeView.grid;
      grid.firstVisibleTreeColumn = Math.floor((grid.virtualColumnCount*newLeft)/(this.thumbTrack.getBoundingClientRect().width - this.thumb.clientWidth));
      if(grid.firstVisibleTreeColumn == 0) grid.firstVisibleTreeColumn = 1;
      console.log(`${grid.firstVisibleTreeColumn} = Math.floor((${grid.virtualColumnCount}*${newLeft})/(${this.thumbTrack.getBoundingClientRect().width} - ${this.thumb.clientWidth}));`);
      grid.scrollDown();
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private onThumbTrackClick(event: MouseEvent) {
    const thumbRect = this.thumb.getBoundingClientRect();
    const trackRect = this.thumbTrack.getBoundingClientRect();

    if (event.clientX < thumbRect.left) {
      console.log("Page left");
      let grid = this.layout.frozenTreeView.grid;
      let columnIncrement = -(grid.columnsPerPage - 1);
      grid.firstVisibleTreeColumn = grid.firstVisibleTreeColumn + columnIncrement;
      grid.scrollDown();
    } else if (event.clientX > thumbRect.right) {
      console.log("Page right");
      let grid = this.layout.frozenTreeView.grid;
      let columnIncrement = (grid.columnsPerPage - 1);
      grid.firstVisibleTreeColumn = grid.firstVisibleTreeColumn + columnIncrement;
      grid.scrollDown();
    }
  }
}
