import React, { useEffect, useRef } from 'react';
import { VirtualJoystick, JoystickConfig, JoystickData } from './VirtualJoystick';

interface JoystickUIProps extends JoystickConfig {
  style?: React.CSSProperties;
}

export const JoystickUI: React.FC<JoystickUIProps> = ({ style, ...config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const joystickRef = useRef<VirtualJoystick | null>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      joystickRef.current = new VirtualJoystick(containerRef.current, {
        ...config,
        onMove: (data) => {
          config.onMove?.(data);
          updateKnobPosition(data);
        },
      });

      return () => joystickRef.current?.destroy();
    }
  }, []);

  const updateKnobPosition = (data: JoystickData) => {
    if (knobRef.current) {
      const radius = config.radius || 50;
      const maxMovement = radius - 20;
      const offsetX = data.x * maxMovement;
      const offsetY = data.y * maxMovement;

      knobRef.current.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.2)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          transition: 'transform 0.1s ease-out',
          willChange: 'transform',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
};
