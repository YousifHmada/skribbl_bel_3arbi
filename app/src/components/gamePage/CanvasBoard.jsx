import React from 'react';
import SketchPad from './sketchPad/SketchPad';
import { TOOL_ELLIPSE, TOOL_LINE, TOOL_PENCIL, TOOL_RECTANGLE } from './sketchPad/tools';

export const CanvasBoard = () => {
  const [state, setState] = React.useState({
    tool: TOOL_PENCIL,
    size: 2,
    color: '#000000',
    fill: false,
    fillColor: '#444444',
    items: []
  })

  React.useEffect(() => {
    if (state.clearAll) {
      setState({ ...state, clearAll: false });
    }
  }, [state.clearAll])

  const { tool, size, color, fill, fillColor, items, clearAll } = state;
  console.log(state);
  return (
    <div>
      <div>
        <SketchPad
          width={550}
          height={500}
          animate={true}
          size={size}
          color={color}
          fillColor={fill ? fillColor : ''}
          items={items}
          tool={tool}
          clearAll={clearAll}
        />
      </div>
      <div style={{ float: 'left' }}>
        <div className="tools" style={{ marginBottom: 20 }}>
          <button
            style={tool === TOOL_PENCIL ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_PENCIL ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, tool: TOOL_PENCIL })}>
            Pencil
          </button>
          <button
            style={tool === TOOL_LINE ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_LINE ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, tool: TOOL_LINE })}>
            Line
          </button>
          <button
            style={tool === TOOL_ELLIPSE ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_ELLIPSE ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, tool: TOOL_ELLIPSE })}>
            Ellipse
          </button>
          <button
            style={tool === TOOL_RECTANGLE ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_RECTANGLE ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, tool: TOOL_RECTANGLE })}>
            Rectangle
          </button>
          <button
            style={tool === TOOL_RECTANGLE ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_RECTANGLE ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, tool: TOOL_PENCIL, color: 'white' })}>
            Eraser
          </button>
          <button
            style={tool === TOOL_RECTANGLE ? { fontWeight: 'bold' } : undefined}
            className={tool === TOOL_RECTANGLE ? 'item-active' : 'item'}
            onClick={() => setState({ ...state, clearAll: true })}>
            Clear all
          </button>
        </div>
        <div className="options" style={{ marginBottom: 20 }}>
          <label htmlFor="">size: </label>
          <input
            min="1"
            max="20"
            type="range"
            value={size}
            onChange={(e) => setState({ ...state, size: parseInt(e.target.value) })}
          />
        </div>
        <div className="options" style={{ marginBottom: 20 }}>
          <label htmlFor="">color: </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setState({ ...state, color: e.target.value })}
          />
        </div>
        {state.tool === TOOL_ELLIPSE || state.tool === TOOL_RECTANGLE ? (
          <div>
            <label htmlFor="">fill in:</label>
            <input
              type="checkbox"
              value={fill}
              style={{ margin: '0 8' }}
              onChange={(e) => setState({ ...state, fill: e.target.checked })}
            />
            {fill ? (
              <span>
                <label htmlFor="">with color:</label>
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setState({ ...state, fillColor: e.target.value })}
                />
              </span>
            ) : (
                ''
              )}
          </div>
        ) : (
            ''
          )}
      </div>
    </div>
  );
};
