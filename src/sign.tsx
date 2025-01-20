import {
  P5CanvasInstance,
  SketchProps
} from "@p5-wrapper/react";
import akkurat from "./res/Akkurat-Bold.ttf"
import akkuratRegular from "./res/Akkurat-Regular.ttf"
import tcLogo from './res/img/tcc_white.png'
import UV_index from './res/img/UV_index.png'
import { stop_short_names, head_sign_names } from "./constants"
import { Arrival, Status, stop_to_seq, DataStatus } from './helpers'
import dayjs from "dayjs";
import { drawImgScaledHeight, drawFireDangerRating, draw_UV_index, draw_temp } from "./widgets";
import { get_fire_rating, get_weather } from "./data";



type SignSketchProps = SketchProps & {
  obs_stop: number;
  dest_stop: number;
  arrivals: Arrival[];
  cycle_pages: Boolean;
  data_status: DataStatus;
}


function is_valid_next_arr(arr: Arrival, obs_stop, dest_stop) {
  let seq = stop_to_seq(obs_stop, dest_stop);
  if (arr.seq <= seq) {
    if (arr.seq == seq && arr.status == Status.stopped_at && arr.time_min < -0.16667) return false
    return true
  }

  return false
}

function sketch(p5: P5CanvasInstance<SignSketchProps>) {
  let pg;
  let cvs;

  let font;
  let regularFont;
  let img;
  let UV_img;

  const station_margin_l = 50;
  const station_margin_r = 140;

  const n_stops = 14;
  var obs_stop;
  var dest_stop;
  var route_dir;
  var click_state = 2;
  var cycle_pages = false;
  var page_idx = 0;
  let FR_today, FR_tomorrow
  get_fire_rating().then((response) => {
    FR_today = response[0]
    FR_tomorrow = response[1]
  })
  let weather;
  get_weather().then((response) => weather=response)
   
  var data_status = DataStatus.loading
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

  const cyclePageIdx = () => {
    let seconds = dayjs().second()
    if ((seconds > 0 && seconds <= 10) || (seconds > 20 && seconds <= 30) || (seconds > 40 && seconds <= 50)) {
      click_state = 1
    } else {
      click_state = 0
    }
  }

  

    const drawTCLogo = (cvs, img, cx, cy, height, bold:boolean=false) => {
    let cell_size = height/10
    let text_offset = 2*cell_size
    if (!bold) cvs.textFont(regularFont);
    cvs.fill(p5.color('white'));
    cvs.textSize(height * 0.48);

    let maxTextwidth = p5.textWidth("Transport")
    let x = cx - (maxTextwidth + text_offset + 18*cell_size)
    let y = cy - height/2

    let {img_x, img_y, sw} = drawImgScaledHeight(cvs, img, x, y, height)
    cvs.textAlign(p5.LEFT, p5.TOP);
    cvs.text("Transport", img_x + sw + text_offset, img_y+cell_size);
    cvs.textAlign(p5.LEFT, p5.BASELINE);
    cvs.text("Canberra", img_x + sw +text_offset, img_y+height-cell_size);
    cvs.textFont(font);
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
    font = p5.loadFont(akkurat);
    regularFont = p5.loadFont(akkuratRegular);
    img = p5.loadImage(tcLogo);
    UV_img = p5.loadImage(UV_index);
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

    if (props.data_status) {
      data_status = props.data_status
    }

    if (props.cycle_pages) {
      cycle_pages = Boolean(props.cycle_pages)
    }
  }

  p5.setup = () => {
    cvs = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    pg = p5.createGraphics(1200, 300);
    cvs.doubleClicked(fullscreen);

    p5.mouseClicked = () => {
      switch (click_state) {
        case 0:
          click_state = 1
          break;
        case 1:
          click_state = 2
          break;
        case 2:
          click_state = 0
          break;      
        default:
          click_state = click_state
          break;
      }
    }
  }

  p5.draw = () => {
    p5.clear();
    if (cycle_pages) cyclePageIdx();

    let tcc_grey = p5.color(51, 62, 72);
    let tcc_light_grey = p5.color(115, 130, 135);
    let tcc_red = p5.color(189, 0, 33);
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
    pg.text(`${tm_str.format("HH:mm")}`, 20, 35);

    drawTCLogo(pg, img, pg.width - (20 + 45), 35, 35, true)



    let station_spacing = (pg.width - (station_margin_l + station_margin_r)) / (n_stops - 1)

    var stop_idx = 0
    var arr_idx = []

    if (data_status == DataStatus.live) { 

      arr_idx = arrivals.map((a) => a.seq)
      arrivals.sort((a, b) => a.time_min - b.time_min)
      let filtered_arr = arrivals.filter((arr) => is_valid_next_arr(arr, obs_stop, dest_stop)) // need to deal with idx to stop conversion??
      let next_arr = (filtered_arr.length > 0) ? filtered_arr[0] : null
      var time_str
      stop_idx = (next_arr) ? next_arr.seq : 0

      const drawNextArr = () => {
        if (next_arr && next_arr.dest) {
          pg.textSize(80);
          pg.textAlign(p5.LEFT, p5.BOTTOM);
          pg.text(head_sign_names[next_arr.dest], 20, 180);
        }
        pg.fill(tcc_white)
        pg.textSize(40);
        pg.textAlign(p5.RIGHT, p5.TOP);
        pg.text("Departs", pg.width - 20, 65);
  
        if (next_arr) {
          var unit = "min"
          if (next_arr.time_min < 1.0 && next_arr.time_min >= -1.0) {
            unit = "Due"
          }
          else if (next_arr.time_min < -5.0) {
            unit = "Delayed"
          } else {
            var time_str = `${Math.floor(Math.abs(next_arr.time_min))}`
            var tm_offset = 0;
            if (next_arr.time_min < 0) {
              unit += " late"
              tm_offset = 80
            }
            pg.textSize(80);
            pg.textAlign(p5.RIGHT, p5.BOTTOM);
            pg.text(time_str, pg.width - 200 - tm_offset, 183);
  
          }
  
          pg.textSize(65);
          pg.textAlign(p5.RIGHT, p5.BOTTOM);
          pg.text(unit, pg.width - 20, 180);
  
        }
      }

      if (click_state == 0) {

        drawNextArr()

        pg.fill(tcc_light_grey);
        pg.noStroke();
        pg.rect(0, pg.height - 35, pg.width, 20)


        var progress_end = station_margin_l + (stop_idx - 1.5) * station_spacing

        if (next_arr && next_arr.status === Status.stopped_at) progress_end += (0.5) * station_spacing

        //dark grey phantom arrow
        pg.fill(tcc_grey)
        pg.beginShape()
        pg.vertex(0, pg.height - 35)
        pg.vertex(progress_end + 4, pg.height - 35)
        pg.vertex(progress_end + 14, pg.height - 25)
        pg.vertex(progress_end + 4, pg.height - 15)
        pg.vertex(0, pg.height - 15)
        pg.endShape(pg.CLOSE)

        // blue arrow on top
        pg.fill(tcc_blue)
        pg.beginShape()
        pg.vertex(0, pg.height - 35)
        pg.vertex(progress_end - 4, pg.height - 35)
        pg.vertex(progress_end + 6, pg.height - 25)
        pg.vertex(progress_end - 4, pg.height - 15)
        pg.vertex(0, pg.height - 15)
        pg.endShape(pg.CLOSE)

        for (let i = 1; i < n_stops + 1; i++) {

          pg.strokeWeight(8);

          var ring_colour = (i <= stop_idx) ? tcc_blue : tcc_white;
          ring_colour = (arr_idx.includes(i)) ? tcc_grey : ring_colour;
          ring_colour = (arr_idx.includes(i) && i === n_stops) ? tcc_yellow : ring_colour;
          var spot_colour = (i < stop_idx) ? tcc_grey : tcc_grey;
          spot_colour = (arr_idx.includes(i)) ? tcc_yellow : spot_colour;
          var text_colour = (i < stop_idx) ? tcc_light_grey : tcc_white;
          text_colour = (arr_idx.includes(i)) ? tcc_yellow : text_colour;


          let x = station_margin_l + (i - 1) * station_spacing;
          let y = pg.height - 25

          pg.stroke(ring_colour)
          pg.fill(spot_colour)

          if (i === n_stops) {
            pg.rectMode(p5.RADIUS)
            pg.fill(tcc_red)
            pg.rect(x, y, 15)
            pg.rectMode(p5.CORNER)
          } else if (i == (stop_to_seq(obs_stop, dest_stop))) {
            pg.rectMode(p5.RADIUS)
            pg.rect(x, y, 15)
            pg.rectMode(p5.CORNER)
          } else {
            pg.circle(x, y, 30)
          }

          let stop_name = (route_dir > 0) ? stop_short_names[15 - i - 1] : stop_short_names[i - 1]

          pg.fill(text_colour);
          pg.noStroke();
          pg.translate(x, y);
          pg.rotate(-30)
          pg.textSize(17);
          pg.textAlign(p5.LEFT, p5.CENTER);
          pg.text("        " + stop_name, 0, -5);
          pg.rotate(30)
          pg.translate(-x, -y);

        }
      } else if (click_state == 1) {

        drawNextArr()

        pg.fill(tcc_black);
        pg.noStroke();
        pg.rect(0, pg.height - 100, pg.width, 90)
        
        if (filtered_arr.length > 0) {
          pg.fill(tcc_white);
          pg.textSize(50);
          pg.textAlign(p5.MIDDLE, p5.BOTTOM);
          pg.text("|", 605, pg.height - 25);

          pg.textSize(45);
          if (filtered_arr.length > 1) {
            pg.textAlign(p5.LEFT, p5.BOTTOM);
            pg.text(`Next: ${head_sign_names[filtered_arr[1].dest]}`, 20, pg.height - 25)

            pg.textAlign(p5.RIGHT, p5.BOTTOM);
            time_str = `${Math.floor(Math.abs(filtered_arr[1].time_min))} min`
            pg.text(time_str, 580, pg.height - 25);
          }
          if (filtered_arr.length > 2) {
            pg.textAlign(p5.LEFT, p5.BOTTOM);
            pg.text(`Next: ${head_sign_names[filtered_arr[1].dest]}`, 620, pg.height - 25)

            pg.textAlign(p5.RIGHT, p5.BOTTOM);
            time_str = `${Math.floor(Math.abs(filtered_arr[2].time_min))} min`
            pg.text(time_str, pg.width - 20, pg.height - 25);
          }

        } 

      } else { // click_state == 2
        pg.textAlign(p5.CENTER, p5.BOTTOM);
        pg.textSize(20);
        pg.text("Fire Rating", pg.width-350+125, pg.height - 25)
        pg.text("UV Index", 620, pg.height - 25)
        pg.text("Temperature", 50+175, pg.height - 25)
        drawFireDangerRating(pg, pg.width-350, 120, 250, 125, FR_today, FR_tomorrow)
        
        let instant = weather.properties.timeseries[0].data.instant.details
        let uv = instant.ultraviolet_index_clear_sky
        draw_UV_index(pg, UV_img, 600, 120, 40, 125, uv)

        let currentTemp = instant.air_temperature
        let next = weather.properties.timeseries[0].data.next_6_hours.details
        let maxTemp = next.air_temperature_max
        let minTemp = next.air_temperature_min
        draw_temp(pg, 50, 120, 350, 125, currentTemp, minTemp, maxTemp)
        
      }
    } else if (data_status == DataStatus.no_scheduled) {

      if (click_state == 0) {
        drawTCLogo(pg, img, pg.width/2, pg.height/2, 100)

      } else { //click_state == 1

        pg.fill(tcc_white);
        pg.textFont(regularFont);
        pg.textSize(50);
        pg.textAlign(p5.CENTER, p5.TOP);
        pg.text("Service commences at 6am", pg.width/2, pg.height/2 -30);
        pg.textFont(font);

      }

    } else { // 
      var text_str = ""
      switch (data_status) {
        case DataStatus.loading:
          text_str = "Requesting data..."
          break;
        case DataStatus.conn_err:
          text_str = "Data connection error."
          break;

        default:
          break;
      }

      pg.fill(tcc_black);
      pg.noStroke();
      pg.rect(0, pg.height - 100, pg.width, 90)

      pg.fill(tcc_white);
      pg.textSize(50);
      pg.textAlign(p5.LEFT, p5.BOTTOM);
      pg.text(text_str, 20, pg.height - 25);
    }

    // phone mode!
    if (p5.windowHeight >= p5.windowWidth) {
      p5.angleMode(p5.DEGREES);
      let newH = p5.windowHeight / 4.0;
      p5.translate((p5.windowWidth + newH) / 2, 0)
      p5.rotate(90)
      p5.image(pg, 0, 0, p5.windowHeight, newH);
      p5.rotate(-90)
      p5.translate(-(p5.windowWidth + newH) / 2, 0)

    } else { //desktop mode
      let newH = p5.windowWidth / 4.0;
      p5.image(pg, 0, (p5.windowHeight - newH) / 2, p5.windowWidth, newH);
    }

  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
  }

}


export default sketch

