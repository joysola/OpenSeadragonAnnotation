

var self = this;
var isDraw = false;
var olay = {};
var url = 'http://localhost:5001/Annotation'
window.onload = function () {
    var viewer = OpenSeadragon({
        id: "openSeadragon1",
        prefixUrl: "./lib/openseadragon-bin-2.4.2/images/",
        showNavigator: true, // 显示导航栏缩略图
        navigatorPosition: 'TOP_RIGHT',
        tileSources: {
            Image: {
                xmlns: "http://schemas.microsoft.com/deepzoom/2009",
                Url: "./dzc_output_images/Samples/9_files/",
                Overlap: "1",
                TileSize: "256",
                Format: "jpg",
                Size: {
                    Height: "63488",
                    Width: "65792"
                }
            }
        }
    });
    // 初始化标记功能
    InitFabricOverlay(viewer);
    // 画标注按钮
    document.getElementById("rect").onclick = event => {
        isDraw = !isDraw;
        viewer.setMouseNavEnabled(!isDraw);
        viewer.outerTracker.setTracking(!isDraw);
    };
    // 获取标注
    $.get(`${url}/GetAnnoMarks`, data => {
        data.forEach(x => {
            if (x.type === "rect") {
                var r = new fabric.Rect(x);
                olay.fabricCanvas().add(r);
            }
        });
    });
    //初始化右击菜单(用于删除)
    $.contextMenu({
        selector: '#openSeadragon1',
        trigger: 'right',
        //构建菜单项build方法在每次右键点击会执行
        build: function ($trigger, e) {
            let canvas = olay.fabricCanvas();
            let anno = canvas.getActiveObject();
            // 选中，且鼠标在选中的标注中，显示删除
            if (anno && canvas.containsPoint(event, anno)) {
                return {
                    callback: (key, options) => {
                        if (key === 'delete') {
                            let canvas = olay.fabricCanvas();
                            let anno = canvas.getActiveObject(); // 被选中的anno
                            canvas.remove(anno); // 删除
                            canvas.requestRenderAll(); // 重新生成画布
                            let guid = anno.guid;
                            let id = anno.id;
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
                        }
                    },
                    items: {
                        "delete": { name: "删除", icon: "delete" }
                    }
                };
            }

        }

    });
};

function InitFabricOverlay(viewer) {
    var isDown;
    // Initialize overlay
    var options = {
        scale: 1000
    }
    var overlay = viewer.fabricjsOverlay(options);
    olay = overlay;
    // Add fabric rectangle
    var rect = {};
    //overlay.fabricCanvas().fireRightClick = true; // 允许右击
    //var rect2 = new fabric.Rect({
    //    left: 666,
    //    top: 666,
    //    //fill: 'red',
    //    fill: '',
    //    width: 200,
    //    height: 200,
    //    stroke: 'red', // 边框颜色
    //    strokeWidth: 3 // 线宽
    //});

    //overlay.fabricCanvas().add(rect2);
    var text = new fabric.Text('Start\n drawing', {
        left: 950,
        top: 150,
        fontSize: 50,
        fontFamily: 'Helvetica',
        textAlign: 'center',
        fill: 'black',
        selectable: false,
        action: 'button'

    });
    overlay.fabricCanvas().add(text);
    // Add fabric circle with text
    var circle2 = new fabric.Circle({
        left: 930,
        top: 100,
        fill: 'lightgray',
        radius: 120,
        selectable: false,
        action: 'button'
    });
    overlay.fabricCanvas().add(circle2);

    var txtbox = new fabric.Textbox('你好', {
        left: 254,
        top: 195,
        width: 300,
        height: 75.03,
        fill: "#ecb2cc",
        angle: 0,

        fontSize: 20,

        fontFamily: "helvetica"
    });
    overlay.fabricCanvas().add(txtbox);

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
                var tmp = JSON.parse(JSON.stringify(rect))
                //$.post("http://localhost:5001/Annotation/StoreAnno", tmp, function (data) {
                //    rect = {};
                //});
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

            if (event.target.type === "path") {
                btnDraw(false, overlay, circle2, text);
            }

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
            btnDraw(false, overlay, circle2, text);
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
        console.log('mouse: over');
        console.log(event);
    });
    //拖动后产生事件
    overlay.fabricCanvas().on('object:modified', event => {
        overlay.fabricCanvas().requestRenderAll(); // 重新生成画布,防止数据未更新
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

    overlay.fabricCanvas().freeDrawingBrush.color = 'red';
    overlay.fabricCanvas().freeDrawingBrush.width = 30;

    // Start free-drawing mode
    overlay.fabricCanvas().on('mouse:down', (event) => {
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
                strokeWidth: 3,
                transparentCorners: true
            });
            overlay.fabricCanvas().add(rect);
            return;
        }

        if (isRealValue(event.target)) {
            if (event.button === 3) {
                //viewer.setMouseNavEnabled(false);
                //viewer.outerTracker.setTracking(false);
            }
            if (event.target.action === 'button') {
                btnDraw(true, overlay, circle2, text);
            }
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
    /**
      * Toggle button on and off
      */
    function btnDraw(flag, over, shape, txt) {
        // Toggle fabric canvas draw
        if (flag) {
            // Disable OSD mousevents
            viewer.setMouseNavEnabled(false);
            viewer.outerTracker.setTracking(false);
            // Activate fabric freedrawing mode
            over.fabricCanvas().isDrawingMode = true;
            // Button
            shape.set('fill', 'lightgreen');
            txt.text = 'Draw';
            txt.left = 990;
            over.fabricCanvas().add(txt);
        } else {
            // Stop drawing & switch back to zoom
            // Add tracking back to OSD
            viewer.setMouseNavEnabled(true);
            viewer.outerTracker.setTracking(true);
            // Disable freedrawing mode
            over.fabricCanvas().isDrawingMode = false;
            // Button
            shape.set('fill', 'lightgray');
            over.fabricCanvas().add(shape);
            txt.text = 'Start\n drawing';
            txt.left = 950;
            over.fabricCanvas().add(txt);
        }
    }
    function registerMouseEvent(overlay) {

    }
}