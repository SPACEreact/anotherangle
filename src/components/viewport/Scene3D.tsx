import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useCameraStore } from '../../stores/useCameraStore';
import { useLocationStore } from '../../stores/useLocationStore';
import { cosmicLocations } from '../../data/locations';
import * as THREE from 'three';

function indexToSpherePoint(index: number, total: number, radius: number): [number, number, number] {
    const phi = Math.acos(1 - (2 * (index + 0.5)) / total);
    const theta = Math.PI * (1 + Math.sqrt(5)) * index;
    return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
    ];
}

function CameraRig() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const { azimuth, elevation, roll } = useCameraStore();
    const { set } = useThree();

    useFrame(() => {
        if (!cameraRef.current) return;
        const azimuthRad = THREE.MathUtils.degToRad(azimuth);
        const elevationRad = THREE.MathUtils.degToRad(elevation);
        const rollRad = THREE.MathUtils.degToRad(roll);
        const distance = 12;

        const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
        const y = distance * Math.sin(elevationRad);
        const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);

        cameraRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.08);
        cameraRef.current.lookAt(0, 0, 0);
        cameraRef.current.rotation.z = rollRad;
        cameraRef.current.updateProjectionMatrix();
        set({ camera: cameraRef.current });
    });

    return <perspectiveCamera ref={cameraRef} fov={52} near={0.1} far={2000} position={[0, 0, 12]} />;
}

function UniverseNodes() {
    const { cosmicLocation, setMode, setCosmicLocation, setUniversePoint, setCameraVantage } = useLocationStore();
    const setAngles = useCameraStore((state) => state.setAngles);
    const [hovered, setHovered] = useState<string | null>(null);

    const nodes = useMemo(
        () => cosmicLocations.map((loc, idx) => ({ ...loc, position: indexToSpherePoint(idx, cosmicLocations.length, 5) })),
        []
    );

    const handleSelect = (id: string, name: string, prompt: string, position: [number, number, number]) => {
        setMode('cosmic');
        setCosmicLocation(id);
        setUniversePoint(prompt);
        setCameraVantage(`cinematic observer frame centered on ${name}`);

        const [x, y, z] = position;
        const azimuth = (Math.atan2(x, z) * 180) / Math.PI;
        const elevation = (Math.atan2(y, Math.sqrt(x * x + z * z)) * 180) / Math.PI;
        setAngles({ azimuth, elevation });
    };

    return (
        <>
            {nodes.map((node) => {
                const selected = cosmicLocation === node.id;
                const color = selected ? '#f472b6' : '#60a5fa';
                return (
                    <mesh
                        key={node.id}
                        position={node.position}
                        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                            e.stopPropagation();
                            setHovered(node.id);
                        }}
                        onPointerOut={() => setHovered(null)}
                        onClick={() => handleSelect(node.id, node.name, node.prompt, node.position)}
                    >
                        <sphereGeometry args={[selected ? 0.22 : 0.16, 24, 24]} />
                        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.9 : 0.4} />
                        {hovered === node.id && (
                            <mesh position={[0, 0.34, 0]}>
                                <sphereGeometry args={[0.08, 16, 16]} />
                                <meshBasicMaterial color="#ffffff" />
                            </mesh>
                        )}
                    </mesh>
                );
            })}
        </>
    );
}

function Scene() {
    return (
        <>
            <color attach="background" args={['#020617']} />
            <ambientLight intensity={0.35} />
            <pointLight position={[0, 0, 0]} intensity={1.5} color="#8b5cf6" />
            <pointLight position={[8, 4, 5]} intensity={0.8} color="#38bdf8" />

            <mesh>
                <sphereGeometry args={[1.2, 48, 48]} />
                <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
            </mesh>

            <UniverseNodes />
            <Stars radius={120} depth={60} count={4500} factor={4} saturation={0} fade speed={0.35} />
            <OrbitControls enablePan={false} enableZoom maxDistance={24} minDistance={6} />
            <CameraRig />
        </>
    );
}

export function Scene3D() {
    const cosmicLocation = useLocationStore((state) => state.cosmicLocation);
    const selected = cosmicLocations.find((loc) => loc.id === cosmicLocation);

    return (
        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative">
            <Canvas>
                <Scene />
            </Canvas>

            <div className="absolute top-4 left-4 text-[10px] bg-black/50 backdrop-blur-sm rounded-lg p-2 border border-zinc-700 max-w-[75%]">
                <p className="opacity-70 uppercase tracking-wider mb-1">Interactive 3D Universe</p>
                <p className="text-zinc-200">Click any star-marker to choose your cosmic location.</p>
                {selected && <p className="text-fuchsia-300 mt-1">Selected: {selected.name}</p>}
            </div>
        </div>
    );
}
