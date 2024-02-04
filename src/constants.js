import {Stop} from './helpers'

const head_sign_names = {
    1:'Alinga St',
    8:'EPIC',
    9:'Sandford St',
    14:'Gungahlin Pl'
}

const stop_short_names = [
  'Alinga St',
  'Elouera St',
  'Ipima St',
  'Macarthur Av',
  'Dickson',
  'Swinden St',
  'Phillip Av',
  'EPIC',
  'Sandford St',
  'Well Station',
  'Nullarbor Av',
  'Mapleton Av',
  'Manning Clk',
  'Gungahlin Pl',
]

const code_to_stop = {
  "alg": Stop.alg,
  "ela": Stop.ela,
  "ipa": Stop.ipa,
  "mcr": Stop.mcr,
  "dkn": Stop.dkn,
  "swn": Stop.swn,
  "plp": Stop.plp,
  "epc": Stop.epc,
  "sfd": Stop.sfd,
  "wsn": Stop.wsn,
  "nlr": Stop.nlr,
  "mpn": Stop.mpn,
  "mck": Stop.mck,
  "ggn": Stop.ggn,

  "nan": Stop.nan
}

export {head_sign_names, stop_short_names, code_to_stop}