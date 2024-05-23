import { useEffect,useState,useContext,createContext } from "react"

export const WalletContext = createContext()
const arconnect = window.arweaveWallet || null

// 创建提供者组件
export const WalletProvider = ({ children }) => {
  
  const [address,setAddress] = useState(null)
  const [connected,setConnected] = useState(false)
  // 初始化链接
  useEffect(()=>{
    (async ()=> {
      if(!arconnect) return
      const permissions = await arconnect.getPermissions()
      if(permissions.length>0){
        const address = await arconnect.getActiveAddress()
        setAddress(address)
        setConnected(true)
      }
    })()
  },[])

  // 创建arconnect监听
  useEffect(()=>{
    const handleWalletChange = (e) => {
      if(e.detail.address){
        setAddress(e.detail.address)
      }
    }
    if(connected){
      addEventListener("walletSwitch", handleWalletChange)
      return () => window.removeEventListener('walletSwitch', handleWalletChange);
    }
    
  },[connected])
 

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

  return (
    <WalletContext.Provider value={{ 
      walletkit:arconnect,
      address,
      connected,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = function(){
  return useContext(WalletContext)
}


// export function useWallet() {
//   const arconnect = window.arweaveWallet || null
//   const [address,setAddress] = useState(null)
//   const [connected,setConnected] = useState(false)

//   // useEffect(()=>{
//   //   if(!arconnect||connected) return
//   //   connect()
//   // })
  
//   // 链接钱包函数
//   const connect = async function() {
//     try {
//       if(!arconnect) throw Error("未安装arconnect")
//       if(connected) return
//       const permissions = ["ACCESS_ADDRESS","ACCESS_PUBLIC_KEY","SIGN_TRANSACTION","DECRYPT","SIGNATURE","DISPATCH"]
//       return await arconnect.connect(permissions,{name:"aospawner"}).then(async()=>{
//         const address = await arconnect.getActiveAddress()
//         setAddress(address)
//         setConnected(true)
//         return true
//       }).catch(err=>{
//         throw Error(err)
//       })
//     } catch (error) {
//       throw Error(error)
//     }
//   }
  
//   //断掉钱包链接
//   const disconnect = async function(){
//     try {
//       if(connected){
//         return arconnect.disconnect().then(async()=>{
//           await setConnected(false)
//           await setAddress(null)
//           return true
//         }).catch(err=>{throw Error(err)})
//       }else{
//         return false
//       }
//     } catch (error) {
//       throw Error(error)
//     }
//   }


//   return {
//     address,
//     walletkit:arconnect,
//     connected,
//     connect,
//     disconnect,
//   }
// }