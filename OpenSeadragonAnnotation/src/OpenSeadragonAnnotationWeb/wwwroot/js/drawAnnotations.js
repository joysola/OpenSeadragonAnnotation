



var isDraw = false;
var isFreeDraw = false;
var olay = {}; // openseadragon的FabricjsOverlay用于使用fabricjs
var view = {};
var strokeWidth = 0.5;
var borderColor = 'black';
var cornerColor = 'black';
var cornerSize = 12;
var url = 'http://localhost:5001/Annotation'

window.onload = function () {
    var viewer = OpenSeadragon({
        id: "openSeadragon1",
        prefixUrl: "./lib/openseadragon-bin-2.4.2/images/",
        showNavigator: true, // 显示导航栏缩略图
        navigatorPosition: 'TOP_RIGHT',
        //tileSources: {
        //    Image: {
        //        xmlns: "http://schemas.microsoft.com/deepzoom/2009",
        //        Url: "./dzc_output_images/Samples/9_files/",
        //        Overlap: "1",
        //        TileSize: "256",
        //        Format: "jpg",
        //        Size: {
        //            Height: "63488",
        //            Width: "65792"
        //        }
        //    }
        //},

        tileSources: {
            height: 63488,
            width: 65792,
            tileSize: 256,
            tileOverlap: 1,
            //minLevel: 9,
            getTileUrl: function (level, x, y) {
                return `${url}/GetPicture?level=${level}&xx=${x}&yy=${y}`;
            }
        }
    });
    view = viewer;
    // 初始化标记功能
    InitFabricOverlay(viewer);
    // 绘制标注的按钮功能
    $("#rect").click(event => {
        isDraw = !isDraw;
        viewer.setMouseNavEnabled(!isDraw);
        viewer.outerTracker.setTracking(!isDraw);
        let canvas = olay.fabricCanvas();
        // 修改按钮显示
        if (isDraw) {
            // 绘制时所有对象都不可以选中
            canvas.getObjects().forEach(o => o.set('selectable', false));
            $('#rect').text("结束绘制");
        } else {
            // 不绘制时所有对象皆可选中
            canvas.getObjects().forEach(o => o.set('selectable', true));
            $('#rect').text("开始绘制");
        }
    });
    $("#draw").click(event => {
        isFreeDraw = !isFreeDraw;
        //viewer.setMouseNavEnabled(!isDraw);
        //viewer.outerTracker.setTracking(!isDraw);
        // 修改按钮显示
        if (isFreeDraw) {
            btnDraw(true, olay, null, null);
            $('#draw').text("绘制结束");
        } else {
            btnDraw(false, olay, null, null);
            $('#draw').text("自由绘制");
        }
    });
    // 获取标注
    $.get(`${url}/GetAnnoMarks`, data => {
        data.forEach(x => {
            if (x.type === "rect") {
                var r = new fabric.Rect(x);
                r.set({
                    borderColor: borderColor,
                    cornerColor: cornerColor,
                    cornerSize: cornerSize,
                    transparentCorners: true
                    //borderScaleFactor: 5
                });
                olay.fabricCanvas().add(r);
            }
        });
    });
    // 初始化右键菜单
    InitContextMenu(olay);
};
$(window).resize(() => {
    olay.fabricCanvas();
    //olay.resizecanvas();
});
// 初始化Fabric用于构建标注
function InitFabricOverlay(viewer) {
    // 初始化选中的边框颜色
    //fabric.Object.prototype.transparentCorners = false;
    //fabric.Object.prototype.cornerStrokeColor = 'red';
    //fabric.Object.prototype.strokeWidth = 4;
    fabric.Object.prototype.strokeUniform = true; // 边框和放大无关，恒定大小
    var isDown;
    // Initialize overlay
    var options = {
        scale: 1000
    }
    var overlay = viewer.fabricjsOverlay(options);
    olay = overlay;
    // 自由画刷设置
    overlay.fabricCanvas().freeDrawingBrush.color = 'red';
    overlay.fabricCanvas().freeDrawingBrush.width = 10;
    // Add fabric rectangle
    var rect = {};


    // Add fabric circle with text
    //var circle2 = new fabric.Circle({
    //    left: 930,
    //    top: 100,
    //    fill: 'lightgray',
    //    radius: 120,
    //    selectable: false,
    //    action: 'button'
    //});
    //overlay.fabricCanvas().add(circle2);
    // 不可编辑文本框
    //var txtbox = new fabric.Textbox('你好', {
    //    left: 254,
    //    top: 195,
    //    width: 300,
    //    height: 75.03,
    //    fill: "#ecb2cc",
    //    angle: 0,

    //    fontSize: 20,

    //    fontFamily: "helvetica"
    //});
    //overlay.fabricCanvas().add(txtbox);

    // 可编辑文本框
    var itxt = new fabric.IText('你好\n迪赛特', {
        left: 300,
        top: 400,
        width: 300,
        height: 75.03,
        fill: "#049c82",
        angle: 0,
        scaleX: 1.5,
        scaleY: 1.5,
        fontSize: 20,
        fontWeight: "",
        fontFamily: "helvetica",

        styles: {}
    });
    overlay.fabricCanvas().add(itxt);

    overlay.fabricCanvas().on('mouse:up', function (event) {
        if (window.isDraw) {
            isDown = false;
            try {
                $.ajax({
                    type: "post",
                    url: `${url}/StoreAnno`,
                    contentType: 'application/json',
                    data: JSON.stringify(rect),
                    success: function (data, status) {
                        if (data && status === 'success') {
                            rect.guid = data.guid;
                            rect.id = data.id;
                        }
                        console.log("加载数据成功！")
                    }
                });
            } catch (e) {
                console.log(e);
            }
            return;
        }
        if (isRealValue(event.target)) {

            //if (event.target.type === "path") {
            //    btnDraw(false, overlay, circle2, text);
            //}

            // Animate circle on mouse release (try to drag circle up)
            //if (event.target.action === 'gravity') {
            //    delta = overlay.fabricCanvas().height - event.target.top;
            //    if (delta > 0) {
            //        circle.animate('top', '+=' + (delta + 420), {
            //            onChange: overlay.fabricCanvas().renderAll.bind(overlay.fabricCanvas()),
            //            duration: 2000,
            //            easing: fabric.util.ease.easeOutBounce
            //        });
            //        circle.animate('scaleY', '-=.1', {
            //            onChange: overlay.fabricCanvas().renderAll.bind(overlay.fabricCanvas()),
            //            duration: 1000,
            //        });

            //    }
            //}

        } else {
            //btnDraw(false, overlay, circle2, text);
        }

    })

    overlay.fabricCanvas().on('mouse:dblclick', event => {
        if (isRealValue(event.target) && event.target.canvas.getActiveObject().type === 'i-text') {
            var tag = event.target;
            tag.canvas.setActiveObject(tag.canvas.getActiveObject());
            tag.canvas.getActiveObject().editable = true;
            //tag.canvas.getActiveObject().selectAll();
            tag.canvas.getActiveObject().enterEditing();
        }
        console.log('mouse:dblclick');
        console.log(event);
    });
    overlay.fabricCanvas().on('mouse:over', event => {
        //console.log('mouse: over');
        //console.log(event);
    });
    //变化后产生事件
    overlay.fabricCanvas().on('object:modified', event => {
        overlay.fabricCanvas().renderAll(); // 重新生成画布,防止数据未更新
        console.log('object:modified');
        console.log(event);
        if (event.target.type === 'rect') {
            let guid = event.target.guid;
            let id = event.target.id;
            $.ajax({
                type: "post",
                url: `${url}/UpdateAnno?guid=${guid}&id=${id}`,
                contentType: 'application/json',
                data: JSON.stringify(event.target),
                success: function (data, status) {
                    if (status === "success") {
                        console.log("成功拖动后保存！");
                    }
                }
            });
        }
    });
    overlay.fabricCanvas().on('mouse:out', event => {
        if (isRealValue(event.target) && event.target.canvas.getActiveObject() && event.target.canvas.getActiveObject().type === 'i-text') {
            var tag = event.target;
            tag.canvas.setActiveObject(tag.canvas.getActiveObject());
            tag.canvas.getActiveObject().editable = false;
            tag.canvas.getActiveObject().exitEditing();
        }
    });
    var selectedObj = {};
    overlay.fabricCanvas().on('selection:updated', event => {
        console.log(`selection:updated${event.target.guid}`);
        //selectedObj = event.target;
    });
    overlay.fabricCanvas().on('selection:created', event => {
        if (!event.target.guid) {
            return;
        }
        console.log(`selection:created${event.target.guid}`);
        //let res = checkOverlap(overlay); // 层叠处理
        if (event.target.guid !== selectedObj.guid) {
            event.target = selectedObj;
            //overlay.fabricCanvas().setActiveObject(selectedObj); // 设定选中项
            //overlay.fabricCanvas().renderAll();
        }
        console.log(`selection:created${event.target.guid}`);

    });
    overlay.fabricCanvas().on('selection:cleared', event => {
        console.log(`selection:cleared${event.target.guid}`);
        //selectedObj = event.target;
    });
    overlay.fabricCanvas().on('mouse:down:before', event => {
        if (!isRealValue(event.target)) {
            return;
        }
        console.log(`mouse:down:before${event.target.guid}`);

        let res = checkOverlap(overlay); // 层叠处理
        //if (selectedObj.guid != event.target.guid) {
        selectedObj = res;
        event.target = res;
        if (event.target.guid !== selectedObj.guid) {
            event.target = selectedObj;
            //overlay.fabricCanvas().setActiveObject(selectedObj); // 设定选中项
            //overlay.fabricCanvas().renderAll();
        }
        // xx = JSON.parse(JSON.stringify(event))
        // event.e.preventDefaultAction = false;
        // overlay.fabricCanvas().fire("mouse:down",xx);
        // } else {
        //event.e.preventDefaultAction = true;
        console.log(`mouse:down:before${event.target.guid}`);
        // }
    });

    overlay.fabricCanvas().on('mousedown:before', event => {
        console.log(`mousedown:before${event.target.guid}`);
    });
    overlay.fabricCanvas().on('mouse:down', event => {
        // 画标注
        if (window.isDraw) {
            isDown = true;
            var pointer = overlay.fabricCanvas().getPointer(event.e);
            origX = pointer.x;
            origY = pointer.y;
            var pointer = overlay.fabricCanvas().getPointer(event.e);
            rect = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: pointer.x - origX,
                height: pointer.y - origY,
                angle: 0,
                fill: '',
                stroke: 'red',
                strokeWidth: strokeWidth,
                borderColor: borderColor,
                cornerColor: cornerColor,
                cornerSize: cornerSize,
                // transparentCorners: false // 是否是透明选中框
            });
            overlay.fabricCanvas().add(rect);
            return;
        } else { // 选中判读
            //console.log(`mouse:down${event.target.guid}`);

            if (selectedObj.guid != event.target.guid) {
                checkOverlap(overlay); // 层叠处理
                overlay.fabricCanvas().setActiveObject(selectedObj); // 设定选中项
                overlay.fabricCanvas().renderAll();
            }
            event.target = selectedObj;
            console.log(`mouse:down${event.target.guid}`);
            //if (event.button === 3) {
            //viewer.setMouseNavEnabled(false);
            //viewer.outerTracker.setTracking(false);
            // }
            //if (event.target.action === 'button') {
            //    btnDraw(true, overlay, circle2, text);
            //}

            //event.preventDefault();
        }



    });
    overlay.fabricCanvas().on('mouse:move', function (o) {
        if (!window.isDraw || !isDown) return;
        var pointer = overlay.fabricCanvas().getPointer(o.e);

        if (origX > pointer.x) {
            rect.set({ left: Math.abs(pointer.x) });
        }
        if (origY > pointer.y) {
            rect.set({ top: Math.abs(pointer.y) });
        }

        rect.set({ width: Math.abs(origX - pointer.x) });
        rect.set({ height: Math.abs(origY - pointer.y) });


        overlay.fabricCanvas().renderAll();
    });

    // Check value
    function isRealValue(obj) {
        return obj && obj !== 'null' && obj !== 'undefined';
    }
    // 检查重叠
    function checkOverlap(overlay) {
        let canvas = overlay.fabricCanvas();
        let allObjs = canvas.getObjects(); // 画布上所有的对象
        let tmp = []; // 鼠标所在位置所有的对象
        allObjs.forEach(o => {
            if (canvas.containsPoint(event, o)) {
                tmp.push(o);
            }
        });
        let map = new Map(); // 记录包含了对象的 对象
        for (let i = 0; i < tmp.length; i++) {
            for (let j = i + 1; j < tmp.length; j++) {
                let objA = tmp[i];
                let objB = tmp[j];
                // B 包含 A
                if (objA.isContainedWithinObject(objB)) {
                    if (!map.has(objB.guid)) {
                        map.set(objB.guid, objB);
                    }
                    continue;
                }
                // A 包含 B
                if (objB.isContainedWithinObject(objA)) {
                    if (!map.has(objA.guid)) {
                        map.set(objA.guid, objA);
                    }
                    continue;
                }
            }
        }
        let result = tmp.filter(t => !map.has(t.guid)); // 去掉包含了对象的对象
        if (result.length > 0) {
            //canvas.setActiveObject(result[0]); // 设定选中项
            console.log(`选中项${result[0].guid}`);
            // canvas.renderAll(); // 重新生成画布，防止不能及时更新选中项
            return result[0];
        }
    }

}
// 初始化右键菜单用于删除
function InitContextMenu(olay) {
    //初始化右击菜单(用于删除)
    $.contextMenu({
        selector: '#openSeadragon1',
        trigger: 'right',
        //构建菜单项build方法在每次右键点击会执行
        build: function ($trigger, e) {
            let canvas = olay.fabricCanvas();
            let anno = canvas.getActiveObject(); // 被选中的anno
            // 选中，且鼠标在选中的标注中，显示删除
            if (anno && canvas.containsPoint(event, anno)) {
                return {
                    callback: (key, options) => {
                        if (key === 'delete') {
                            // let canvas = olay.fabricCanvas();
                            // let anno = canvas.getActiveObject(); // 被选中的anno
                            canvas.remove(anno); // 删除
                            canvas.requestRenderAll(); // 重新生成画布
                            let guid = anno.guid;
                            let id = anno.id;
                            try {
                                $.ajax({
                                    type: "post",
                                    url: `${url}/DeleteAnno?guid=${guid}&id=${id}`,
                                    contentType: 'application/json',
                                    data: JSON.stringify(anno),
                                    success: function (data, status) {
                                        if (status === "success") {
                                            console.log("删除标注成功！");
                                        }
                                    }
                                });
                            } catch (e) {
                                console.log("删除标注失败！");
                            }

                        }
                    },
                    items: {
                        "delete": { name: "删除", icon: "delete" }
                    }
                };
            }

        }

    });
}
// 自由绘制
function btnDraw(flag, over, shape, txt) {
    // Toggle fabric canvas draw
    //if (flag) {
    if (window.isFreeDraw) {
        // Disable OSD mousevents
        view.setMouseNavEnabled(false);
        view.outerTracker.setTracking(false);
        // Activate fabric freedrawing mode
        over.fabricCanvas().isDrawingMode = true;
        // Button
        // shape.set('fill', 'lightgreen');
        // txt.text = 'Draw';
        // txt.left = 990;
        // over.fabricCanvas().add(txt);
    } else {
        // Stop drawing & switch back to zoom
        // Add tracking back to OSD
        view.setMouseNavEnabled(true);
        view.outerTracker.setTracking(true);
        // Disable freedrawing mode
        over.fabricCanvas().isDrawingMode = false;
        // Button
        // shape.set('fill', 'lightgray');
        // over.fabricCanvas().add(shape);
        //  txt.text = 'Start\n drawing';
        // txt.left = 950;
        // over.fabricCanvas().add(txt);
    }
}
// Convert fabric to image coordinates
function fabricToImagepoint(osdCanvas, selectedSlideSource, x, y) {
    var osdPoint = new OpenSeadragon.Point(x, y);

    var viewportPoint = osdCanvas.viewport.pointFromPixel(osdPoint, true);
    return selectedSlideSource.viewportToImageCoordinates(viewportPoint.x, viewportPoint.y, true);
}
// To convert the image coordinates to fabric
function imageToFabricPoint(osdCanvas, fabricCanvas, selectedSlideSource, x, y, angle) {
    var osdPoint = new OpenSeadragon.Point(x, y);
    var factor = 1 / fabricCanvas.getZoom();
    if (angle) {
        osdPoint = osdPoint.rotate(-1 * angle);
    }
    var viewportPoint = selectedSlideSource.imageToViewportCoordinates(osdPoint.x, osdPoint.y);
    var webPoint = osdCanvas.viewport.viewportToViewerElementCoordinates(viewportPoint);
    var tiledImage = osdCanvas.world.getItemAt(0);
    var canvasOffset = canvasDiv.getBoundingClientRect();
    var pageScroll = OpenSeadragon.getPageScroll();
    var origin = new OpenSeadragon.Point(0, 0);
    var imageWindowPoint = tiledImage.imageToWindowCoordinates(origin);
    var x = Math.round(imageWindowPoint.x);
    var y = Math.round(imageWindowPoint.y);
    var paintPoint = new fabric.Point(canvasOffset.left - x + pageScroll.x, canvasOffset.top - y + pageScroll.y);
    return { x: (webPoint.x + paintPoint.x) * factor, y: (webPoint.y + paintPoint.y) * factor };

}