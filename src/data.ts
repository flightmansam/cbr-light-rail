import axios from "axios"
import { code_to_stop } from "./constants";
import { Status, Location, Arrival, DataStatus } from "./helpers";

let api_url = process.env.REACT_APP_API_URL

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




export {get_live, get_arrivals}
