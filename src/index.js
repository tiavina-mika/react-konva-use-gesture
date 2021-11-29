import { render } from 'react-dom'
import React, { useEffect, useState } from 'react'
import { Stage, Layer, Circle, Rect } from 'react-konva'
import './styles.css'
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'

const useGesture = createUseGesture([dragAction, pinchAction])

function Drag() {
  const [values, setValues] = useState({
    imageLeft: 0,
    imageTop: 0,
    imageWidth: 100,
    imageHeight: 100,
    rotation: 0,
    zoom: 1
  })
  const ref = React.useRef(null)

  useEffect(() => {
    const handler = (e) => e.preventDefault()
    document.addEventListener('gesturestart', handler)
    document.addEventListener('gesturechange', handler)
    return () => {
      document.removeEventListener('gesturestart', handler)
      document.removeEventListener('gesturechange', handler)
    }
  }, [])

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel()
        setValues({ ...values, imageLeft: x, imageTop: y })
        // api.start({ x, y })
      },
      onPinch: ({ dragging, cancel, origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
        if (dragging) return cancel()
        if (first) {
          const rect = ref.current
          const x = rect.x()
          const y = rect.y()
          const width = rect.width()
          const height = rect.height()
          // const { width, height, x, y } = ref.current.getBoundingClientRect()
          const tx = ox - (x + width / 2)
          const ty = oy - (y + height / 2)
          memo = [values.imageLeft, values.imageTop, tx, ty]
        }

        const x = memo[0] - ms * memo[2]
        const y = memo[1] - ms * memo[3]
        setValues({
          ...values,
          imageLeft: x,
          imageTop: y,
          imageWidth: values.imageWidth * s,
          imageHeight: values.imageHeight * s,
          zoom: s
        })

        return memo
      }
    },
    {
      target: ref,
      drag: { from: () => [values.imageLeft, values.imageTop] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true }
    }
  )
  return (
    <div className="container">
      <Stage width={window.innerWidth} height={400}>
        <Layer>
          <Rect
            ref={ref}
            // onMouseDown={e => {
            //   props.onMouseDown(e.evt)
            // }}
            // onTouchStart={e => {
            //   props.onTouchStart(e.evt)
            // }}
            x={values.imageLeft}
            y={values.imageTop}
            width={values.imageWidth}
            height={values.imageHeight}
            rotation={values.rotation}
            // radius={100}
            fill="red"
          />
        </Layer>
      </Stage>
      <h1>
        x: {Math.round(values.imageLeft)}, y: {Math.round(values.imageTop)}
        width: {Math.round(values.imageWidth)}, height: {Math.round(values.imageHeight)}, zoom: {values.zoom},
      </h1>
    </div>
  )
}

render(<Drag />, document.getElementById('root'))
