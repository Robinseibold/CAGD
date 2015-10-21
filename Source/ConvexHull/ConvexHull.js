
function convexHullByJarvisMarch(points) {
    var numberOfPoints = points.length;
    
    if (numberOfPoints < 2) {
        return [];
    } else if (numberOfPoints == 2) {
        return points;
    }
    
    
    var pointOnHull = points[0];
    for (i = 1; i < points.length; i++) {
        if (points[i].x < pointOnHull.x) {
            pointOnHull = points[i];
        }
    }

    var pointsOnHull = [];
    var i = 0;
    do {
        pointsOnHull.push(pointOnHull);
        var endPoint = points[0];
        for (j = 1; j < points.length; j++) {
            if ((endPoint == pointOnHull) || pointIsToTheLeftOfLine(points[j], pointsOnHull[i], endPoint)) {
                endPoint = points[j];
            }
        }
        i += 1;
        pointOnHull = endPoint;
    } while (endPoint != pointsOnHull[0]);
    
    pointsOnHull.push(pointsOnHull[0]);
    return pointsOnHull;
}

function pointIsToTheLeftOfLine(point, linePointOne, linePointTwo) {
    var value = (linePointTwo.x - linePointOne.x) * (point.y - linePointOne.y) -
                (linePointTwo.y - linePointOne.y) * (point.x - linePointOne.x);
    return (value > 0);
}
