import {rotateText} from "./texthelpers"
import { FireRating } from "./data";
import {COLORS, UV_INDEX_COLORS} from "./colors"


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
    
    let tcc_grey = cvs.color(COLORS.tcc_grey);
    let tcc_light_grey = cvs.color(COLORS.tcc_light_grey);
    let tcc_red = cvs.color(COLORS.tcc_red);
    let tcc_blue = cvs.color(COLORS.tcc_blue);
    let tcc_black = cvs.color(COLORS.tcc_black);
    let tcc_white = cvs.color(COLORS.tcc_white);
    let tcc_yellow = cvs.color(COLORS.tcc_yellow);

    UV_index = 6


    cvs.drawingContext.save()
    cvs.beginClip()
    cvs.noStroke()
    cvs.rect(x, y, width*0.5, height, width*0.5/2)
    cvs.endClip()
    cvs.image(img, x, y, width, height)

    cvs.drawingContext.restore()

    let arrowLength = width*0.7
    let arrowWidth = 8
    let arrowHead = arrowWidth*1.1
    var sanatisedUV = (UV_index > 13) ? 13: UV_index
    sanatisedUV = (UV_index < 0) ? 0: sanatisedUV
    let UV_needle_height = height*(1-(sanatisedUV/13))
    
    cvs.noStroke() 
    cvs.fill(cvs.color('white'))
    cvs.push()
    cvs.translate(x+width*0.5/2, y+UV_needle_height)

    // let circX = x+width/2
    // let circY = y+UV_needle_height
    let uv_spot_color = cvs.color(UV_INDEX_COLORS[Math.round(sanatisedUV)])
    cvs.textSize(25);
    cvs.stroke(tcc_grey)
    cvs.fill(uv_spot_color)
    cvs.strokeWeight(8);
    cvs.circle(0, 0, 30)

    // cvs.textAlign(cvs.CENTER, cvs.BOTTOM);
    // cvs.fill(tcc_white);
    // cvs.noStroke();
    // cvs.translate(circX, circY);
    // // cvs.textAlign(cvs.LEFT, cvs.CENTER);
    // // cvs.text("    "+Math.round(temp)+"° in "+index+"h", 0, -5);
    // cvs.text(Math.round(temp)+"°", 0, -15);
    // cvs.translate(-circX, -circY);

    cvs.noStroke()
    cvs.fill(tcc_white)
    cvs.textSize(20);
    cvs.textAlign(cvs.LEFT, cvs.CENTER);
    cvs.text(UV_index.toPrecision(2), 20, 0)

    cvs.pop()
}

const draw_temp_graph = (cvs, x, y, width, height, currentTemp, temps) => {

    let tcc_grey = cvs.color(COLORS.tcc_grey);
    let tcc_light_grey = cvs.color(COLORS.tcc_light_grey);
    let tcc_red = cvs.color(COLORS.tcc_red);
    let tcc_blue = cvs.color(COLORS.tcc_blue);
    let tcc_black = cvs.color(COLORS.tcc_black);
    let tcc_white = cvs.color(COLORS.tcc_white);
    let tcc_yellow = cvs.color(COLORS.tcc_yellow);

    // cvs.fill(tcc_light_grey)
    // cvs.noStroke()
    // cvs.rect(x, y, width, height)
    let strokeSize = 20;
    let minTemp = Math.min(...temps)
    let maxTemp = Math.max(...temps)

    let timeStepSize = (width-strokeSize)/(temps.length-1)
    var tempX = x+(strokeSize/2)
    let tempY = y+height-(strokeSize/2)
    let tempStepSize = (height-strokeSize)/(maxTemp-minTemp)

    let minTempCircle;
    let maxTempCircle;
    

    
    var index = 0

    cvs.noFill()
    cvs.stroke(tcc_blue)
    cvs.strokeWeight(strokeSize);
    cvs.beginShape()
    cvs.strokeJoin(cvs.ROUND);
    temps.forEach(temp => {
        cvs.vertex(tempX+timeStepSize*index, tempY-((temp-minTemp)*tempStepSize))
        if((temp == minTemp) && (index > 2)) {
            minTempCircle = [tempX+timeStepSize*index, tempY-((temp-minTemp)*tempStepSize), index]
        }

        if((temp == maxTemp) && (index > 2)) {
            maxTempCircle = [tempX+timeStepSize*index, tempY-((temp-minTemp)*tempStepSize), index]
        }
        index++
    });
    cvs.endShape()
    cvs.strokeJoin(cvs.MITRE);

    const drawTempCircle = (circX, circY, temp, index) => {
        cvs.textSize(25);
        cvs.stroke(tcc_grey)
        cvs.fill(tcc_white)
        cvs.strokeWeight(8);
        cvs.circle(circX, circY, 30)

        cvs.textAlign(cvs.CENTER, cvs.BOTTOM);
        cvs.fill(tcc_white);
        cvs.noStroke();
        cvs.translate(circX, circY);
        // cvs.textAlign(cvs.LEFT, cvs.CENTER);
        // cvs.text("    "+Math.round(temp)+"° in "+index+"h", 0, -5);
        cvs.text(Math.round(temp)+"°", 0, -15);
        cvs.translate(-circX, -circY);
    }

    if (minTempCircle){
        drawTempCircle(minTempCircle[0], minTempCircle[1], minTemp, minTempCircle[2])
    }

    if (maxTempCircle){
        drawTempCircle(maxTempCircle[0], maxTempCircle[1], maxTemp, maxTempCircle[2])
    }
    cvs.fill(tcc_light_grey)
    cvs.noStroke()
    cvs.textSize(25);
    cvs.textAlign(cvs.CENTER, cvs.TOP);
    for (let index = 0; index < temps.length; index++) {
        if ((index % 4 == 0) && (index != 0)) {
            cvs.text(index+"h", tempX+timeStepSize*index, y+height+5)
        }
        index++
        
    }


    cvs.fill(tcc_yellow)
    cvs.stroke(tcc_grey)
    cvs.rectMode(cvs.RADIUS)
    cvs.rect(x+(strokeSize/2), tempY-((currentTemp-minTemp)*tempStepSize), 15)
    cvs.rectMode(cvs.CORNER)
    // cvs.circle(, 30)

}
  
export const draw_temp = (cvs, x, y, width, height, currentTemp, forecastHigh, forecastLow, temps=[] ) => {

    let tcc_light_grey = cvs.color(COLORS.tcc_light_grey);
    let tcc_white = cvs.color(COLORS.tcc_white);

    // cvs.fill(tcc_light_grey)
    // cvs.noStroke()
    // cvs.rect(x, y, width, height)



    let tempBoxMargin = width*0.07
    let tempBoxX = x+tempBoxMargin+150
    let tempBoxY = y+tempBoxMargin
    let tempBoxWidth = width-2*tempBoxMargin-110
    let tempBoxHeight = height-2*tempBoxMargin

    draw_temp_graph(cvs, tempBoxX, tempBoxY, tempBoxWidth, tempBoxHeight, currentTemp, temps)

    cvs.fill(tcc_white)
    cvs.noStroke()

    cvs.textAlign(cvs.LEFT, cvs.CENTER);
    cvs.textSize(80);
    cvs.text(Math.round(currentTemp)+"°C", x-10, y+0.5*height)
    // cvs.textSize(22);
    // cvs.text("Temp. now", x, y+0.5*height+25)
}