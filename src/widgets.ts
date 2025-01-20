import {rotateText} from "./texthelpers"
import { FireRating } from "./data";


export enum ImgAlign {
  CENTER = 1,
  TOP_LEFT = 2
}

export const drawImgScaledHeight = (cvs, img, x, y, height, align:ImgAlign=ImgAlign.TOP_LEFT) => {
    let im_scale = img.width / img.height;
    let sw = height * im_scale;

    var img_x, img_y;

    switch (align) {
      case ImgAlign.TOP_LEFT:
        img_x = x
        img_y = y
        break;
      case ImgAlign.CENTER:
        img_x = x - sw/2
        img_y = y - height/2
        break;
      default:
        img_x = 0
        img_y = 0
        break;
    }
    cvs.image(img, img_x, img_y, sw, height)
    return {img_x, img_y, sw, height};

}

export const drawFireDangerRating = (cvs, x, y, width, height, ratingToday, ratingTomorrow) => {
    let arcCenterX = x+width/2
    let arcCenterY = y+height
    let colorModerate     = cvs.color('#64bc4b')
    let colorHigh         = cvs.color('#fcdd47')
    let colorExtreme      = cvs.color('#f78628')
    let colorCatastrophic = cvs.color('#b01f24')
    let Black = cvs.color('black')
    let White = cvs.color('white')

    cvs.angleMode(cvs.DEGREES);
    cvs.strokeWeight(2);


    cvs.fill(Black);
    cvs.stroke(White)
    cvs.arc(arcCenterX, arcCenterY, width, width, -180, -180+45, cvs.PIE)
    cvs.arc(arcCenterX, arcCenterY, width, width, -180+45, -180+90, cvs.PIE)
    cvs.arc(arcCenterX, arcCenterY, width, width, -180+90, -180+135, cvs.PIE)
    cvs.arc(arcCenterX, arcCenterY, width, width, -180+135, 0, cvs.PIE)

    let innerArc = width*0.88
    cvs.fill(colorModerate);
    cvs.stroke(Black);
    cvs.arc(arcCenterX, arcCenterY, innerArc, innerArc, -180, -180+45, cvs.PIE)
    cvs.fill(colorHigh);
    cvs.arc(arcCenterX, arcCenterY, innerArc, innerArc, -180+45, -180+90, cvs.PIE)
    cvs.fill(colorExtreme);
    cvs.arc(arcCenterX, arcCenterY, innerArc, innerArc, -180+90, -180+135, cvs.PIE)
    cvs.fill(colorCatastrophic);
    cvs.arc(arcCenterX, arcCenterY, innerArc, innerArc, -180+135, 0, cvs.PIE)

    cvs.textSize(width*0.04)
    cvs.fill(White)
  
    let textRadius = width*0.915/2
    let textKerning = 3.2 //degrees per letter
    rotateText(cvs, arcCenterX, arcCenterY, textRadius, 90-22.5, textKerning, "MODERATE")
    rotateText(cvs, arcCenterX, arcCenterY, textRadius, 45-22.5, textKerning, "HIGH")
    rotateText(cvs, arcCenterX, arcCenterY, textRadius, -22.5,   textKerning, "EXTREME")
    rotateText(cvs, arcCenterX, arcCenterY, textRadius, -45-22.5, textKerning, "CATASTROPHIC")


    let centreCircRadius = width*0.2/2
    cvs.drawingContext.save()
    cvs.beginClip()
    cvs.circle(arcCenterX, arcCenterY, width)
    cvs.endClip()

    cvs.stroke(Black);
    cvs.fill(White);
    let rectheight = centreCircRadius*0.35
    cvs.rect(x-5, y+height-rectheight, width*0.5+5, rectheight)
    cvs.drawingContext.restore()

    cvs.stroke(Black);
    cvs.noFill()
    cvs.arc(arcCenterX, arcCenterY, width, 2*height, -180, 0, cvs.PIE)
    cvs.fill(White);
    cvs.arc(arcCenterX, arcCenterY, centreCircRadius, centreCircRadius, -180, 0)

    const drawArrow = (rating:FireRating) => {
        cvs.push()
        let needleAngle = 0
        switch (rating) {
            case FireRating.UNKNOWN:
                needleAngle = 0
                break;
            case FireRating.MODERATE:
                needleAngle = 45 - 22.5
                break; 
            case FireRating.HIGH:
                needleAngle = 90 - 22.5
                break;    
            case FireRating.EXTREME:
                needleAngle = 135 - 22.5
                break;    
            case FireRating.CATASTROPHIC:
                needleAngle = 180 - 22.5
                break;                     
            default:
                break;
        }
        cvs.translate(arcCenterX, arcCenterY)
        cvs.rotate(needleAngle)
        
        let arrowLength = width*0.35
        let arrowWidth = width*0.025
        let arrowHead = arrowWidth*1.1

        cvs.beginShape()
        cvs.vertex(arrowWidth/2, -arrowWidth/2)
        cvs.vertex(-arrowLength+arrowHead, -arrowWidth/2)
        cvs.vertex(-arrowLength, 0)
        cvs.vertex(-arrowLength+arrowHead, arrowWidth/2)
        cvs.vertex(arrowWidth/2, arrowWidth/2)
        cvs.vertex(arrowWidth/2, -arrowWidth/2)
        cvs.endShape()
        cvs.pop()
    } 


    cvs.drawingContext.setLineDash([5, 5]);
    drawArrow(ratingTomorrow)
    cvs.drawingContext.setLineDash([]);
    drawArrow(ratingToday)

  }


