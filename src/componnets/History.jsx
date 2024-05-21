import { useEffect, useState } from 'react'
import { useWallet } from '../hooks/wallet'
import { HashImage } from './Hash2Image'



function History({spawns}) {
  const {connected,address,disconnect,connect,walletkit} = useWallet()


  return <div className='w-full border-t-1 mt-6'>
    {spawns.map((item)=><HistoryItem item={item}></HistoryItem>)}
  </div>

}

export default History


function HistoryItem({item}) {
  return <div  className='w-full text-left py-2 flex items-center gap-4 justify-between'>
    <div className='w-8'><HashImage text={item.module} className="w-6 h-6"/></div>
    <div className='w-120'>{item.pid}</div>
    <div className='flex-1'>{item.name || '-'}</div>
    <div>{item.cron_str || 'no cron'}</div>
  </div>
}