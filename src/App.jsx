import { useEffect, useState } from 'react'
import { connect as aoconnect,createDataItemSigner } from "@permaweb/aoconnect/browser";
import './App.css'
import { useWallet } from './hooks/wallet';
import Headers from './componnets/Header';
import History from './componnets/History';

const { result, results, message, spawn, monitor, unmonitor, dryrun } = aoconnect();

function App() {

  
  const {connected,connect,address,walletkit,disconnect} = useWallet()  
  const [tip,setTip] = useState(null)
  const [spawnning,setSpawnning] = useState(false)
  const [fileds,setFileds] = useState({
    scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
    module: "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY"
  })
  const [spawns,setSpawns] = useState([])

  useEffect(()=>{
    async function fetchProcess(){
      return walletkit.getActiveAddress().then(async(active_address)=>{
        if(!active_address) return
        const ps_str = await localStorage.getItem(`ps-${active_address}`)
        const ps_arr = ps_str?JSON.parse(ps_str):[]
        console.log('ps_arr: ', ps_arr);
        setSpawns(ps_arr)
      })
    }
    if(connected){
      fetchProcess()
    }else{
      setSpawns([])
    }
    
  },[address,connected])





  function HandleSubmit(e){
    e.preventDefault();
    setSpawnning(true)
    const formData = new FormData(e.target)
    const scheduler = formData.get("scheduler");
    const module = formData.get("module");
    const name = formData.get("name")||"aospawner_default";
    const cron_interval = formData.get("cron_interval")
    const cron_type = formData.get("cron_type")
    const cron_str = cron_interval&&cron_interval>0?`${cron_interval}-${cron_type}${cron_interval>1?'s':''}`:null
    

    if(!module ) {
      setTip("missed filed")
      setSpawnning(false)
      return
    }
    spawner({name,scheduler,module,cron_interval:cron_str,wallet:walletkit}).then((pid)=>{
      if(pid){
        const ps_str = localStorage.getItem(`ps-${address}`)
        const ps_arr = ps_str?JSON.parse(ps_str):[]
        ps_arr.push({pid,address,name,module,scheduler,cron_str})
        localStorage.setItem(`ps-${address}`,JSON.stringify(ps_arr))
      }
      setTip(pid)
      setSpawnning(false)
    })
  }



  function handlerConnect(){
    if(!walletkit) return
    connect()
  }

  async function spawner({module,scheduler,name,wallet,cron_interval}) {
    const tags = [
      { name: "Name", value: name||"aospawner_default" },
      { name: "Spawner", value: "aospawner" },
    ]
    if(cron_interval){
      tags.push({name: "Cron-Interval", value: cron_interval},{name: "Cron-Tag-Action", value: "Cron"})
    }
    console.log({module,scheduler,name,wallet,cron_interval,tags})
    return await spawn({
      module: module|| "GYrbbe0VbHim_7Hi6zrOpHQXrSQz07XNtwCnfbFo2I0",
      scheduler: scheduler || "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
      signer: createDataItemSigner(wallet),
      tags: tags
    })
  }

  return (
    <>
      <Headers></Headers>
      <section className='flex w-full gap-12'>
        <div className='text-left w-[45%] flex flex-col gap-4 flex-1'>
          <p>aoSpawner is a process manager for the aoComputer that makes it easy to spawn, manage, and monitor processes. It is deeply integrated with web-aos and provides clear value for both developers and users:</p>
          <ul className='flex flex-col gap-4'>
            <li>1. Display and manage all processes under the user's address;</li>
            <li>2. View real-time status of all processes on one page;</li>
            <li>3. Integrated with web-aos, allowing regular users to use it without terminal and VPN issues;</li>
            <li>4. Easy way to spawn a new process with custom modules, schedulers, and tags;</li>
          </ul>
          <i>aoComputer is a hyper-parallel, decentralized computer based on the Arweave permanent storage network.</i>
        </div>
        {connected&&
          <div className='text-left w-[45%] flex flex-col justify-start items-end'>
            <form onSubmit={HandleSubmit}>
              <div className='p-2 flex'>
                <div className='w-40'>scheduler *</div>
                <input type="text" placeholder="scheduler" name="scheduler" defaultValue={fileds?.scheduler||""} className='w-96 p-2' required></input>
              </div>

              <div className='p-2 flex'>
                <div className='w-40'>module *</div>
                <input type="text" placeholder="module" name="module" defaultValue={fileds?.module||"GYrbbe0VbHim_7Hi6zrOpHQXrSQz07XNtwCnfbFo2I0"} className='w-96 p-2' required></input>
              </div>

              <div className='p-2 flex'>
                <div className='w-40'>name</div>
                <input type="text" placeholder="name" name="name" defaultValue={fileds?.name||""} className='w-96 p-2'></input>
              </div>

              <div className='p-2 flex'>
                <div className='w-40'>cron_interval</div>
                <input type="number" min="1" max="59" placeholder="cron_interval" name="cron_interval" defaultValue={fileds?.cron_interval||""} className='w-60 p-2'></input>
                <select name="cron_type" className='w-36 p-2'>
                  <option value="second">seconds</option>
                  <option value="minute">minutes</option>
                </select>
              </div>
              {tip&&<div>{tip}</div>}
              <div className='flex text-right w-full justify-end py-4'><button className='btn' disabled={spawnning}>{spawnning?'spawnning':'spawn'}</button></div>
              
            </form>
        </div>}

        {!connected&&<div><button className='btn' onClick={handlerConnect}>connect with arconnect</button></div>}
      </section>

      
      {spawns.length>=1&&<div>
        
        <History spawns={spawns}></History>
      </div>}


      {/* {address&&<div className='fixed top-0 right-0 flex items-center	p-4 gap-4'><div>{address}</div><button onClick={handlerDisconnect}>disconnect</button></div>} */}
    </>
  )
}

export default App
