
var controlPoints = [];

function addControlPoint(point) {
	controlPoints.push(point);
}

function firstControlPoint() {
    return controlPoints[0];
}

function getDistanceToControlPoints(point) {
    var distances = [];
    
    for (i = 0; i < controlPoints.length; i++) {
        var xDiff = point.x - controlPoints[i].x;
        var yDiff = point.y - controlPoints[i].y;
        distances[i] = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
    
    return distances;
}

function changeControlPoint(index, newPosition) {
    controlPoints[index] = newPosition;
}

function getControlPolygonPointPairs() {
    var controlPolygonPointPairs = [];
    
    if (controlPoints.length > 1) {
        for (i = 1; i < controlPoints.length; i++) {
            var pair = {first: controlPoints[i - 1],
                        second: controlPoints[i]};
            controlPolygonPointPairs.push(pair);
        }
    }
    
    return controlPolygonPointPairs;
}

function calculateBezierCurveValueWithDeCasteljau(t) {
    var degree = controlPoints.length - 1;
    
    if (degree < 1) {
        return;
    }
    
    var b = controlPoints;
    for (j = 1; j <= degree; j++) {
        var bNew = [];
        
        for (i = 0; i <= (degree - j); i++) {
            bNew.push({x: ((1 - t) * b[i].x + t * b[i + 1].x),
                       y: ((1 - t) * b[i].y + t * b[i + 1].y)});
        }
        
        b = bNew;
    }
    
    return b[0];
}

function bezierCurveDegreeElevation() {
    var degree = controlPoints.length - 1;
    
    if (degree < 1) {
        return;
    }
    
    var newControlPoints = [controlPoints[0]];
    for (i = 1; i <= degree; i++) {
        newControlPoints.push({x: ((1 - (i / (degree + 1))) * controlPoints[i].x + (i / (degree + 1)) * controlPoints[i - 1].x),
                               y: ((1 - (i / (degree + 1))) * controlPoints[i].y + (i / (degree + 1)) * controlPoints[i - 1].y)});
    }
    
    newControlPoints.push(controlPoints[degree]);
    controlPoints = newControlPoints;
}

function clearControlPoints() {
    controlPoints = [];
}