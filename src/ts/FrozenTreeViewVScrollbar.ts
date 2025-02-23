import { FrozenTreeViewLayout } from './FrozenTreeViewLayout';

export class FrozenTreeViewVScrollbar {
  public svgUpArrow: SVGSVGElement;
  public svgDownArrow: SVGSVGElement;
  public thumbTrack: HTMLDivElement;
  public thumb: HTMLDivElement;

  constructor(private layout: FrozenTreeViewLayout) {
    // Create SVG up arrow
    this.svgUpArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgUpArrow.setAttribute('width', '16');
    this.svgUpArrow.setAttribute('height', '20');
    this.svgUpArrow.setAttribute('viewBox', '0 0 16 20');
    this.svgUpArrow.style.position = 'absolute';
    this.svgUpArrow.style.top = '0px';
    this.svgUpArrow.style.left = '0px';

    const upPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    upPath.setAttribute('d', 'M8 2l6 8H2z');
    upPath.setAttribute('fill', 'black');

    this.svgUpArrow.appendChild(upPath);
    this.layout.verticalScrollbar.appendChild(this.svgUpArrow);

    this.svgUpArrow.addEventListener('click', () => {
      console.log("Up arrow clicked");
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = -grid.verticalArrow_RowIncrement;
      grid.firstVisibleTreeRow = grid.firstVisibleTreeRow + recordIncrement;
      grid.scrollDown();
    });

    // Create SVG down arrow
    this.svgDownArrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgDownArrow.setAttribute('width', '16');
    this.svgDownArrow.setAttribute('height', '20');
    this.svgDownArrow.setAttribute('viewBox', '0 0 16 20');
    this.svgDownArrow.style.position = 'absolute';
    this.svgDownArrow.style.bottom = '0px';
    this.svgDownArrow.style.left = '0px';

    const downPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    downPath.setAttribute('d', 'M8 18l6-8H2z');
    downPath.setAttribute('fill', 'black');

    this.svgDownArrow.appendChild(downPath);
    this.layout.verticalScrollbar.appendChild(this.svgDownArrow);

    this.svgDownArrow.addEventListener('click', () => {
      console.log("Down arrow clicked");
      console.log(`this.layout.frozenTreeView.grid.verticalArrow_RowIncrement: ${this.layout.frozenTreeView.grid.verticalArrow_RowIncrement}`);
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = grid.verticalArrow_RowIncrement;
      grid.firstVisibleTreeRow = grid.firstVisibleTreeRow + recordIncrement;
      grid.scrollDown();
    });

    // Create thumbTrack
    this.thumbTrack = document.createElement('div');
    this.thumbTrack.style.position = 'absolute';
    this.thumbTrack.style.top = '16px';
    this.thumbTrack.style.bottom = '16px';
    this.thumbTrack.style.left = '4px';
    this.thumbTrack.style.right = '4px';
    this.thumbTrack.style.backgroundColor = 'lightgray';
    this.layout.verticalScrollbar.appendChild(this.thumbTrack);

    this.thumbTrack.addEventListener('click', this.onThumbTrackClick.bind(this));

    // Create thumb
    this.thumb = document.createElement('div');
    this.thumb.style.position = 'absolute';
    this.thumb.style.left = '0px';
    this.thumb.style.top = '0px';
    this.thumb.style.right = '0px';
    this.thumb.style.height = '100px';
    this.thumb.style.backgroundColor = 'darkgray';
    this.thumbTrack.appendChild(this.thumb);

    // Enable dragging of thumb
    this.thumb.addEventListener('mousedown', this.onThumbMouseDown.bind(this));
  }

  private onThumbMouseDown(event: MouseEvent) {
    event.preventDefault();
    const startY = event.clientY;
    const startTop = this.thumb.offsetTop;

    const onMouseMove = (moveEvent: MouseEvent) => {
        const deltaY = moveEvent.clientY - startY;
        let newTop = startTop + deltaY;
        const maxTop = this.thumbTrack.clientHeight - this.thumb.clientHeight;
        newTop = Math.max(0, Math.min(newTop, maxTop));
        this.thumb.style.top = `${newTop}px`;

        // Log the top position of the thumb and the height difference
        console.log(`Thumb top position: ${newTop}px`);
        console.log(`Height difference: ${this.thumbTrack.getBoundingClientRect().height - this.thumb.clientHeight}px`);

        let grid = this.layout.frozenTreeView.grid;
        grid.firstVisibleTreeRow = Math.floor((grid.virtualRecordCount*newTop)/(this.thumbTrack.getBoundingClientRect().height - this.thumb.clientHeight));
        console.log(`${grid.firstVisibleTreeRow} = Math.floor((${grid.virtualRecordCount}*${newTop})/(${this.thumbTrack.getBoundingClientRect().height} - ${this.thumb.clientHeight}));`);
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

    if (event.clientY < thumbRect.top) {
      console.log("Page up");
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = -(grid.recordsPerPage - 1);
      grid.firstVisibleTreeRow = grid.firstVisibleTreeRow + recordIncrement;
      grid.scrollDown();
    } else if (event.clientY > thumbRect.bottom) {
      console.log("Page down");
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = (grid.recordsPerPage - 1);
      grid.firstVisibleTreeRow = grid.firstVisibleTreeRow + recordIncrement;
      grid.scrollDown();
    }
  }
}
