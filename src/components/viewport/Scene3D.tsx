import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { useCameraStore } from '../../stores/useCameraStore';
import { useSceneStore } from '../../stores/useSceneStore';
import { useLightingStore } from '../../stores/useLightingStore';
import * as THREE from 'three';

// Orbiting camera that moves around the subject
function OrbitingCamera() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const { azimuth, elevation, roll } = useCameraStore();
    const { set } = useThree();

    useFrame(() => {
        if (cameraRef.current) {
            const azimuthRad = THREE.MathUtils.degToRad(azimuth);
            const elevationRad = THREE.MathUtils.degToRad(elevation);
            const rollRad = THREE.MathUtils.degToRad(roll);
            const distance = 6;

            const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
            const y = distance * Math.sin(elevationRad);
            const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);

            cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, x, 0.1);
            cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, y, 0.1);
            cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, z, 0.1);
            cameraRef.current.lookAt(0, 0, 0);
            cameraRef.current.rotateZ(rollRad);
            cameraRef.current.updateProjectionMatrix();
        }
    });

    useFrame(() => {
        if (cameraRef.current) set({ camera: cameraRef.current });
    });

    return (
        <perspectiveCamera ref={cameraRef} fov={50} near={0.1} far={1000} position={[0, 0, 6]} />
    );
}

// Static character card
function CharacterCard() {
    return (
        <group>
            <mesh>
                <planeGeometry args={[2, 3]} />
                <meshStandardMaterial color="#18181b" side={THREE.DoubleSide} roughness={0.7} metalness={0.2} />
            </mesh>
            <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(2, 3)]} />
                <lineBasicMaterial color="#6366f1" linewidth={2} />
            </lineSegments>
            <mesh position={[-0.9, 1.4, 0.02]}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
}

// Camera position indicator
function CameraIndicator() {
    const indicatorRef = useRef<THREE.Group>(null);
    const { azimuth, elevation } = useCameraStore();

    useFrame(() => {
        if (indicatorRef.current) {
            const azimuthRad = THREE.MathUtils.degToRad(azimuth);
            const elevationRad = THREE.MathUtils.degToRad(elevation);
            const distance = 5;

            const x = distance * Math.cos(elevationRad) * Math.sin(azimuthRad);
            const y = distance * Math.sin(elevationRad);
            const z = distance * Math.cos(elevationRad) * Math.cos(azimuthRad);

            indicatorRef.current.position.x = THREE.MathUtils.lerp(indicatorRef.current.position.x, x, 0.1);
            indicatorRef.current.position.y = THREE.MathUtils.lerp(indicatorRef.current.position.y, y, 0.1);
            indicatorRef.current.position.z = THREE.MathUtils.lerp(indicatorRef.current.position.z, z, 0.1);
            indicatorRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <group ref={indicatorRef} position={[0, 0, 5]}>
            <mesh>
                <coneGeometry args={[0.15, 0.3, 4]} />
                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
                <cylinderGeometry args={[0.08, 0.1, 0.1, 8]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
            </mesh>
        </group>
    );
}

// Light indicator spheres
function LightIndicator({ position, color, enabled }: { position: [number, number, number], color: string, enabled: boolean }) {
    if (!enabled) return null;
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
}

// Dynamic lighting based on store
function DynamicLighting() {
    const { keyLight, fillLight, backLight, practicalLight } = useLightingStore();

    return (
        <>
            {/* Ambient base */}
            <ambientLight intensity={0.2} />

            {/* Key Light */}
            {keyLight.enabled && (
                <>
                    <directionalLight
                        position={[keyLight.position.x, keyLight.position.y, keyLight.position.z]}
                        intensity={keyLight.intensity}
                        color={keyLight.color}
                    />
                    <LightIndicator position={[keyLight.position.x, keyLight.position.y, keyLight.position.z]} color={keyLight.color} enabled={true} />
                </>
            )}

            {/* Fill Light */}
            {fillLight.enabled && (
                <>
                    <pointLight
                        position={[fillLight.position.x, fillLight.position.y, fillLight.position.z]}
                        intensity={fillLight.intensity}
                        color={fillLight.color}
                    />
                    <LightIndicator position={[fillLight.position.x, fillLight.position.y, fillLight.position.z]} color={fillLight.color} enabled={true} />
                </>
            )}

            {/* Back Light */}
            {backLight.enabled && (
                <>
                    <spotLight
                        position={[backLight.position.x, backLight.position.y, backLight.position.z]}
                        intensity={backLight.intensity}
                        color={backLight.color}
                        angle={0.5}
                        penumbra={0.5}
                    />
                    <LightIndicator position={[backLight.position.x, backLight.position.y, backLight.position.z]} color={backLight.color} enabled={true} />
                </>
            )}

            {/* Practical Light */}
            {practicalLight.enabled && (
                <>
                    <pointLight
                        position={[practicalLight.position.x, practicalLight.position.y, practicalLight.position.z]}
                        intensity={practicalLight.intensity}
                        color={practicalLight.color}
                        distance={5}
                    />
                    <LightIndicator position={[practicalLight.position.x, practicalLight.position.y, practicalLight.position.z]} color={practicalLight.color} enabled={true} />
                </>
            )}
        </>
    );
}

// Volumetric fog effect
function VolumetricFog() {
    const { volumetric, fogDensity, fogColor } = useLightingStore();
    const { scene } = useThree();

    useFrame(() => {
        if (volumetric) {
            scene.fog = new THREE.FogExp2(fogColor, fogDensity);
        } else {
            scene.fog = null;
        }
    });

    return null;
}

function Scene() {
    return (
        <>
            {/* Dynamic Lighting */}
            <DynamicLighting />

            {/* Volumetric Fog */}
            <VolumetricFog />

            {/* Grid Floor */}
            <Grid
                args={[20, 20]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#27272a"
                sectionSize={2}
                sectionThickness={1}
                sectionColor="#3f3f46"
                fadeDistance={25}
                fadeStrength={1}
                position={[0, -2, 0]}
                infiniteGrid
            />

            {/* Static Character Card */}
            <CharacterCard />

            {/* Camera indicator */}
            <CameraIndicator />

            {/* Orbiting Camera */}
            <OrbitingCamera />
        </>
    );
}

export function Scene3D() {
    return (
        <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative">
            <Canvas>
                <Scene />
            </Canvas>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 text-[10px] space-y-1 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="opacity-70">Camera</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="opacity-70">Subject Front</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <span className="opacity-70">Lights</span>
                </div>
            </div>
        </div>
    );
}
