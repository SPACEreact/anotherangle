import { Layers } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useSceneStore } from '../../stores/useSceneStore';
import { motion } from 'framer-motion';

export function SubjectPanel() {
    const subject = useSceneStore((state) => state.subject);
    const setting = useSceneStore((state) => state.setting);
    const setSubject = useSceneStore((state) => state.setSubject);
    const setSetting = useSceneStore((state) => state.setSetting);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
            <Card>
                <CardHeader icon={<Layers size={14} className="text-primary-400" />}>
                    <span className="text-primary-400">Subject & Scene Brief</span>
                </CardHeader>

                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold opacity-50 uppercase">Subject</label>
                        <textarea
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full text-sm p-3 rounded bg-zinc-900 border border-zinc-700 focus:border-primary-400 focus:outline-none"
                            rows={3}
                            placeholder="e.g., lone astronaut standing on icy moon"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold opacity-50 uppercase">Scene Context</label>
                        <textarea
                            value={setting}
                            onChange={(e) => setSetting(e.target.value)}
                            className="w-full text-sm p-3 rounded bg-zinc-900 border border-zinc-700 focus:border-primary-400 focus:outline-none"
                            rows={3}
                            placeholder="e.g., storm-lit alien horizon, ringed planet overhead"
                        />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
