/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';

const CLOUDFLARE_ENDPOINT = 'https://dai.poa.network';
const MAIN_ENDPOINT = 'https://ropsten.infura.io/v3/4e6804ffa40045d0a67d2efccb6cf82e';
const ALTERNATE_ENDPOINT = 'https://xdai.poanetwork.dev';
const UNSECURE_ENDPOINT = 'http://xdai.poanetwork.dev';
const QUICKNODE_ENDPOINT = process.env.REACT_APP_QUICKNODE_URL;

export function createProvider() {  
  try {
    return new ethers.providers.JsonRpcProvider('https://kovan.infura.io/v3/4e6804ffa40045d0a67d2efccb6cf82e' ,42);
  }catch(e){
    console.log(e, "ERRRRRRRRRR")
  }
  
}