export const draw_UV_index = (cvs, img, x, y, width, height, UV_index) =>
{
    cvs.image(img, x, y, width, height)
    cvs.noFill()
    cvs.rect(x, y, width, height)


    let arrowLength = width*0.6
    let arrowWidth = 8
    let arrowHead = arrowWidth*1.1
    var sanatisedUV = (UV_index > 13) ? 13: UV_index
    sanatisedUV = (UV_index < 0) ? 0: sanatisedUV
    let UV_needle_height = height*(1-(sanatisedUV/13))
    
    cvs.fill(cvs.color('white'))
    cvs.push()
    cvs.translate(x+width, y+UV_needle_height)
    cvs.beginShape()
    cvs.vertex(arrowWidth/2, -arrowWidth/2)
    cvs.vertex(-arrowLength+arrowHead, -arrowWidth/2)
    cvs.vertex(-arrowLength, 0)
    cvs.vertex(-arrowLength+arrowHead, arrowWidth/2)
    cvs.vertex(arrowWidth/2, arrowWidth/2)
    cvs.vertex(arrowWidth/2, -arrowWidth/2)
    cvs.endShape()

    cvs.noStroke()
    cvs.textSize(20);
    cvs.textAlign(cvs.LEFT, cvs.BOTTOM);
    cvs.text(UV_index.toPrecision(2), 10, 10)

    cvs.pop()
}
  
export const draw_temp = (cvs, x, y, width, height, currentTemp, forecastHigh, forecastLow ) => {
    
    // cvs.noFill()
    // cvs.rect(x, y, width, height)

    cvs.fill(cvs.color('white'))
    cvs.noStroke()

    cvs.textAlign(cvs.LEFT, cvs.TOP);
    cvs.textSize(height);
    cvs.text(Math.round(currentTemp)+"°C", x, y+0.1*height)

    cvs.textAlign(cvs.RIGHT, cvs.TOP);
    cvs.textSize(height/5);
    cvs.text(Math.round(forecastLow)+"°C", x+width, y)

    cvs.textAlign(cvs.RIGHT, cvs.BOTTOM);
    cvs.textSize(height/5);
    cvs.text(Math.round(forecastHigh)+"°C", x+width, y+height)

}