import React, { useEffect, useState } from "react";
import {
  ReactP5Wrapper
} from "@p5-wrapper/react";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import sketch from './sign';
import Menu from "./menu";
import {get_arrivals} from './data'
import { Stop, stop_to_seq, get_route_dir, DataStatus} from "./helpers";

const root = ReactDOM.createRoot(document.getElementById('root'));

const onHover = () => {
  console.log("Hover")
}

function App() {

  document.body.style.overflow = 'hidden'
  const params = new URLSearchParams(window.location.search)

  const [state, setState] = useState({
    obs_stop: (params.has("at")) ? parseInt(params.get("at")) : 4,
    dest_stop: (params.has("to")) ? parseInt(params.get("to")) : 1,
    cycle_pages: (params.has("cycle")) ? true: false,
    data_status: DataStatus.loading
  });

  const [arrivals, setArrivals] = useState([]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        get_arrivals(stop_to_seq(state.obs_stop, state.dest_stop))
          .then((req) => {
            let dest_dir = (state.dest_stop === 1) ? 1 : 0;


            let new_locs = req.arrivals.filter((it) => get_route_dir(it.dest) === dest_dir)
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

  return (
  <div className="app">
    <ReactP5Wrapper sketch={sketch} obs_stop={state.obs_stop} dest_stop={state.dest_stop} arrivals={arrivals} cycle_pages={state.cycle_pages} data_status={state.data_status} />
  </div>
  );
}

root.render(
  <BrowserRouter basename="/">
    <Routes>
      <Route path = "/" element = { <Menu />} />
      <Route path="/rail" element = {<App />}/>
    </Routes>
  </BrowserRouter>
);

