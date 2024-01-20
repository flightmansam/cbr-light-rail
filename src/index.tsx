import React, { useEffect, useState } from "react";
import {
  ReactP5Wrapper
} from "@p5-wrapper/react";
import ReactDOM from 'react-dom/client';
import './index.css';
import sketch from './sign';
import {get_data} from './data'
import {Location, Status, Stop} from './helpers'
import { code_to_stop } from "./constants";

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const params = new URLSearchParams(window.location.search)

  const [state, setState] = useState({
    obs_stop: (params.has("at")) ? params.get("at") : 14,
    dest_stop: (params.has("to")) ? params.get("to") : 1,
  });

  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {

    async function fetchData() {
      var new_locs = await get_data()
      let dest = (state.dest_stop === 1) ? "alg" : "ggn";
      new_locs = new_locs.filter((it) => it["dest"] === dest)
      var arrivals = []
      for (let v of new_locs) {
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
            dest: code_to_stop[dest],
            stop: code_to_stop[v.stop],
            seq: v.seq,
            status: status
        }
        arrivals.push(arr)
      }
      return arrivals
    }

    const interval = setInterval(
      () => {
        fetchData()
          .then(arr => {setArrivals(arr)})
        
      },
      1000)

    return () => {
      clearInterval(interval);
    };
  }, [arrivals, state]);

  return <ReactP5Wrapper sketch={sketch} obs_stop={state.obs_stop} dest_stop={state.dest_stop} arrivals={arrivals} />;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

