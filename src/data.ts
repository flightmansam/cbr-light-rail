import axios from "axios"
import { code_to_stop } from "./constants";
import { Status, Location, Arrival, DataStatus } from "./helpers";

let api_url = process.env.REACT_APP_API_URL
let fire_rating_api = "https://corsproxy.io/?url=http://esa.act.gov.au/feeds/firedangerrating.xml" //A request has been made to esa.act.gov.au to allow CORS
//https://corsproxy.io/?url=
let canberra_weather_api = "https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=-35.2601639&lon=149.1328195&altitude=577"
//"https://reg.bom.gov.au/fwo/IDN60903/IDN60903.94926.json"

async function get_live() {
    let rtn = await axios.get(`${api_url}/live`)
        .then(function(response){
            var arrivals = []
            var data_status = DataStatus.loading
            if(response.status === 200) {
                let data = response.data
                data_status = DataStatus.live
                for (let v of data) {
                    var status;
                    switch (v.status) {
                    case "incoming_at": {
                        status = Status.incoming_at
                        break;
                    }
                    case "stopped_at": {
                        status = Status.stopped_at
                        break;
                    }
                    case "in_transit_to": {
                        status = Status.in_transit_to
                        break;
                    }
                    case "scheduled": {
                        status = Status.scheduled
                        break;
                    }
                    default: {
                        status = Status.unknown
                        break;
                    }
                    }
                    var arr: Location = {
                        dest: code_to_stop[v.dest],
                        stop: code_to_stop[v.stop],
                        trip_id: v.trip_id,
                        seq: v.seq,
                        status: status
                    }
                    arrivals.push(arr)
                }
            }
            return {arrivals,  data_status}
        })
        .catch(function (error){
            console.log(error)
            var arrivals = []
            var data_status = DataStatus.conn_err
            return {arrivals, data_status}
        })
    return rtn

}

async function get_arrivals(seq: number){
    let rtn = await axios.get(`${api_url}/arrivals/${seq}`)
        .then(function(response){
            var arrivals = []
            var data_status = DataStatus.loading
            if(response.status === 200) {
                let data = response.data
                data_status = DataStatus.no_scheduled
                for (let v of data) {
                    var status;
                    switch (v.Location.status) {
                    case "incoming_at": {
                        data_status = DataStatus.live
                        status = Status.incoming_at
                        break;
                    }
                    case "stopped_at": {
                        data_status = DataStatus.live
                        status = Status.stopped_at
                        break;
                    }
                    case "in_transit_to": {
                        data_status = DataStatus.live
                        status = Status.in_transit_to
                        break;
                    }
                    case "scheduled": {
                        data_status = DataStatus.live
                        status = Status.scheduled
                        break;
                    }
                    default: {
                        status = Status.unknown
                        break;
                    }
                    }
                    var arr: Arrival = {
                        dest: code_to_stop[v.Location.dest],
                        stop: code_to_stop[v.Location.stop],
                        trip_id: v.Location.trip_id,
                        seq: v.Location.seq,
                        status: status,
                        time: v.time,
                        time_min: v.time_min
                    }
                    arrivals.push(arr)
                }
                
            }
            return {arrivals, data_status}
        })
        .catch(function (error){
            console.log(error)
            var arrivals = []
            var data_status = DataStatus.conn_err
            return {arrivals, data_status}
        })
    return rtn    
}

export enum FireRating {
    UNKNOWN = 0,
    MODERATE = 1,
    HIGH = 2,
    EXTREME = 3,
    CATASTROPHIC = 4
  }

function XMLtextToFireRating(txt) {
    switch (txt) {
        case "Unknown":
            return FireRating.UNKNOWN
            break;
        case "Moderate":
            return FireRating.MODERATE
            break;  
        case "High":
            return FireRating.HIGH
            break;         
        case "Extreme":
            return FireRating.EXTREME
            break;      
        case "Catastrophic":
            return FireRating.CATASTROPHIC
            break;                                  
        default:
            return FireRating.UNKNOWN
            break;
    }
}

async function get_fire_rating(){
    let rating = await axios.get(fire_rating_api, {headers:{"Content-Type":"application/xml"}})
        .then((response) => response.data)
        .then((text) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/xml");
            const today = XMLtextToFireRating(doc.querySelector("DangerLevelToday").textContent)
            const tomorrow = XMLtextToFireRating(doc.querySelector("DangerLevelTomorrow").textContent)
            return [today, tomorrow]
        })
        .catch((err) => {
            console.log(err)
            return FireRating.UNKNOWN, FireRating.UNKNOWN
        })
    return rating
}

export async function get_weather() {
    let weather = await axios.get(canberra_weather_api)
        .then((response) => response.data)
        .then((data) => {
            return data
        })
    return weather
}   

export {get_live, get_arrivals, get_fire_rating}
// rss > channel > FireDangerMap > District > DangerLevelToday