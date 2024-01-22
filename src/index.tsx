import React, { useEffect, useState } from "react";
import {
  ReactP5Wrapper
} from "@p5-wrapper/react";
import ReactDOM from 'react-dom/client';
import './index.css';
import sketch from './sign';
import {get_arrivals} from './data'
import { Stop, stop_to_seq} from "./helpers";


const root = ReactDOM.createRoot(document.getElementById('root'));

const onHover = () => {
  console.log("Hover")
}

function App() {


  const params = new URLSearchParams(window.location.search)

  const [state, setState] = useState({
    obs_stop: (params.has("at")) ? parseInt(params.get("at")) : 14,
    dest_stop: (params.has("to")) ? parseInt(params.get("to")) : 1,
  });

  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {

    async function fetchData() {
      var new_locs = await get_arrivals(stop_to_seq(state.obs_stop, state.dest_stop))
      let dest = (state.dest_stop === 1) ? Stop.alg : Stop.ggn;
      new_locs = new_locs.filter((it) => it.dest === dest)
      return new_locs
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
    <div  onClick={onHover}>
    <App />
    </div>

  </React.StrictMode>
);

