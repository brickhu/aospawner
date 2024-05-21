import { minidenticon } from 'minidenticons'
import { useMemo } from 'react'

export const HashImage = ({ text, saturation, lightness, ...props }) => {
  const svgURI = useMemo(
    () => 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(text, saturation, lightness)),
    [text, saturation, lightness]
  )
  return (<img src={svgURI} alt={text} {...props} />)
}