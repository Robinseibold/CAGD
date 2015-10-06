
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
    drawPoint(point);
}

function drawPoint(point) {
    addControlPoint(point);
    
    var canvasContext = canvas.getContext("2d");

    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 3, 0, (2 * Math.PI));
    canvasContext.stroke();
}

function drawBezierCurve() {
    var canvasContext = canvas.getContext("2d");
    
    var startPosition = firstControlPoint();
    canvasContext.moveTo(startPosition.x, startPosition.y);
    
    var tResolution = 1000;
    for(t = 0; t <= tResolution; t++) {
        var newPosition = calculateBezierCurveValueWithDeCasteljau(t / tResolution);
        canvasContext.lineTo(newPosition.x, newPosition.y);
    }
    canvasContext.stroke();
}

function clearCanvas() {
    var canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    clearControlPoints();
}