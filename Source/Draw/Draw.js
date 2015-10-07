
var canvas;

function init() {
    canvas = document.getElementById("coordinateSystem");
    canvas.addEventListener("click", mouseClicked);
}

function mouseClicked(event) {
    var boundingRect = canvas.getBoundingClientRect();
    var point = {
        x : event.clientX - boundingRect.left,
        y : event.clientY - boundingRect.top
    };
    
    document.getElementById("posText").innerHTML = "Control point added at (" + point.x + ", " + point.y + ")";
    addAndDrawControlPoint(point);
}

function addAndDrawControlPoint(point) {
    addControlPoint(point);
    drawPoint(point);
}

function drawPoint(point) {
    var canvasContext = canvas.getContext("2d");
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 3, 0, (2 * Math.PI));
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
    
    canvasContext.strokeStyle = "#CCCCCC";
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
    drawBezierCurve();
}

function clearBezierCurve() {
    clearCanvas();
    clearControlPoints();
}

function clearCanvas() {
    var canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("posText").innerHTML = "Click on canvas to add control points";
}
