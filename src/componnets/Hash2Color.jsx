import ColorHash from 'color-hash'
import { useMemo } from 'react'
export const colorHash = new ColorHash();

export const HashColorTag = function({text,lightness,saturation,hue}) {
  const rgb_arr = useMemo(
    () => {
      const color_hash = new ColorHash({lightness:lightness||0.5,hue:hue||100,saturation:saturation||0.5})
      return color_hash.rgb(text)
    },
    [text,lightness,saturation,hue]
  )
  function shortStr(str){
    return str.slice(0,6) + "..." + str.slice(-7);
  }
  return <div className={`px-1 rounded`} style={{backgroundColor:`rgba(${rgb_arr},0.5)`}}>{shortStr(text)}</div>
}

// style={{backgroundColor:color}}