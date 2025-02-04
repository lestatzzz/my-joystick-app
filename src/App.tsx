import React from 'react';
import VirtualJoystick from './components/VirtualJoystick';
import './App.css';

export default function App() {
  return (
    <div className="joystick-container">
      <VirtualJoystick
        lockAxis="x"
        baseImage="/joystick-base.png"
        stickImage="/joystick-handle.png"
        onMove={(delta) => console.log('X轴摇杆:', delta)}
      />
      <VirtualJoystick
        lockAxis="y"
        baseImage="/joystick-base.png"
        stickImage="/joystick-handle.png"
        onMove={(delta) => console.log('Y轴摇杆:', delta)}
      />
    </div>
  );
}
