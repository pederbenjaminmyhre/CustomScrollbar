import { FrozenTreeViewLayout } from './FrozenTreeViewLayout';
import { ProxyHelper } from './ProxyHelper'; // used for logging variable name and value

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
      let firstVisibleTreeRow = grid.firstVisibleTreeRow;
      grid.firstVisibleTreeRow = firstVisibleTreeRow + recordIncrement;

      grid.logString = "";
      grid.logString += "FrozenTreeViewVScrollbar.svgUpArrow.addEventListener('click')\r\n"
      grid.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
      grid.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
      grid.logString += "\t" + ProxyHelper.formatVar("FrozenTreeViewGrid.firstVisibleTreeRow", grid.firstVisibleTreeRow);

      grid.logString += "FrozenTreeViewGrid.scrollDown()\r\n"

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
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = grid.verticalArrow_RowIncrement;
      let firstVisibleTreeRow = grid.firstVisibleTreeRow;
      grid.firstVisibleTreeRow = firstVisibleTreeRow + recordIncrement;

      grid.logString = "";
      grid.logString += "FrozenTreeViewVScrollbar.svgDownArrow.addEventListener('click')\r\n"
      grid.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
      grid.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
      grid.logString += "\t" + ProxyHelper.formatVar("FrozenTreeViewGrid.firstVisibleTreeRow", grid.firstVisibleTreeRow);

      grid.logString += "FrozenTreeViewGrid.scrollDown()\r\n"

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

        // Slide the thumb
        const deltaY = moveEvent.clientY - startY;
        let newTop = startTop + deltaY;
        const maxTop = this.thumbTrack.clientHeight - this.thumb.clientHeight;
        let thumbTop = Math.max(0, Math.min(newTop, maxTop));
        this.thumb.style.top = `${thumbTop}px`;

        // Calculate firstVisibleTreeRow
        let grid = this.layout.frozenTreeView.grid;
        let upDown = (deltaY > 0 ) ? "Down" : "Up";
        let netSliderHeight = (this.thumbTrack.getBoundingClientRect().height - this.thumb.clientHeight);
        grid.firstVisibleTreeRow = Math.floor(grid.virtualRecordCount*(thumbTop/netSliderHeight));
        grid.firstVisibleTreeRow = (grid.firstVisibleTreeRow > (grid.virtualRecordCount - grid.recordsPerPage)) ? (grid.virtualRecordCount - grid.recordsPerPage) : grid.firstVisibleTreeRow;

        grid.logString = "";
        grid.logString += `**Dragged VScrollbar ${upDown}**\r\n`;
        grid.logString += ` thumbTop: ${thumbTop}\r\n`;
        grid.logString += ` netSliderHeight: ${netSliderHeight}\r\n`;
        grid.logString += ` grid.virtualRecordCount: ${grid.virtualRecordCount}\r\n`;
        grid.logString += ` grid.firstVisibleTreeRow: ${grid.firstVisibleTreeRow}\r\n`;

        grid.logString += "FrozenTreeViewGrid.scrollDown()\r\n"
        
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
      let firstVisibleTreeRow = grid.firstVisibleTreeRow;
      grid.firstVisibleTreeRow = firstVisibleTreeRow + recordIncrement;

      grid.logString = "";
      grid.logString += "FrozenTreeViewVScrollbar.onThumbTrackClick() **Page Up**\r\n";
      grid.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
      grid.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
      grid.logString += "\t" + ProxyHelper.formatVar("FrozenTreeViewGrid.firstVisibleTreeRow", grid.firstVisibleTreeRow);

      grid.logString += "FrozenTreeViewGrid.scrollDown()\r\n"

      grid.scrollDown();
    } else if (event.clientY > thumbRect.bottom) {
      console.log("Page down");
      let grid = this.layout.frozenTreeView.grid;
      let recordIncrement = (grid.recordsPerPage - 1);
      let firstVisibleTreeRow = grid.firstVisibleTreeRow;
      grid.firstVisibleTreeRow = firstVisibleTreeRow + recordIncrement;

      grid.logString = "";
      grid.logString += "FrozenTreeViewVScrollbar.onThumbTrackClick() **Page Down**\r\n"
      grid.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
      grid.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
      grid.logString += "\t" + ProxyHelper.formatVar("FrozenTreeViewGrid.firstVisibleTreeRow", grid.firstVisibleTreeRow);

      grid.logString += "FrozenTreeViewGrid.scrollDown()\r\n"

      grid.scrollDown();
    }
  }
}
