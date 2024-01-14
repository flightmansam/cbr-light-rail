import * as React from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import montserrat from "./res/Montserrat/static/Montserrat-SemiBold.ttf"
import tcLogo from './res/img/tcc_white.png'


function sketch(p5) {
  let pg;

  let font;
  let img;

  const n_stops = 14;
  let obs_stop = 11;
  let dest_stop;
  var route_dir;

  const changeDest = (dest) => {
    dest_stop = dest
    route_dir = (obs_stop - dest_stop > 0) ? 1 : -1
    if (obs_stop === dest_stop) {
      if (dest_stop === 1) route_dir = 1
      else route_dir = -1
    }
  }
  changeDest(1);

  const station_margin_l = 50;
  const station_margin_r = 140;

  const head_sign_names = {
      1:'Alinga Street',
      14:'Gungahlin Place'
  }

  const stop_short_names = [
    'Alinga St',
    'Elouera St',
    'Ipima St',
    'Macarthur Av',
    'Dickson',
    'Swinden St',
    'Phillip Av',
    'EPIC',
    'Sandford St',
    'Well Station',
    'Nullarbor Av',
    'Mapleton Av',
    'Manning Clk',
    'Gungahlin Pl',
  ]

  p5.preload = () => {
    // Creates a p5.Font object.
    font = p5.loadFont(montserrat);
    img = p5.loadImage(tcLogo);
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    pg = p5.createGraphics(1200, 300);
  }

  p5.draw = () => {
    p5.clear();
    let tcc_grey = p5.color(47, 59, 68);
    let tcc_light_grey = p5.color(115, 130, 135);
    let tcc_red = p5.color(208, 46, 33);
    let tcc_blue = p5.color(69, 137, 204);
    let tcc_black = p5.color('black');
    let tcc_white = p5.color('white');
    let tcc_yellow = p5.color('yellow');
    pg.textFont(font);
    pg.angleMode(p5.DEGREES);
    
    pg.background(tcc_grey);
    p5.background(tcc_black);
    
    pg.fill(tcc_red);
    pg.noStroke();
    pg.rect(0, 10, pg.width, 50)
    
    pg.fill(tcc_white);
    pg.textSize(40);
    pg.textAlign(p5.LEFT, p5.CENTER);
    pg.text(`${p5.hour()}`.padStart(2, '0')+":"+`${p5.minute()}`.padStart(2, '0'), 20, 30);
    
    pg.textSize(80);
    pg.textAlign(p5.LEFT, p5.BOTTOM);
    pg.text(head_sign_names[dest_stop], 20, 180);
    
    pg.textSize(17);
    pg.textAlign(p5.LEFT, p5.TOP);
    pg.text("Transport", pg.width - (20 + 90), 16);
    pg.textAlign(p5.LEFT, p5.BOTTOM);
    pg.text("Canberra", pg.width - (20 + 90), 54);


    
    let im_scale = img.width / img.height;
    let sh = 35;
    let sw = sh*im_scale;
    pg.image(img, pg.width-(20+sw+100), 17.5, sw, sh)
    
    
    pg.fill(tcc_light_grey);
    pg.noStroke();
    pg.rect(0, pg.height - 35, pg.width, 20)
    
    let station_spacing = (pg.width - (station_margin_l+station_margin_r))/(n_stops - 1)
    
    let stop_idx = 1 + (Math.round((p5.second() / 60) * 13))
    
    let progress_end = station_margin_l + (stop_idx - 1.5) * station_spacing
    
    pg.push()
    pg.fill(tcc_blue)
    pg.rect(0, pg.height - 35, progress_end, 20)
    pg.triangle(progress_end, pg.height - 35, progress_end, pg.height - 15, progress_end + 10, pg.height - 25 )
    pg.pop()
    
    for (let i = 1; i < n_stops+1; i++) {
      
      pg.strokeWeight(8);
      
      var ring_colour = (i < stop_idx) ? tcc_blue : tcc_white;
      ring_colour = (i === stop_idx) ? tcc_grey : ring_colour;
      ring_colour = (i === stop_idx && i === n_stops) ? tcc_yellow : ring_colour;
      var spot_colour = (i < stop_idx) ? tcc_grey : tcc_grey;
      spot_colour = (i === stop_idx) ? tcc_yellow: spot_colour;
      var text_colour = (i < stop_idx) ? tcc_light_grey : tcc_white;
      text_colour = (i === stop_idx) ? tcc_yellow: text_colour;
      
        
      let x = station_margin_l + (i - 1) * station_spacing;
      let y = pg.height - 25
      
      pg.stroke(ring_colour)
      pg.fill(spot_colour)
      
      if (i === n_stops) {
        pg.rectMode(p5.RADIUS)
        pg.fill(tcc_red)
        pg.rect(x, y, 15)
        pg.rectMode(p5.CORNER)
      } else if (i === obs_stop) {
        pg.rectMode(p5.RADIUS)
        pg.rect(x, y, 15)
        pg.rectMode(p5.CORNER)
      } else {
        pg.circle(x, y, 30)
      }
      
      let stop_name = (route_dir > 0) ? stop_short_names[15-i-1]: stop_short_names[i-1]
    
      pg.fill(text_colour);
      pg.noStroke();
      pg.translate(x, y);
      pg.rotate(-30)
      pg.textSize(17);
      pg.textAlign(p5.LEFT, p5.CENTER);
      pg.text("        "+stop_name, 0, -5);
      pg.rotate(30)
      pg.translate(-x, -y);
      
    }  
    
    let newH = p5.windowWidth/4.0;
    p5.image(pg, 0, (p5.windowHeight - newH)/2, p5.windowWidth, newH);
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

  p5.mousePressed = () =>  {
    if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
      let fs = p5.fullscreen();
      p5.fullscreen(!fs);
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
    }
  }
}

export default function App() {
  return <ReactP5Wrapper sketch={sketch}/>;
}