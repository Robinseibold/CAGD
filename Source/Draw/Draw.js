
var canvas;
var canvasContext;

function init() {
    canvas = document.getElementById("coordinateSystem");
    canvasContext = canvas.getContext("2d");
    canvas.addEventListener("click", mouseClicked);
}

function mouseClicked(event) {
    var boundingRect = canvas.getBoundingClientRect();
    var point = {
        x : event.clientX - boundingRect.left,
        y : event.clientY - boundingRect.top
    };
    
    document.getElementById("posText").innerHTML = "Control point added at (" + point.x + ", " + point.y + ")";
    drawPoint(point);
}

function drawPoint(point) {
    addControlPoint(point);

    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 3, 0, (2 * Math.PI));
    canvasContext.stroke();
}

function drawBezierCurve() {
    var startPosition = firstControlPoint();
    canvasContext.moveTo(startPosition.x, startPosition.y);
    
    var tResolution = 1000;
    for(t = 0; t <= tResolution; t++) {
        var newPosition = calculateBezierCurveValueWithDeCasteljau(t / tResolution);
        canvasContext.lineTo(newPosition.x, newPosition.y);
    }
    canvasContext.stroke();
}

function drawControlPolygon() {
    var controlPolygonPointPairs = getControlPolygonPointPairs();
    
    for (pairNumber = 0; pairNumber < controlPolygonPointPairs.length; pairNumber++) {
        var startPoint = controlPolygonPointPairs[pairNumber].first;
        var endPoint = controlPolygonPointPairs[pairNumber].second;
        drawDashedLine(startPoint, endPoint);
    }
}

function drawDashedLine(startPoint, endPoint) {
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
    
    canvasContext.strokeStyle = "#CCCCCC";
    canvasContext.stroke();
    canvasContext.strokeStyle = "#000000";
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    clearControlPoints();
    document.getElementById("posText").innerHTML = "Click on canvas to add control points";
}