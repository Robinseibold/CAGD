
var bezierCurves;
var activeCurveIndex;

function initBezier() {
    activeCurveIndex = 0;
    bezierCurves = [];
    bezierCurves[activeCurveIndex] = [];
}

function addBezierCurve() {
    if (bezierCurves[activeCurveIndex].length > 0) {
        activeCurveIndex += 1;
        bezierCurves[activeCurveIndex] = [];
    }
}

function addControlPoint(point) {
    bezierCurves[activeCurveIndex].push(point);
}

function firstControlPoint(curveIndex) {
    return bezierCurves[curveIndex][0];
}

function getDistanceToControlPoints(point) {
    var distances = [];
    
    for (i = 0; i < bezierCurves[activeCurveIndex].length; i++) {
        var xDiff = point.x - bezierCurves[activeCurveIndex][i].x;
        var yDiff = point.y - bezierCurves[activeCurveIndex][i].y;
        distances[i] = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
    
    return distances;
}

function changeControlPoint(index, newPosition) {
    bezierCurves[activeCurveIndex][index] = newPosition;
}

function getControlPolygonPointPairs(curveIndex) {
    var controlPolygonPointPairs = [];
    
    if (bezierCurves[curveIndex].length > 1) {
        for (i = 1; i < bezierCurves[curveIndex].length; i++) {
            var pair = {first: bezierCurves[curveIndex][i - 1],
                        second: bezierCurves[curveIndex][i]};
            controlPolygonPointPairs.push(pair);
        }
    }
    
    return controlPolygonPointPairs;
}

function calculateBezierCurveValueWithDeCasteljau(t, curveIndex) {
    var degree = bezierCurves[curveIndex].length - 1;
    
    if (degree < 1) {
        return;
    }
    
    var b = bezierCurves[curveIndex];
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
    var degree = bezierCurves[activeCurveIndex].length - 1;
    
    if (degree < 1) {
        return;
    }
    
    var newControlPoints = [bezierCurves[activeCurveIndex][0]];
    for (i = 1; i <= degree; i++) {
        newControlPoints.push({x: ((1 - (i / (degree + 1))) * bezierCurves[activeCurveIndex][i].x + (i / (degree + 1)) * bezierCurves[activeCurveIndex][i - 1].x),
                               y: ((1 - (i / (degree + 1))) * bezierCurves[activeCurveIndex][i].y + (i / (degree + 1)) * bezierCurves[activeCurveIndex][i - 1].y)});
    }
    
    newControlPoints.push(bezierCurves[activeCurveIndex][degree]);
    bezierCurves[activeCurveIndex] = newControlPoints;
}

function clearActiveBezierCurve() {
    if (bezierCurves.length < 2) {
        bezierCurves[activeCurveIndex] = [];
    }else {
        bezierCurves.splice(activeCurveIndex, 1);
        activeCurveIndex = activeCurveIndex - 1;
    }
}
