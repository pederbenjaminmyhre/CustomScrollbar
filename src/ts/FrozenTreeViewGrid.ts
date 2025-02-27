import { FrozenTreeView } from './FrozenTreeView';
import { ProxyHelper } from './ProxyHelper'; // used for logging variable name and value
export class FrozenTreeViewGrid {
    public treeView: FrozenTreeView;
    public textHeight: number = 16;
    public columnWidth: number = 100;
    public dataHeight: number = 0; // The combined height of all records that virtually exist in the grid
    public virtualColumnCount: number = 300;
    public virtualRecordCount: number = 0;
    public firstVisibleTreeRow: number = 1;
    public firstVisibleTreeColumn: number = 1;
    public verticalArrow_RowIncrement: number = 10;
    public scrollColumnIncrement: number = 1;
    public fetchInProgress: boolean = false;
        public logString: string = "";


    constructor(treeView: FrozenTreeView) {
        this.treeView = treeView;
        this.logString = "";
        this.logString += 'FrozenTreeViewGrid.constructor();\r\n'
        this.initializeAndRenderGrid();

        // ScrollableBody wheelTurn
        this.treeView.layout.scrollableBody.addEventListener("wheel", (event: WheelEvent) => {
            console.log(`Mouse wheel moved over #myElement: deltaY=${event.deltaY}`);
            this.onWheelTurn(event);
        });
        // FrozenBody wheelTurn
        this.treeView.layout.frozenBody.addEventListener("wheel", (event: WheelEvent) => {
            console.log(`Mouse wheel moved over #myElement: deltaY=${event.deltaY}`);
            this.onWheelTurn(event);
        });
    }
  
    private onWheelTurn(event: WheelEvent) {
        if (!event.altKey) { // Vertical scrolling
            if (event.deltaY > 0) {
                let recordIncrement = this.recordsPerPage - 1;
                let firstVisibleTreeRow = this.firstVisibleTreeRow;
                this.firstVisibleTreeRow = firstVisibleTreeRow + recordIncrement;

                this.logString = "";
                this.logString += "**WheelTurn Down**\r\n";
                this.logString += "onWheelTurn();\r\n";
                this.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
                this.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
                this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeRow", this.firstVisibleTreeRow);
                this.logString += "this.scrollDown();\r\n";

                this.scrollDown();
            }
            if (event.deltaY < 0) {
                let recordIncrement = this.recordsPerPage - 1;
                let firstVisibleTreeRow = this.firstVisibleTreeRow;
                this.firstVisibleTreeRow = this.firstVisibleTreeRow - recordIncrement;

                this.logString = "";
                this.logString += "** WheelTurn Up;\r\n";
                this.logString += "onWheelTurn();\r\n";
                this.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeRow", firstVisibleTreeRow);
                this.logString += "\t" + ProxyHelper.formatVar("recordIncrement", recordIncrement);
                this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeRow", this.firstVisibleTreeRow);
                this.logString += "this.scrollDown();\r\n";

                this.scrollDown();
            }
        }
        else { // Horizontal scrolling
            if (event.deltaY > 0) {
                let columnIncrement = this.columnsPerPage - 1;
                let firstVisibleTreeColumn = this.firstVisibleTreeColumn;
                this.firstVisibleTreeColumn = firstVisibleTreeColumn + columnIncrement;

                this.logString = "";
                this.logString += "**WheelTurn Right**\r\n";
                this.logString += "onWheelTurn();\r\n";
                this.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeColumn", firstVisibleTreeColumn);
                this.logString += "\t" + ProxyHelper.formatVar("columnIncrement", columnIncrement);
                this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeColumn", this.firstVisibleTreeColumn);
                this.logString += "this.scrollDown();\r\n";

                this.scrollDown();
            }
            if (event.deltaY < 0) {
                let columnIncrement = this.columnsPerPage - 1;
                let firstVisibleTreeColumn = this.firstVisibleTreeColumn;
                this.firstVisibleTreeColumn = firstVisibleTreeColumn - columnIncrement;

                this.logString = "";
                this.logString += "**WheelTurn Left**\r\n";
                this.logString += "onWheelTurn();\r\n";
                this.logString += "\t" + ProxyHelper.formatVar("firstVisibleTreeColumn", firstVisibleTreeColumn);
                this.logString += "\t" + ProxyHelper.formatVar("columnIncrement", columnIncrement);
                this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeColumn", this.firstVisibleTreeColumn);
                this.logString += "this.scrollDown();\r\n";

                this.scrollDown();
            }
        }
    }

