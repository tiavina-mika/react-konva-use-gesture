import { render } from 'react-dom'
import React, { useState } from 'react'
import { Stage, Layer, Circle } from 'react-konva'
import './styles.css'
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react'

const useGesture = createUseGesture([dragAction, pinchAction])

function Drag() {
  const [values, setValues] = useState({
    imageLeft: 0,
    imageTop: 0
  })
  const ref = React.useRef(null)

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ pinching, cancel, offset: [x, y], ...rest }) => {
        if (pinching) return cancel()
        setValues({ imageLeft: x, imageTop: y })
        // api.start({ x, y })
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
        if (first) {
          const { width, height, x, y } = ref.current.getBoundingClientRect()
          const tx = ox - (x + width / 2)
          const ty = oy - (y + height / 2)
          memo = [values.imageLeft, values.imageTop, tx, ty]
        }

        const x = memo[0] - ms * memo[2]
        const y = memo[1] - ms * memo[3]
        setValues({ imageLeft: x, imageTop: y })

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
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Circle
            ref={ref}
            // onMouseDown={e => {
            //   props.onMouseDown(e.evt)
            // }}
            // onTouchStart={e => {
            //   props.onTouchStart(e.evt)
            // }}
            x={values.imageLeft}
            y={values.imageTop}
            radius={100}
            fill="red"
          />
        </Layer>
      </Stage>
      <h1>
        x: {values.imageLeft}, y: {values.imageTop}{' '}
      </h1>
    </div>
  )
}

render(<Drag />, document.getElementById('root'))
