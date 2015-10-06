
var controlPoints = [];

function addControlPoint(point) {
	controlPoints.push(point);
}

function firstControlPoint() {
    return controlPoints[0];
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