    private async initializeAndRenderGrid() {
        let parentId = 0;

        // log
        this.logString += "this.initializeGrid(parentId, this.recordsPerPage, this.columnsPerPage);\r\n";
        this.logString += "\t" + ProxyHelper.formatVar("parentId", parentId);
        this.logString += "\t" + ProxyHelper.formatVar("this.recordsPerPage", this.recordsPerPage);
        this.logString += "\t" + ProxyHelper.formatVar("this.columnsPerPage", this.columnsPerPage);

        const { recordCount, gridData } = await this.initializeGrid(parentId, this.recordsPerPage, this.columnsPerPage);
        this.virtualRecordCount = recordCount; // number of rows in the virtual tree at it's current drill state.
        console.log(`virtualRecordCount ${this.virtualRecordCount} updated during initializeAndRenderGrid()`);
        this.renderGrid(gridData, 1, this.recordsPerPage, 1, this.columnsPerPage);
    }

    // The height of the "scrollableBody" div
    get gridHeight(): number {
        return this.treeView.layout.scrollableBody.getBoundingClientRect().height;
    }

    // The width of the "scrollableBody" div
    get gridWidth(): number {
        return this.treeView.layout.scrollableBody.getBoundingClientRect().width;
    }

    // The height of the vertical scrollbar
    get verticalScrollbarHeight(): number {
        return this.treeView.vScrollbar.thumbTrack.getBoundingClientRect().height - this.treeView.vScrollbar.thumb.clientHeight;
    }

    // The width of the horizontal scrollbar
    get horizontalScrollbarWidth(): number {
        return this.treeView.hScrollbar.thumbTrack.getBoundingClientRect().width - this.treeView.hScrollbar.thumb.clientWidth;
    }

    // The top position of the vertical scrollbar thumb
    get verticalScrollbarPosition(): number {
        return parseInt(this.treeView.vScrollbar.thumb.style.top, 10);
    }

    // The left position of the horizontal scrollbar thumb
    get horizontalScrollbarPosition(): number {
        return parseInt(this.treeView.hScrollbar.thumb.style.left, 10);
    }

    get virtualRecordCountAsync(): Promise<number> {
        return this.getVirtualRecordCount();
    }

    private async getVirtualRecordCount(): Promise<number> {
        // Parent Nodes x 16px each
        if (this.virtualRecordCount == 0) {
            this.virtualRecordCount = await this.getVirtualRecordCountAtPageLoad();
        }
        return this.virtualRecordCount;
    }

    private async getVirtualRecordCountAtPageLoad(): Promise<number> {
        try {
            const response = await fetch('http://localhost:5000/api/countmembers/count-root-nodes');
            if (!response.ok) {
                    throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.RootNodeCount;
        } catch (error) {
            console.error('Failed to fetch root node count:', error);
            return 0;
        }
    }

    private async initializeGrid(parentId: number, rowCount: number, columnCount: number) {

        // log
        this.logString += "https://localhost:7264/api/GetAnalyticalData/initialize-grid\r\n";
        this.logString += "\t" + ProxyHelper.formatVar("parentId", parentId);
        this.logString += "\t" + ProxyHelper.formatVar("rowCount", rowCount);
        this.logString += "\t" + ProxyHelper.formatVar("columnCount", columnCount);
        console.log(this.logString);
    
        // Construct the request body
        const requestBody = {
            rootParentID: parentId,
            rowCount: rowCount,
            columnCount: columnCount,
            log1: this.logString // Now sent in the request body instead of URL
        };
    
        // Fetch API call
        const response = await fetch("https://localhost:7264/api/GetAnalyticalData/initialize-grid", {
            method: "POST",
            credentials: "include", // Ensures cookies (session) are sent
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody) // Sending JSON payload
        });
    
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
    
        // Parse response
        const data = await response.json();
    
        return { recordCount: data.recordCount, gridData: data.data };
    }
    
