import React from 'react';
import { JoystickUI } from './components/JoystickUI';

export default function App() {
  return (
    <div style={containerStyle}>
      <div style={exampleGroupStyle}>
        <h3>自由摇杆</h3>
        <JoystickUI 
          onMove={(data) => console.log('自由模式:', data)}
        />
      </div>

      <div style={exampleGroupStyle}>
        <h3>水平锁定</h3>
        <JoystickUI 
          lockX
          radius={60}
          style={{ backgroundColor: 'rgba(255,0,0,0.1)' }}
          onMove={(data) => console.log('水平模式:', data)}
        />
      </div>

      <div style={exampleGroupStyle}>
        <h3>垂直锁定</h3>
        <JoystickUI 
          lockY
          deadZone={0.2}
          style={{ backgroundColor: 'rgba(0,255,0,0.1)' }}
          onMove={(data) => console.log('垂直模式:', data)}
        />
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-around',
  padding: '2rem',
  minHeight: '100vh',
  backgroundColor: '#f0f0f0'
};

const exampleGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem'
}; 