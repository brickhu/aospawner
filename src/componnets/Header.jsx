import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/wallet'



function Headers() {
  const {connected,address,disconnect,connect,walletkit} = useWallet()

  function handlerDisconnect(){
    disconnect().then(()=>{
      // setSpawnning(false)
      // setTip(null)
    })
  }

  function handlerConnect(){
    if(!walletkit) return
    connect()
  }
  return <div className='fixed top-0 right-0 flex items-center justify-between p-4 gap-4 w-full'>
    <div className='font-bold'>aoSpawner</div>
    <div>{connected?<div>{address} | <button onClick={handlerDisconnect}>disconnect</button></div>:<div><button onClick={handlerConnect}>connect</button></div>}</div>
  </div>

}

export default Headers
