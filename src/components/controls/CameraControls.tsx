import { useCameraStore } from '../../stores/useCameraStore';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { motion } from 'framer-motion';

export function CameraControls() {
    const { azimuth, elevation, roll, setAzimuth, setElevation, setRoll } = useCameraStore();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card>
                {/* Azimuth - Horizontal Orbit */}
                <Slider
                    value={azimuth}
                    onChange={setAzimuth}
                    min={0}
                    max={360}
                    leftLabel="Orbit Left"
                    rightLabel="Orbit Right"
                    color="primary"
                    className="mb-6"
                />

                <div className="grid grid-cols-2 gap-6">
                    {/* Elevation - Vertical Angle */}
                    <Slider
                        value={elevation}
                        onChange={setElevation}
                        min={-90}
                        max={90}
                        leftLabel="Low"
                        rightLabel="High"
                        color="purple"
                    />

                    {/* Roll - Dutch Angle */}
                    <Slider
                        value={roll}
                        onChange={setRoll}
                        min={-45}
                        max={45}
                        leftLabel="Tilt L"
                        rightLabel="Tilt R"
                        color="pink"
                    />
                </div>
            </Card>
        </motion.div>
    );
}
