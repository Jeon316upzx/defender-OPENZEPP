import { useRef, useState, useContext } from 'react';
import { registerName } from '../eth/register';
import { EthereumContext } from "../eth/context";
import { toast } from 'react-toastify';
import './Register.css';

function Register() {
  const nameInput = useRef(null);
  const amountInput = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const { registry, provider } = useContext(EthereumContext);

  const sendTx = async (event) => {
    event.preventDefault();
    const name = nameInput.current.value + '.dd';
    const amount = Number.parseInt(amountInput.current.value)
    setSubmitting(true);
    
    try {
      const response = await registerName(registry, provider, name , amount);
      const hash = response.hash;
      const onClick = hash
        ? () => window.open(`https://ropsten.etherscan.io/tx/${hash}`)
        : undefined;
      toast('Transaction sent!', { type: 'info', onClick });
      nameInput.current.value = '';
    } catch(err) {
      toast(err.message || err, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="Container">
    <form onSubmit={sendTx}>
      <input required={true} placeholder="Register your name here" ref={nameInput}></input>
      <input required={true} type={'number'} placeholder="Enter an amount here" ref={amountInput}></input>
      <button type="submit" disabled={submitting}>{submitting ? 'Registering...' : 'Get Domain'}</button>
    </form>
  </div>
}

export default Register;