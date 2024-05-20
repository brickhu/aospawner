import { useEffect, useState } from 'react'
import { connect as aoconnect,createDataItemSigner } from "@permaweb/aoconnect/browser";
import './App.css'


const { result, results, message, spawn, monitor, unmonitor, dryrun } = aoconnect();

function App() {

  
  const {connected,connect,address,walletkit,disconnect} = useWallet()  
  const [tip,setTip] = useState(null)
  const [spawnning,setSpawnning] = useState(false)
  const [fileds,setFileds] = useState({
    scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
    module: "GYrbbe0VbHim_7Hi6zrOpHQXrSQz07XNtwCnfbFo2I0"
  })
  const [spawns,setSpawns] = useState([])

  useEffect(()=>async()=>{
    if(!address || !connected) return
    const ps_str = localStorage.getItem(`ps-${address}`)
    const ps_arr = ps_str?JSON.parse(ps_str):[]
    setSpawns(ps_arr)
  },[address])



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
    console.log('cron_str: ', cron_str);

    if(!module ) {
      setTip("missed filed")
      setSpawnning(false)
      return
    }
    spawner({name,scheduler,module,cron_interval:cron_str}).then((pid)=>{
      console.log(pid)
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

  function handlerDisconnect(){
    disconnect().then(()=>{
      setSpawnning(false)
      setTip(null)
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
    console.log({module,scheduler,name,wallet,cron_interval})
    return await spawn({
      module: module|| "GYrbbe0VbHim_7Hi6zrOpHQXrSQz07XNtwCnfbFo2I0",
      scheduler: scheduler || "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
      signer: createDataItemSigner(wallet || walletkit),
      tags: tags
    })
  }

  return (
    <>
      {/* <div>{user?.address||'null'} | <button>disconnect</button></div> */}
      <h1 className='text-left w-full py-8'>aospawner</h1>
      
      {connected&&
        <div className='text-left'>
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
            <div className='flex text-right w-full justify-end p-4'><button disabled={spawnning}>{spawnning?'spawnning':'spawn'}</button></div>
            
          </form>
      </div>}

      {!connected&&<div><button onClick={handlerConnect}>connect</button></div>}
      {spawns.length>=1&&<div>
        <h4>spawn history</h4>
        {spawns.map((item)=><li>{item.pid}</li>)}
      </div>}
      {address&&<div className='fixed top-0 right-0 flex items-center	p-4 gap-4'><div>{address}</div><button onClick={handlerDisconnect}>disconnect</button></div>}
    </>
  )
}

export default App



function useWallet() {
  const arconnect = window.arweaveWallet || null
  const [address,setAddress] = useState(null)
  const [connected,setConnected] = useState(false)

  useEffect(()=>{
    if(!arconnect) return
    connect()
  },[])
  
  // 链接钱包函数
  const connect = async function() {
    try {
      if(!arconnect) throw Error("未安装arconnect")
      if(connected) return
      const permissions = ["ACCESS_ADDRESS","ACCESS_PUBLIC_KEY","SIGN_TRANSACTION","DECRYPT","SIGNATURE","DISPATCH"]
      return await arconnect.connect(permissions,{name:"aospawner"}).then(async()=>{
        const address = await arconnect.getActiveAddress()
        setAddress(address)
        setConnected(true)
        return true
      }).catch(err=>{
        throw Error(err)
      })
    } catch (error) {
      throw Error(error)
    }
  }
  
  //断掉钱包链接
  const disconnect = async function(){
    try {
      if(connected){
        return arconnect.disconnect().then(async()=>{
          await setConnected(false)
          await setAddress(null)
          return true
        }).catch(err=>{throw Error(err)})
      }else{
        return false
      }
    } catch (error) {
      throw Error(error)
    }
  }


  return {
    address,
    walletkit:arconnect,
    connected,
    connect,
    disconnect,
  }
}