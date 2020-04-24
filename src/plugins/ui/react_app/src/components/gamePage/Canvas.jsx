import React from 'react';
// import CanvasDraw from 'react-canvas-draw';
import { PaletteTools } from './PaletteTools';

// const defaultProps = {
//   onChange: null,
//   loadTimeOffset: 5,
//   lazyRadius: 30,
//   brushRadius: 12,
//   brushColor: "#444",
//   catenaryColor: "#0a0302",
//   gridColor: "rgba(150,150,150,0.17)",
//   hideGrid: false,
//   canvasWidth: 600,
//   canvasHeight: 600,
//   disabled: false,
//   imgSrc: "",
//   saveData: null,
//   immediateLoading: false,
//   hideInterface: false
// };

export const Canvas = () => (
  // const sketchProps = {
  //   tool:TOOL_PENCIL,
  //   size: 2,
  //   color: '#000000',
  //   fill: false,
  //   fillColor: '#444444',
  //   items: []
  // }
  <>
    <h1>Hello Canvas</h1>
    {/* <CanvasDraw {...defaultProps} /> */}
    {/* <SketchPad
            width={500}
            height={500}
            animate={true}
            fillColor={sketchProps.fill ? sketchProps.fillColor : ''}
            {...sketchProps}
            onCompleteItem={console.log}
          /> */}
    <PaletteTools />
  </>
);
