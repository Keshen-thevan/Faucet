import { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import detectEthereumProvider from '@metamask/detect-provider';
import {loadContract} from "./utils/load-Contract";
//import contract from "@truffle/contract";
function App() {
  //set the web3api as a state object with 3 elements
const [web3Api, setWeb3Api] = useState({provider: null, web3: null,contract: null})
const [balance, setBalance] = useState(null)  //set balance as state
const [account, setAccounts] = useState(null) //set account as state
const [shouldReload, reload] = useState(false)  // setShould reload as state

const reloadEffect = () => reload(!shouldReload)//const reload is the function which changes shouldReload
const setAccountListener = provider => {
  provider.on("accountsChanged", accounts => setAccounts(accounts[0]))//looks for an eventlistener that returns
  //the string accountChanged and then set accoutns to the first account it the array

}
//youtube what useEffect is other than side effect
  useEffect(() => {
    const loadProvider = async () =>{
      const provider = await detectEthereumProvider();
      const contract = await loadContract("Faucet",provider) //pass the data into the load contract function
      //and then assigns it to the contract const

      if(provider) { //if there is a provider
        setAccountListener(provider)// passes the provider variable into the seAccountListener fuction
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else{
        console.error("Please, install Metamask")
      }

    }
    loadProvider()
  }, [])

  //useEffect for setting the balance
  useEffect(() => async () => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api
      const balance = await web3.eth.getBalance(contract.address)
      setBalance(web3.utils.fromWei(balance, "ether"))
    }

    web3Api.contract && loadBalance()
  }, [web3Api, shouldReload])

  //useEffect for setting the accounts
  useEffect(() =>  {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts()
      setAccounts(accounts[0])
    }
    web3Api.web3 && getAccount()
  }, [web3Api.web3])

  //interacts with the smart contract function addFunds
  const addFunds =  async () => {
    const {contract, web3} = web3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("3", "ether")
    })
    reloadEffect()
  }

  //interacts with the smart contract function withDraw
  const withDraw = async () => {
    const {contract, web3} = web3Api
    const withdrawAmount = web3.utils.toWei("1", "ether")
    await contract.withdraw(withdrawAmount,{
      from: account
    })
    reloadEffect()
  }


  return (
   <>
    <div className = "faucet-wrapper">
      <div className = "faucet">
        <div className = "is-flex is-align-items-center">
        <span>
          <div className = "mr-3"><strong>Account:</strong></div>
        </span>
        
          {account ? <div>{account}</div> : 
          <button
            className = "button is-link is-small"
            onClick = {() => web3Api.provider.request({method: "eth_requestAccounts"})}>Connect Wallet</button>}
            </div>
      
        <div className = "balance-view is-size-2 mb-4 mt-6">
          Current Balance: <strong>{ balance }</strong>Eth
        </div>
        <button className = "button is-primary mr-2" onClick = {addFunds}>Donate 3Eth</button>
        <button className = "button is-danger " onClick = {withDraw}>Withdraw 1Eth</button>
      </div>
       
    </div>
   </>
  );
}

export default App;
