import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/wallet'
import { HashImage } from './Hash2Image'
import { HashColorTag } from './Hash2Color'



function History({spawns}) {
  const {connected,address,disconnect,connect,walletkit} = useWallet()


  return <div className='w-full border-t-1 mt-6'>
    {spawns.map((item)=><HistoryItem item={item}></HistoryItem>)}
  </div>

}

export default History


function HistoryItem({item}) {
  return <div  className='w-full text-left py-2 flex items-center gap-4 justify-between'>
    <div className='w-8'><HashImage text={item.pid} className="w-6 h-6"/></div>
    <div className='w-120'>{item.pid}</div>
    <div className='flex-1 opacity-60'>{item.name || '-'}</div>
    <div><HashColorTag text={item.module}/></div>
    <div className='w-40'>{item.cron_str || 'no cron'}</div>
    <div><a href={`https://www.ao.link/entity/${item.pid}`} target="_blank">aolink</a></div>
  </div>
}