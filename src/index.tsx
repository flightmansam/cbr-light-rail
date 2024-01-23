import React, { useEffect, useState } from "react";
import {
  ReactP5Wrapper
} from "@p5-wrapper/react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import sketch from './sign';
import {get_arrivals} from './data'
import { Stop, stop_to_seq, DataStatus} from "./helpers";

const root = ReactDOM.createRoot(document.getElementById('root'));

const onHover = () => {
  console.log("Hover")
}

function App() {


  const params = new URLSearchParams(window.location.search)

  const [state, setState] = useState({
    obs_stop: (params.has("at")) ? parseInt(params.get("at")) : 4,
    dest_stop: (params.has("to")) ? parseInt(params.get("to")) : 1,
    data_status: DataStatus.loading
  });

  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        get_arrivals(stop_to_seq(state.obs_stop, state.dest_stop))
          .then((req) => {
            let dest = (state.dest_stop === 1) ? Stop.alg : Stop.ggn;
            let new_locs = req.arrivals.filter((it) => it.dest === dest)
            setState({
              ...state,
              data_status: req.data_status
            })
            setArrivals(new_locs)
          })
      },
      1000)

    return () => {
      clearInterval(interval);
    };
  }, [arrivals, state]);

  return <ReactP5Wrapper sketch={sketch} obs_stop={state.obs_stop} dest_stop={state.dest_stop} arrivals={arrivals} data_status={state.data_status} />;
}

root.render(
  <BrowserRouter basename="/rail">
    <div  onClick={onHover}>
    <App />
    </div>

  </BrowserRouter>
);

