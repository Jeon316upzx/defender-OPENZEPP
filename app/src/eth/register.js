import { BigNumber, ethers } from 'ethers';
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';

async function sendTx(registry, name, amount) {
  console.log(`Sending register normal tx to set name=${name} at amount ${amount}`);
  return registry.register(name, amount);
}

async function sendMetaTx(registry, provider, signer, name, amount) {
  console.log(`Sending register meta-tx to set name=${name} at amount ${amount}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  console.log(amount,"AMOUNT IN SENTMETATX")
  // const a = new BigNumber.from(1000000000000000000)
  const data = registry.interface.encodeFunctionData('register', [name , '1000000000000000000' ]);
  const to = registry.address;
  

  
  const request = await signMetaTxRequest(signer.provider, forwarder, { to, from, data });
  console.log(request,"REQUEST")
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function registerName(registry, provider, name, amount) {
  if (!name) throw new Error(`Name cannot be empty`);
  if (!amount) throw new Error(`Amount cannot be empty`);
  if (!window.ethereum) throw new Error(`User wallet not found`);

  await window.ethereum.enable();
  const userProvider = new ethers.providers.Web3Provider(window.ethereum);
  const userNetwork = await userProvider.getNetwork();
  if (userNetwork.chainId !== 42) throw new Error(`Please switch to Kovan for signing`);

  const signer = userProvider.getSigner();
  console.log(signer,"SIGNER")
  const from = await signer.getAddress();
  console.log(from,"FROM")
  const balance = await provider.getBalance(from);
  console.log(balance,"BALANCE")

  console.log(amount, "AMOUNT")
  return sendMetaTx(registry, provider, signer, name, amount);
  // const canSendTx = balance.gt(1e15);
  // if (canSendTx) return sendTx(registry.connect(signer), name, amount);
  // else return sendMetaTx(registry, provider, signer, name, amount);
}
