import {
  P5CanvasInstance,
  SketchProps
} from "@p5-wrapper/react";
import montserrat from "./res/Montserrat/static/Montserrat-SemiBold.ttf"
import tcLogo from './res/img/tcc_white.png'
import {stop_short_names, head_sign_names} from "./constants"
import {Location, Status, Stop} from './helpers'
import dayjs from "dayjs";


type SignSketchProps = SketchProps & {
  obs_stop: number;
  dest_stop: number;
  arrivals : Location[];
}

function sketch(p5: P5CanvasInstance<SignSketchProps>) {
  let pg;
  let cvs;

  let font;
  let img;

  const station_margin_l = 50;
  const station_margin_r = 140;

  const n_stops = 14;
  var obs_stop;
  var dest_stop;
  var route_dir;
  var arrivals = [];

  const updateRouteDir = () => {
    route_dir = (obs_stop - dest_stop > 0) ? 1 : -1
    if (obs_stop === dest_stop) {
      if (dest_stop === 1) route_dir = 1
      else route_dir = -1
    }
  }

  const changeDest = (dest: number) => {
    dest_stop = dest
    updateRouteDir()
  }
  changeDest(1);

  const changeStop = (stop: number) => {
    obs_stop = stop
    updateRouteDir()
  }
  changeStop(14);

  const stop_to_seq = (stop: Stop) => {

    switch (parseInt(dest_stop)){
      case Stop.alg: {
        return 15 - stop
      }
      case Stop.ggn: {
        return stop
      }
      default: {
        return 0
      }
    }
  }

  const fullscreen = () => {
    if (p5.mouseX > 0 && p5.mouseX < p5.width && p5.mouseY > 0 && p5.mouseY < p5.height) {
      let fs = p5.fullscreen();
      p5.fullscreen(!fs);
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
    }
  }

  p5.preload = () => {
    // Creates a p5.Font object.
    font = p5.loadFont(montserrat);
    img = p5.loadImage(tcLogo);
  }

  p5.updateWithProps = (props: SignSketchProps) => {
    if (props.obs_stop && props.obs_stop >= 0 && props.obs_stop <= n_stops) {
      changeStop(props.obs_stop)
    }

    if (props.dest_stop && props.dest_stop >= 0 && props.dest_stop <= n_stops) {
      changeDest(props.dest_stop)
    }

    if (props.arrivals) {
      arrivals = props.arrivals
    }
  }

  p5.setup = () => {
    cvs = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    pg = p5.createGraphics(1200, 300);
    cvs.doubleClicked(fullscreen);
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
    let tm_str = dayjs()
    pg.text(`${tm_str.format("HH:mm")}`, 20, 30);
    
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
    
    
    let station_spacing = (pg.width - (station_margin_l+station_margin_r))/(n_stops - 1)
    
    var stop_idx = 0
    var arr_idx = []

    if (arrivals.length > 0 ) {
      pg.fill(tcc_light_grey);
      pg.noStroke();
      pg.rect(0, pg.height - 35, pg.width, 20)

      arr_idx = arrivals.map((a) => a.seq)
      arrivals.sort((a, b) => b.seq - a.seq)
      let filtered_arr = arrivals.filter((arr) => arr.seq <= stop_to_seq(obs_stop)) // need to deal with idx to stop conversion??
      let next_arr = (filtered_arr.length > 0) ? filtered_arr[0] : null
      stop_idx = (next_arr) ? next_arr.seq : 0
      
      var progress_end = station_margin_l + (stop_idx - 1.5) * station_spacing

      if (next_arr && next_arr.status === Status.stopped_at) progress_end += (0.5) * station_spacing
      
      pg.push()
      pg.fill(tcc_blue)
      pg.rect(0, pg.height - 35, progress_end, 20)
      pg.triangle(progress_end, pg.height - 35, progress_end, pg.height - 15, progress_end + 10, pg.height - 25 )
      pg.pop()
    
    
    
      for (let i = 1; i < n_stops+1; i++) {
        
        pg.strokeWeight(8);
        
        var ring_colour = (i <= stop_idx) ? tcc_blue : tcc_white;
        ring_colour = (arr_idx.includes(i)) ? tcc_grey : ring_colour;
        ring_colour = (arr_idx.includes(i) && i === n_stops) ? tcc_yellow : ring_colour;
        var spot_colour = (i < stop_idx) ? tcc_grey : tcc_grey;
        spot_colour = (arr_idx.includes(i)) ? tcc_yellow: spot_colour;
        var text_colour = (i < stop_idx) ? tcc_light_grey : tcc_white;
        text_colour = (arr_idx.includes(i)) ? tcc_yellow: text_colour;
        
          
        let x = station_margin_l + (i - 1) * station_spacing;
        let y = pg.height - 25
        
        pg.stroke(ring_colour)
        pg.fill(spot_colour)
        
        if (i === n_stops) {
          pg.rectMode(p5.RADIUS)
          pg.fill(tcc_red)
          pg.rect(x, y, 15)
          pg.rectMode(p5.CORNER)
        } else if (i == (stop_to_seq(obs_stop))) {
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
    } else {

      pg.fill(tcc_black);
      pg.noStroke();
      pg.rect(0, pg.height - 100, pg.width, 90)

      pg.fill(tcc_white);
      pg.textSize(50);
      pg.textAlign(p5.LEFT, p5.BOTTOM);
      pg.text("No scheduled services.", 20, pg.height-25);
    }

    
    let newH = p5.windowWidth/4.0;
    p5.image(pg, 0, (p5.windowHeight - newH)/2, p5.windowWidth, newH);
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

}


export default sketch

  