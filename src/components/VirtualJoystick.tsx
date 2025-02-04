import { useEffect, useRef } from 'react';
import { Joystick } from '../utils/Joystick';

interface VirtualJoystickProps {
    width?: number;
    height?: number;
    lockAxis?: 'x' | 'y' | null;
    baseImage: string;
    stickImage: string;
    baseRadius?: number;
    stickRadius?: number;
    onMove: (delta: { x: number; y: number }) => void;
    onEnd?: () => void;
}

export default function VirtualJoystick({
    width = 200,
    height = 200,
    lockAxis = null,
    baseImage,
    stickImage,
    baseRadius = 60,
    stickRadius = 30,
    onMove,
    onEnd
}: VirtualJoystickProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const joystickRef = useRef<Joystick | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            joystickRef.current = new Joystick(canvasRef.current, {
                lockAxis,
                baseImage,
                stickImage,
                baseRadius,
                stickRadius,
                onMove,
                onEnd
            });
        }

        return () => {
            joystickRef.current?.destroy();
        };
    }, [lockAxis, baseImage, stickImage, baseRadius, stickRadius]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ touchAction: 'none' }}
        />
    );
} 