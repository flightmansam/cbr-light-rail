export const rotateText = (cvs, x, y, radius, centreAngle, widthAngle, txt) => {
    // Split the chars so they can be printed one by one
    let chars = txt.split("")
    // Decide an angle
    let charSpacingAngleDeg = widthAngle;
    cvs.angleMode(cvs.DEGREES);

    cvs.textAlign(cvs.CENTER, cvs.BASELINE)
    cvs.noStroke()

    cvs.push()

    // Let's first move to the center of the circle
    cvs.translate(x, y)

    // First rotate half back so that middle char will come in the center
    cvs.rotate(-centreAngle)
    let segmentAngle = chars.length * charSpacingAngleDeg
    cvs.rotate((-(segmentAngle) / 2) + charSpacingAngleDeg/2)

    for (let i = 0; i < chars.length; i++) {
        cvs.text(chars[i], 0, -radius)

        // Then keep rotating forward per character
        cvs.rotate(charSpacingAngleDeg)
    }

    // Reset all translations we did since the last push() call
    // so anything we draw after this isn't affected
    cvs.pop()

}

function drawDebug(cvs, x, y, radius) {
    cvs.drawingContext.setLineDash([5, 3]);
    cvs.noFill()
    cvs.stroke('grey')
    cvs.circle(x, y, 2*radius)
    
    cvs.fill('grey')
    cvs.circle(x, y, 4)
    
    cvs.line(x, y, x, y - radius)
    
    cvs.drawingContext.setLineDash([]);

}