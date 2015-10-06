
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
    
    document.getElementById("posText").innerHTML = "x: " + point.x + " y: " + point.y;
    drawPoint(point);
}

function drawPoint(point) {
    addControlPoint(point);
    
    var canvasContext = canvas.getContext("2d");

    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 3, 0, (2 * Math.PI));
    canvasContext.stroke();

}