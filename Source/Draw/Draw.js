
var canvas;
var controlPointRadius;
var isMovingControlPoint;
var isDragging;
var movingControlPointIndex;
var isShowingCurve;
var isShowingControlPolygon;
var isShowingConvexHull;

function init() {
    canvas = document.getElementById("coordinateSystem");
    canvas.addEventListener("mousedown", mouseDown);
    
    controlPointRadius = 3;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvasContext.canvas.width  = window.innerWidth;
    canvasContext.canvas.height = window.innerHeight;
    
    isMovingControlPoint = false;
    isShowingCurve = false;
    isShowingControlPolygon = false;
    isShowingConvexHull = false;
}

function mouseDown() {
    var boundingRect = canvas.getBoundingClientRect();
    var mouseLocation = {
        x : event.clientX - boundingRect.left,
        y : event.clientY - boundingRect.top
    };
    
    var distanceToControlPoints = getDistanceToControlPoints(mouseLocation);
    
    for (i = 0; i < distanceToControlPoints.length; i++) {
        if (distanceToControlPoints[i] < controlPointRadius) {
            isMovingControlPoint = true;
            movingControlPointIndex = i;
            break;
        }
    }
    
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
}

function mouseMove(event) {
    isDragging = true;
    if (isMovingControlPoint) {
        var boundingRect = canvas.getBoundingClientRect();
        var newPos = {
            x : event.clientX - boundingRect.left,
            y : event.clientY - boundingRect.top
        };
    
        if (newPos.x > canvas.width) {
            newPos.x = canvas.width;
        }else if (newPos.x < 0) {
            newPos.x = 0;
        }
        if (newPos.y > canvas.height) {
            newPos.y = canvas.height;
        }else if (newPos.y < 0) {
            newPos.y = 0;
        }
    
        changeControlPoint(movingControlPointIndex, newPos);
        updateScreen();
    }
}

function mouseUp(event) {
    if (isMovingControlPoint) {
        isMovingControlPoint = false;
    }else if(!isDragging) {
        var boundingRect = canvas.getBoundingClientRect();
        var point = {
            x : event.clientX - boundingRect.left,
            y : event.clientY - boundingRect.top
        };
        addAndDrawControlPoint(point);
        updateScreen();
    }
    isDragging = false;
    canvas.addEventListener("mousedown", mouseDown);
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
}

function updateScreen() {
    clearCanvas();
    drawControlPoints();
    
    if (isShowingControlPolygon) {
        drawControlPolygon();
    }
    if (isShowingCurve) {
        drawBezierCurve();
    }
    if (isShowingConvexHull) {
        drawConvexHull();
    }
}

function addAndDrawControlPoint(point) {
    addControlPoint(point);
    drawPoint(point);
}

function drawControlPoints() {
    for(i = 0; i < controlPoints.length; i++){
        drawPoint(controlPoints[i]);
    }
}

function drawPoint(point) {
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, controlPointRadius, 0, (2 * Math.PI));
    canvasContext.stroke();
    canvasContext.closePath();
}

function drawBezierCurve() {
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    var startPosition = firstControlPoint();
    canvasContext.moveTo(startPosition.x, startPosition.y);
    
    var tResolution = 1000;
    for(t = 0; t <= tResolution; t++) {
        var newPosition = calculateBezierCurveValueWithDeCasteljau(t / tResolution);
        canvasContext.lineTo(newPosition.x, newPosition.y);
    }
    canvasContext.stroke();
    canvasContext.closePath();
    isShowingCurve = true;
}

function showOrHideCurveProperty(sender) {
    highlightIcon(sender);
    if (sender.id == 'curve') {
        if (!isShowingCurve) {
            drawBezierCurve();
        }
    }else if (sender.id == 'controlPolygon') {
        if (!isShowingControlPolygon) {
            drawControlPolygon();
        }else {
            isShowingControlPolygon = false;
            updateScreen();
        }
    }else if (sender.id == 'convexHull') {
        if (!isShowingConvexHull) {
            drawConvexHull();
        }else {
            isShowingConvexHull = false;
            updateScreen();
        }
    }
}

function drawControlPolygon() {
    var controlPolygonPointPairs = getControlPolygonPointPairs();
    
    for (pairNumber = 0; pairNumber < controlPolygonPointPairs.length; pairNumber++) {
        var startPoint = controlPolygonPointPairs[pairNumber].first;
        var endPoint = controlPolygonPointPairs[pairNumber].second;
        drawDashedLine(startPoint, endPoint, "#CCCCCC");
    }
    
    isShowingControlPolygon = true;
}

function drawConvexHull() {
    var pointsOnConvexHull = convexHullByJarvisMarch(controlPoints);
    for (pointIndex = 0; pointIndex < (pointsOnConvexHull.length - 1); pointIndex++) {
        drawDashedLine(pointsOnConvexHull[pointIndex], pointsOnConvexHull[pointIndex + 1], "#000000");
    }
    
    isShowingConvexHull = true;
}

function drawDashedLine(startPoint, endPoint, color) {
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    
    var xDiff = endPoint.x - startPoint.x;
    var yDiff = endPoint.y - startPoint.y;
    var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    var dashLength = 3;
    var numberOfDashes = Math.floor(distance / dashLength);
    var deltaX = xDiff / numberOfDashes;
    var deltaY = yDiff / numberOfDashes;
    for (i = 0; i < numberOfDashes; i++) {
        if(i % 2 == 0){
            canvasContext.moveTo(startPoint.x + i * deltaX, startPoint.y + i * deltaY);
        }else {
            canvasContext.lineTo(startPoint.x + i * deltaX, startPoint.y + i * deltaY);
        }
    }
    
    canvasContext.strokeStyle = color;
    canvasContext.stroke();
    canvasContext.closePath();
    canvasContext.strokeStyle = "#000000";
}

function drawDegreeElevatedBezierCurve() {
    bezierCurveDegreeElevation()
    clearCanvas();
    
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    for (i = 0; i < controlPoints.length; i++) {
        drawPoint(controlPoints[i]);
    }
    canvasContext.closePath();
    updateScreen();
}

function clearBezierCurve() {
    clearCanvas();
    clearControlPoints();
    isShowingCurve = false;
}

function clearCanvas() {
    var canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}
