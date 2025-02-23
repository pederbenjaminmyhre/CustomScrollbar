import { FrozenTreeView } from "./FrozenTreeView";

export class FrozenTreeViewLayout { 
  public frozenTreeView: FrozenTreeView;
  public frozenColumnHeadersContainer: HTMLDivElement;
  public scrollableColumnHeadersContainer: HTMLDivElement;
  public northeastContainer: HTMLDivElement;
  public frozenBody: HTMLDivElement;
  public scrollableBody: HTMLDivElement;
  public verticalScrollbar: HTMLDivElement;
  public southwestCorner: HTMLDivElement;
  public horizontalScrollbar: HTMLDivElement;
  public southeastCorner: HTMLDivElement;
  public ghost: HTMLDivElement;

  constructor(
    private parentElement: HTMLElement,
    frozenWidth: string,
    textHeight: string,
    frozenTreeView: FrozenTreeView
  ) {

    this.frozenTreeView = frozenTreeView;

    // frozenColumnHeadersContainer
    this.frozenColumnHeadersContainer = document.createElement('div');
    this.frozenColumnHeadersContainer.style.position = 'absolute';
    this.frozenColumnHeadersContainer.style.top = '0px';
    this.frozenColumnHeadersContainer.style.left = '0px';
    this.frozenColumnHeadersContainer.style.width = frozenWidth;
    this.frozenColumnHeadersContainer.style.height = textHeight;
    this.frozenColumnHeadersContainer.style.backgroundColor = 'pink';
    this.parentElement.appendChild(this.frozenColumnHeadersContainer);

    // scrollableColumnHeadersContainer
    this.scrollableColumnHeadersContainer = document.createElement('div');
    this.scrollableColumnHeadersContainer.style.position = 'absolute';
    this.scrollableColumnHeadersContainer.style.top = '0px';
    this.scrollableColumnHeadersContainer.style.left = frozenWidth;
    this.scrollableColumnHeadersContainer.style.right = '16px';
    this.scrollableColumnHeadersContainer.style.height = textHeight;
    this.scrollableColumnHeadersContainer.style.backgroundColor = 'lightblue';
    this.parentElement.appendChild(this.scrollableColumnHeadersContainer);

    // northeastContainer
    this.northeastContainer = document.createElement('div');
    this.northeastContainer.style.position = 'absolute';
    this.northeastContainer.style.top = '0px';
    this.northeastContainer.style.right = '0px';
    this.northeastContainer.style.width = textHeight;
    this.northeastContainer.style.height = textHeight;
    this.northeastContainer.style.backgroundColor = 'green';
    this.parentElement.appendChild(this.northeastContainer);

    // frozenBody
    this.frozenBody = document.createElement('div');
    this.frozenBody.style.position = 'absolute';
    this.frozenBody.style.top = textHeight;
    this.frozenBody.style.left = '0px';
    this.frozenBody.style.width = frozenWidth;
    this.frozenBody.style.bottom = textHeight;
    this.frozenBody.style.backgroundColor = 'yellow';
    this.parentElement.appendChild(this.frozenBody);

    // scrollableBody
    this.scrollableBody = document.createElement('div');
    this.scrollableBody.style.position = 'absolute';
    this.scrollableBody.style.top = textHeight;
    this.scrollableBody.style.left = frozenWidth;
    this.scrollableBody.style.right = '16px';
    this.scrollableBody.style.bottom = textHeight;
    this.scrollableBody.style.backgroundColor = 'orange';
    this.parentElement.appendChild(this.scrollableBody);

    // verticalScrollbar
    this.verticalScrollbar = document.createElement('div');
    this.verticalScrollbar.style.position = 'absolute';
    this.verticalScrollbar.style.top = textHeight;
    this.verticalScrollbar.style.right = '0px';
    this.verticalScrollbar.style.width = textHeight;
    this.verticalScrollbar.style.bottom = textHeight;
    this.verticalScrollbar.style.backgroundColor = 'yellow';
    this.parentElement.appendChild(this.verticalScrollbar);

    // southwestCorner
    this.southwestCorner = document.createElement('div');
    this.southwestCorner.style.position = 'absolute';
    this.southwestCorner.style.left = '0px';
    this.southwestCorner.style.bottom = '0px';
    this.southwestCorner.style.width = frozenWidth;
    this.southwestCorner.style.height = textHeight;
    this.southwestCorner.style.backgroundColor = 'pink';
    this.parentElement.appendChild(this.southwestCorner);

    // horizontalScrollbar
    this.horizontalScrollbar = document.createElement('div');
    this.horizontalScrollbar.style.position = 'absolute';
    this.horizontalScrollbar.style.left = frozenWidth;
    this.horizontalScrollbar.style.right = '16px';
    this.horizontalScrollbar.style.bottom = '0px';
    this.horizontalScrollbar.style.height = textHeight;
    this.horizontalScrollbar.style.backgroundColor = 'cyan';
    this.parentElement.appendChild(this.horizontalScrollbar);

    // southeastCorner
    this.southeastCorner = document.createElement('div');
    this.southeastCorner.style.position = 'absolute';
    this.southeastCorner.style.right = '0px';
    this.southeastCorner.style.bottom = '0px';
    this.southeastCorner.style.width = textHeight;
    this.southeastCorner.style.height = textHeight;
    this.southeastCorner.style.backgroundColor = 'brown';
    this.parentElement.appendChild(this.southeastCorner);

    // ghost
    this.ghost = document.createElement('div');
    this.ghost.style.position = 'absolute';
    this.ghost.style.top = '0px';
    this.ghost.style.left = `calc(${frozenWidth} - 3px)`;
    this.ghost.style.width = '6px';
    this.ghost.style.height = textHeight;
    this.ghost.style.cursor = 'ew-resize';
    this.ghost.style.zIndex = '1000';
    this.ghost.style.backgroundColor = 'transparent';
    this.parentElement.appendChild(this.ghost);

    this.ghost.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    event.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private onMouseMove = (event: MouseEvent) => {

    const newLeft = Math.max(0, Math.min(this.parentElement.clientWidth - 6, event.clientX - this.parentElement.offsetLeft));
    this.ghost.style.left = `${newLeft}px`;

    const newLeftPlus3 = newLeft + 3;
    this.scrollableColumnHeadersContainer.style.left = `${newLeftPlus3}px`;
    this.scrollableBody.style.left = `${newLeftPlus3}px`;
    this.horizontalScrollbar.style.left = `${newLeftPlus3}px`;

    this.frozenColumnHeadersContainer.style.width = `${newLeftPlus3}px`;
    this.frozenBody.style.width = `${newLeftPlus3}px`;
    this.southwestCorner.style.width = `${newLeftPlus3}px`;
  }

  private onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }
}
