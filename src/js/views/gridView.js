import {L} from "../../lib/lquery.js";
import Vue from 'vue'
import {Grid} from "../grid.js";
import {actionService} from "../service/actionService";
import {dataService} from "../service/dataService";
import {MetaData} from "../model/MetaData.js";

import {Scanner} from "../scanning.js";
import {Hover} from "../hovering.js";

var GridView = {};
var autostartScan = true;

GridView.init = function (gridId) {
    dataService.getGrid(gridId).then(grid => {
        if (!grid) {
            console.log('grid not found! gridId: ' + gridId);
            return;
        }
        GridView.gridData = grid;
        dataService.saveMetadata(new MetaData({
            lastOpenedGridId: GridView.gridData.id
        }));

        var scanningConfig = grid.scanningConfig;
        GridView.scanner = new Scanner('.grid-item-content', 'scanFocus', {
            verticalScan: scanningConfig.verticalScan,
            subScanRepeat: 3,
            binaryScanning: scanningConfig.binaryScanning,
            scanInactiveClass: 'scanInactive',
            minBinarySplitThreshold: 3,
            scanTimeoutMs: scanningConfig.scanTimeoutMs
        });
        GridView.hover = new Hover('.grid-item-content');
        initVue();
    });
};

GridView.destroy = function () {
    if (GridView.scanner) GridView.scanner.stopScanning();
    if (GridView.hover) GridView.hover.stopHovering();
    GridView.grid = null;
};


function initGrid() {
    GridView.grid = new Grid('#grid-container', '.grid-item-content', {
        enableResizing: true,
        gridId: GridView.gridData.id
    });
    GridView.grid.setLayoutChangedStartListener(function () {
        GridView.scanner.pauseScanning();
    });
    GridView.grid.setLayoutChangedEndListener(function () {
        GridView.scanner.resumeScanning();
    });
    return GridView.grid.getInitPromise();
}

function initVue() {
    var app = new Vue({
        el: '#app',
        data: {
            gridData: JSON.parse(JSON.stringify(GridView.gridData)),
            showInputOptions: false,
            isScanning: autostartScan
        },
        methods: {
            toggleInputMenu: function () {
                this.showInputOptions = !this.showInputOptions;
            },
            toggleScanning: function () {
                if (this.isScanning) {
                    GridView.scanner.stopScanning();
                } else {
                    GridView.scanner.startScanning();
                }
                this.isScanning = !this.isScanning;
            },
            setHover: function (event) {
                if (event.target.checked) {
                    GridView.hover.startHovering();
                } else {
                    GridView.hover.stopHovering();
                }
            },
            changeRowCount: function (event) {
                GridView.grid.setNumberOfRows(event.target.value);
            },
            changeScanningMs: function (event) {
                this.updateScanningOptions({
                    scanTimeoutMs: Number.parseInt(event.target.value)
                }, true);
            },
            setVerticalScanning: function (event) {
                this.updateScanningOptions({
                    verticalScan: event.target.checked
                }, true);
            },
            setBinaryScanning: function (event) {
                this.updateScanningOptions({
                    binaryScanning: event.target.checked
                }, true);
            },
            updateScanningOptions: function (optionsToUpdate, restart) {
                GridView.scanner.updateOptions(optionsToUpdate, restart);
                dataService.updateScanningConfig(GridView.gridData.id, optionsToUpdate);
            }
        },
        computed: {
            filteredGrids: function () {
                return []
            },
        },
        created: function () {
            window.addEventListener('resize', function () {
                GridView.scanner.layoutChanged();
            }, true);

            GridView.scanner.setSelectionListener(function (item) {
                L.toggleClass(item, 'selected');
                actionService.doAction(GridView.grid.getCurrentGridId(), item.id);
            });

            GridView.hover.setSelectionListener(function (item) {
                L.toggleClass(item, 'selected');
                actionService.doAction(GridView.gridData.id, item.id);
            });
        },
        mounted: () => {
            initGrid().then(() => {
                GridView.grid.autosize();
                if (autostartScan) {
                    GridView.scanner.startScanning();
                }
            });
        },
        updated: () => {
            GridView.grid.autosize();
        }
    })
}

export {GridView};