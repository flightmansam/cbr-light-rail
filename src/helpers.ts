export enum Status {
  incoming_at,
  stopped_at,
  in_transit_to,
  scheduled,

  unknown
}

export enum Stop {
  alg=1,
  ela,
  ipa,
  mcr,
  dkn,
  swn,
  plp,
  epc,
  sfd,
  wsn,
  nlr,
  mpn,
  mck,
  ggn,

  nan
}
  
export interface Location {
  stop: Stop;
  dest: Stop;
  trip_id: string;
  seq:  number;
  status?: Status;
}

export interface Arrival extends Location {
  time: number
  time_min: number
}