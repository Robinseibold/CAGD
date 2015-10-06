
function drawPoint(point) {
    addControlPoint(point);
    
    var canvas = document.getElementById("coordinateSystem");
    var canvasContext = canvas.getContext("2d");
    
    canvasContext.beginPath();
    canvasContext.arc(point.x, point.y, 10, 0, (2 * Math.PI));
    canvasContext.stroke();
}