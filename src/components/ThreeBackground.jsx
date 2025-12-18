
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'

function Box(props) {
    const mesh = useRef()
    useFrame((state, delta) => (mesh.current.rotation.x += delta * 0.2))
    return (
        <mesh {...props} ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={props.color} />
        </mesh>
    )
}

export default function ThreeBackground() {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: '#111' }}>
            <Canvas>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <pointLight position={[-10, -10, -10]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Box position={[-1.2, 0, 0]} color="hotpink" />
                    <Box position={[1.2, 0, 0]} color="cyan" />
                </Float>
            </Canvas>
        </div>
    )
}
