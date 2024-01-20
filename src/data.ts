import axios from "axios"
import { code_to_stop } from "./constants";
import { Status, Location } from "./helpers";

async function get_live(){
    const response = await axios.get('http://localhost:4050/live') //fetch("https://jsonplaceholder.typicode.com/users")//
    if(response.status === 200) {
        let data = await response.data
        var arrivals = []
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
        return arrivals
    }
    return []
}

export {get_live}