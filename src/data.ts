import axios from "axios"
import { code_to_stop } from "./constants";
import { Status, Location, Arrival, Stop } from "./helpers";

let api_url = process.env.API_URL || 'http://localhost:4050'

async function get_live(){
    const response = await axios.get(`${api_url}/live`) //fetch("https://jsonplaceholder.typicode.com/users")//
    var arrivals = []
    if(response.status === 200) {
        let data = await response.data
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
    return arrivals
}

async function get_arrivals(seq: number){
    const response = await axios.get(`${api_url}/arrivals/${seq}}`) //fetch("https://jsonplaceholder.typicode.com/users")//
    var arrivals = []
    if(response.status === 200) {
        let data = await response.data
        for (let v of data) {
            var status;
            switch (v.Location.status) {
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
    return arrivals
}




export {get_live, get_arrivals}