    public async scrollDown()
    {
        if(this.fetchInProgress){
            this.logString += "Skipping API call since prior API call is still in progress.\r\n";
            return;
        }

        this.logString += "await this.scrollGrid(this.firstVisibleTreeRow, this.recordsPerPage, this.firstVisibleTreeColumn, this.columnsPerPage);\r\n";
        this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeRow", this.firstVisibleTreeRow);
        this.logString += "\t" + ProxyHelper.formatVar("this.recordsPerPage", this.recordsPerPage);
        this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeColumn", this.firstVisibleTreeColumn);
        this.logString += "\t" + ProxyHelper.formatVar("this.columnsPerPage", this.columnsPerPage);

        this.fetchInProgress = true;
        const data = await this.scrollGrid(this.firstVisibleTreeRow, this.recordsPerPage, this.firstVisibleTreeColumn, this.columnsPerPage);
        this.renderGrid(data, this.firstVisibleTreeColumn, this.recordsPerPage, this.firstVisibleTreeColumn, this.columnsPerPage);
        this.fetchInProgress = false;
    }

    private async scrollGrid(firstTreeRow: number, rowCount: number, firstTreeColumn: number, columnCount: number) {

        this.logString += "https://localhost:7264/api/GetAnalyticalData/scroll-grid\r\n";
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeRow", firstTreeRow);
        this.logString += "\t" + ProxyHelper.formatVar("rowCount", rowCount);
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeColumn", firstTreeColumn);
        this.logString += "\t" + ProxyHelper.formatVar("columnCount", columnCount);

        let log1 = this.logString;
        console.log(log1);

        const response = await fetch("https://localhost:7264/api/GetAnalyticalData/scroll-grid", {
            method: "POST",
            credentials: "include", // Ensures cookies (session) are sent
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstTreeRow,
                rowCount,
                firstTreeColumn,
                columnCount,
                log1
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }

    renderGrid(data: any,startRow: number, endRow: number, startCol: number, endCol: number) {

        // Clear the current content
        this.treeView.layout.frozenColumnHeadersContainer.innerHTML = "";
        this.treeView.layout.scrollableColumnHeadersContainer.innerHTML = "";
        this.treeView.layout.frozenBody.innerHTML = '';
        this.treeView.layout.scrollableBody.innerHTML = '';

        // Populate Frozen Headers
        let nameHeaderCell = this.createGridCell(1, 1, "Name");
        this.treeView.layout.frozenColumnHeadersContainer.appendChild(nameHeaderCell);

        let customSortHeaderCell = this.createGridCell(1, 4, "CustomSort");
        this.treeView.layout.frozenColumnHeadersContainer.appendChild(customSortHeaderCell);

        let parentIDHeaderCell = this.createGridCell(1, 5, "ParentID");
        this.treeView.layout.frozenColumnHeadersContainer.appendChild(parentIDHeaderCell);

        let childCountHeaderCell = this.createGridCell(1, 6, "ChildCount");
        this.treeView.layout.frozenColumnHeadersContainer.appendChild(childCountHeaderCell);
    
        if (data) {

            let previousFrozenRow : HTMLElement & { label?: HTMLElement, arrow?: SVGElement } | null = null;

            // records
            for (let row = 0; row < data.length; row++) {

                let treeLevel: number = data[row]["TreeLevel"];
                if(previousFrozenRow && treeLevel > parseInt(previousFrozenRow.dataset.TreeLevel || '0')){
                    previousFrozenRow.arrow?.classList.add('rotated');
                }
                let hasChildren: boolean;
                let indentPixels: string;

                // Create row in frozenBody
                const frozenRow = document.createElement('div') as HTMLElement & { label?: HTMLElement, arrow?: SVGElement };
                frozenRow.style.left = indentPixels = `${(treeLevel-1)*this.textHeight}px`;
                frozenRow.style.right = "0px";
                frozenRow.style.height = `${this.textHeight}px`;
                frozenRow.style.top = `${(row) * this.textHeight}px`;
                frozenRow.style.position = "absolute";
                frozenRow.dataset.ID = data[row]["ID"];
                frozenRow.dataset.ParentID = data[row]["ParentID"];
                frozenRow.dataset.HasChildren = hasChildren = data[row]["HasChildren"];
                frozenRow.dataset.ChildCount = data[row]["ChildCount"];
                frozenRow.dataset.CustomSort = data[row]["CustomSort"];
                frozenRow.dataset.TreeLevel = treeLevel.toString();
                frozenRow.dataset.VisibleRowIndex = (row + 1).toString();
                this.treeView.layout.frozenBody.appendChild(frozenRow);

                // Create row in scrollableBody
                const scrollableRow = document.createElement('div');
                scrollableRow.style.left = "0px";
                scrollableRow.style.right = "0px";
                scrollableRow.style.height = `${this.textHeight}px`;
                scrollableRow.style.top = `${(row) * this.textHeight}px`;
                scrollableRow.style.position = "absolute";
                this.treeView.layout.scrollableBody.appendChild(scrollableRow);

                // Populate the current frozenRow in frozenBody
                // Create the arrow
                const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                arrow.setAttribute('viewBox', '0 0 24 24');
                arrow.setAttribute('width', '16');
                arrow.setAttribute('height', '16');
                arrow.innerHTML = '<path d="M8 5l8 7-8 7z" fill="black"></path>';
                frozenRow.arrow = arrow;
                arrow.style.top = "2px";
                arrow.style.left = "1px";
                arrow.style.position = "absolute";
                arrow.style.cursor = "pointer";
                frozenRow.appendChild(arrow);
                // Arrow is invisible in node doesn't have child records
                if (frozenRow.dataset.HasChildren === "false") {
                    // Make the arrow invisible, but let it occupy space-
                    arrow.style.visibility = "hidden";
                }
                // When the user clicks the arrow of the node
                arrow.addEventListener('click', async () => {
                    await this.toggleChildRecords(arrow, frozenRow);
                });

                let name = data[row]["Name"];
                let nameCell = this.createGridCell(1, 1, name);
                frozenRow.appendChild(nameCell);
                nameCell.style.left = `${this.textHeight}px`;
                nameCell.style.width = `${300-(this.textHeight*treeLevel)}px`;

                let customSort = data[row]["CustomSort"];
                let customSortCell = this.createGridCell(1, 4, customSort);
                frozenRow.appendChild(customSortCell);
                customSortCell.style.left = `${((4-1) * this.columnWidth)-parseInt(indentPixels)}px`;

                let parentId = data[row]["ParentID"];
                let parentIdCell = this.createGridCell(1, 5, parentId);
                frozenRow.appendChild(parentIdCell);
                parentIdCell.style.left = `${((5-1) * this.columnWidth)-parseInt(indentPixels)}px`;

                let childCount = data[row]["ChildCount"];
                let childCountCell = this.createGridCell(1, 6, childCount);
                frozenRow.appendChild(childCountCell);
                childCountCell.style.left = `${((6-1) * this.columnWidth)-parseInt(indentPixels)}px`;

                // Populate the current scrollableRow in scrollableBody
                let columnIndex = 1;
                for (let col = startCol; col <= (startCol + endCol - 1); col++) {

                    if(row == 0){
                        // Populate scrollable headers
                        const colName = `Col${col}`;
                        const headerCell = this.createGridCell(1, columnIndex, colName);
                        this.treeView.layout.scrollableColumnHeadersContainer.appendChild(headerCell);
                    }

                    // Scrollable Body
                    const content = data[row][`Col${col}`];
                    const gridCell = this.createGridCell(1, columnIndex, content);
                    scrollableRow.appendChild(gridCell);

                    columnIndex=columnIndex + 1;
                }

                previousFrozenRow = frozenRow;
            }
        }
    }

    async expandNode(
        firstTreeRow: number,
        rowCount: number,
        firstTreeColumn: number,
        columnCount: number,
        clickedNode_parentID: number,
        clickedNode_ID: number,
        clickedNode_treeLevel: number,
        clickedNode_childRecordCount: number,
        clickedNode_customSortID: number
    ): Promise<any> {

        const BASE_URL = "https://localhost:7264/api/GetAnalyticalData"; // Replace with your actual API base URL
        const endpoint = `${BASE_URL}/expand-node`;
    
        this.logString += `${endpoint}\r\n`;
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeRow", firstTreeRow);
        this.logString += "\t" + ProxyHelper.formatVar("rowCount", rowCount);
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeColumn", firstTreeColumn);
        this.logString += "\t" + ProxyHelper.formatVar("columnCount", columnCount);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_parentID", clickedNode_parentID);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_ID", clickedNode_ID);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_treeLevel", clickedNode_treeLevel);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_childRecordCount", clickedNode_childRecordCount);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_customSortID", clickedNode_customSortID);

        console.log(this.logString);
        let log1 = this.logString;

        const requestData = {
            firstTreeRow,
            rowCount,
            firstTreeColumn,
            columnCount,
            clickedNode_parentID,
            clickedNode_ID,
            clickedNode_treeLevel,
            clickedNode_childRecordCount,
            clickedNode_customSortID,
            log1
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include", // Ensures cookies (session) are sent
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error("Error calling expandNode:", error);
            throw error;
        }
    }

    async contractNode(
        firstTreeRow: number,
        rowCount: number,
        firstTreeColumn: number,
        columnCount: number,
        clickedNode_parentID: number,
        clickedNode_ID: number,
        clickedNode_treeLevel: number,
        clickedNode_childRecordCount: number,
        clickedNode_customSortID: number
    ): Promise<any> {

        const BASE_URL = "https://localhost:7264/api/GetAnalyticalData"; // Replace with your actual API base URL
        const endpoint = `${BASE_URL}/contract-node`;
    
        this.logString += `${endpoint}\r\n`;
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeRow", firstTreeRow);
        this.logString += "\t" + ProxyHelper.formatVar("rowCount", rowCount);
        this.logString += "\t" + ProxyHelper.formatVar("firstTreeColumn", firstTreeColumn);
        this.logString += "\t" + ProxyHelper.formatVar("columnCount", columnCount);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_parentID", clickedNode_parentID);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_ID", clickedNode_ID);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_treeLevel", clickedNode_treeLevel);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_childRecordCount", clickedNode_childRecordCount);
        this.logString += "\t" + ProxyHelper.formatVar("clickedNode_customSortID", clickedNode_customSortID);

        console.log(this.logString);
        let log1 = this.logString;

        const requestData = {
            firstTreeRow,
            rowCount,
            firstTreeColumn,
            columnCount,
            clickedNode_parentID,
            clickedNode_ID,
            clickedNode_treeLevel,
            clickedNode_childRecordCount,
            clickedNode_customSortID,
            log1
        };

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include", // Ensures cookies (session) are sent
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(requestData)
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            return await response.json();
        } catch (error) {
            console.error("Error calling expandNode:", error);
            throw error;
        }
    }
    
    async toggleChildRecords(arrow: SVGElement, row: HTMLElement & { label?: HTMLElement, arrow?: SVGElement }) {
        // When the user clicks the arrow of a node to expand or contract its child nodes

        this.logString = "";
        this.logString += 'FrozenTreeViewGrid.toggleChildRecords();\r\n'

        const isRight = !arrow.classList.contains('rotated');
        if (isRight) { // Arrow points right (meaning that the clicked node is contracted)
            arrow.classList.add('rotated'); // Add the rotated class to rotate the arrow down

            const parentId = parseInt(row.dataset.ParentID || '0', 10);
            const id = parseInt(row.dataset.ID || '0', 10);
            const treeLevel = parseInt(row.dataset.TreeLevel || '0', 10);
            const childCount = parseInt(row.dataset.ChildCount || '0', 10);
            const customSort = parseInt(row.dataset.CustomSort || '0', 10);
            
            this.logString += 'FrozenTreeViewGrid.expandNode();\r\n'
            this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeRow", this.firstVisibleTreeRow);
            this.logString += "\t" + ProxyHelper.formatVar("this.recordsPerPage", this.recordsPerPage);
            this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeColumn", this.firstVisibleTreeColumn);
            this.logString += "\t" + ProxyHelper.formatVar("this.columnsPerPage", this.columnsPerPage);
            this.logString += "\t" + ProxyHelper.formatVar("parentId", parentId);
            this.logString += "\t" + ProxyHelper.formatVar("id", id);
            this.logString += "\t" + ProxyHelper.formatVar("treeLevel", treeLevel);
            this.logString += "\t" + ProxyHelper.formatVar("childCount", childCount);
            this.logString += "\t" + ProxyHelper.formatVar("customSort", customSort);

            const data = await this.expandNode(
                this.firstVisibleTreeRow,
                this.recordsPerPage,
                this.firstVisibleTreeColumn,
                this.columnsPerPage,
                parentId,
                id,
                treeLevel,
                childCount,
                customSort
            );
            
            this.renderGrid(data, this.firstVisibleTreeColumn, this.recordsPerPage, this.firstVisibleTreeColumn, this.columnsPerPage);
        }
        else { // Arrow points down (meaning that the clicked node is expanded)
            arrow.classList.remove('rotated'); // Remove the rotated class to rotate the arrow right

            const parentId = parseInt(row.dataset.ParentID || '0', 10);
            const id = parseInt(row.dataset.ID || '0', 10);
            const treeLevel = parseInt(row.dataset.TreeLevel || '0', 10);
            const childCount = parseInt(row.dataset.ChildCount || '0', 10);
            const customSort = parseInt(row.dataset.CustomSort || '0', 10);
            
            this.logString += 'FrozenTreeViewGrid.contractNode();\r\n'
            this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeRow", this.firstVisibleTreeRow);
            this.logString += "\t" + ProxyHelper.formatVar("this.recordsPerPage", this.recordsPerPage);
            this.logString += "\t" + ProxyHelper.formatVar("this.firstVisibleTreeColumn", this.firstVisibleTreeColumn);
            this.logString += "\t" + ProxyHelper.formatVar("this.columnsPerPage", this.columnsPerPage);
            this.logString += "\t" + ProxyHelper.formatVar("parentId", parentId);
            this.logString += "\t" + ProxyHelper.formatVar("id", id);
            this.logString += "\t" + ProxyHelper.formatVar("treeLevel", treeLevel);
            this.logString += "\t" + ProxyHelper.formatVar("childCount", childCount);
            this.logString += "\t" + ProxyHelper.formatVar("customSort", customSort);

            const data = await this.contractNode(
                this.firstVisibleTreeRow,
                this.recordsPerPage,
                this.firstVisibleTreeColumn,
                this.columnsPerPage,
                parentId,
                id,
                treeLevel,
                childCount,
                customSort
            );
            
            this.renderGrid(data, this.firstVisibleTreeColumn, this.recordsPerPage, this.firstVisibleTreeColumn, this.columnsPerPage);
        }

    }

    createGridCell(rowIndex: number, columnIndex: number, cellContent: string): HTMLElement {
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.style.left = `${(columnIndex-1) * this.columnWidth}px`;
        div.style.top = `${(rowIndex-1) * this.textHeight}px`;
        div.style.width = `${this.columnWidth}px`;
        div.style.height = `${this.textHeight}px`;
        div.innerText = cellContent;
        return div;
    }

    // The virtual width of the table
    get virtualTableWidth(): number {
        // Columns times 100px each
        return this.virtualColumnCount * this.columnWidth;
    }

    // The virtual height of the table
    get virtualTableHeight(): number {
        return this.virtualRecordCount * this.textHeight;
    }
    
    /**
     * The number of records that will be displayed on a single page.
     */
    get recordsPerPage(): number {

        // log
        this.logString += `this.recordsPerPage = Math.ceil(this.gridHeight / this.textHeight);\r\n`;
        this.logString += "\t" + ProxyHelper.formatVar("this.gridHeight", this.gridHeight);
        this.logString += "\t" + ProxyHelper.formatVar("this.textHeight", this.textHeight);

        return Math.ceil(this.gridHeight / this.textHeight);
    }

    /**
     * The number of columns that will be displayed on a single page.
     */
    get columnsPerPage(): number {

        // log
        this.logString += `this.columnsPerPage = Math.ceil(this.gridWidth / this.columnWidth);\r\n`;
        this.logString += "\t" + ProxyHelper.formatVar("this.gridWidth", this.gridWidth);
        this.logString += "\t" + ProxyHelper.formatVar("this.columnWidth", this.columnWidth);

        return Math.ceil(this.gridWidth / this.columnWidth);
    }

    // The number of horizontal pages required to display all virtual columns
    get horizontalPagesRequired(): number {
        return  Math.ceil(this.virtualColumnCount / this.columnsPerPage);
    }

    // The number of vertical pages required to display all virtual records
    get verticalPagesRequired(): number {
        return Math.ceil(this.virtualRecordCount / this.recordsPerPage);
    }

    // How tall the vertical thumb should be
    get verticalThumbHeight(): number {
        return Math.ceil(this.verticalScrollbarHeight*this.virtualTableHeight / this.gridHeight);
    }

    // How wide the horizontal thumb should be
    get horizontalThumbWidth(): number {
        return Math.ceil(this.horizontalScrollbarWidth*this.virtualTableWidth / this.gridWidth);
    }

    // The first record number to query, based on the vertical scrollbar
    get firstRecordOfPage(): number {
        return Math.ceil(this.virtualRecordCount * (this.verticalScrollbarPosition / this.verticalScrollbarHeight));
    }

    // The first column number to query, based on the horizontal scrollbar
    get firstColumnOfPage(): number {
        return Math.ceil(this.virtualColumnCount * (this.horizontalScrollbarPosition / this.horizontalScrollbarWidth));
    }
}
