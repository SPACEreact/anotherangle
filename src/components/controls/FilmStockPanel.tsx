import { Aperture } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useSceneStore } from '../../stores/useSceneStore';
import { filmStocks } from '../../data/filmStocks';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function FilmStockPanel() {
    const { filmStock, setFilmStock } = useSceneStore();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card>
                <CardHeader icon={<Aperture size={14} className="text-pink-500" />}>
                    <span className="text-pink-500">Film Stock</span>
                </CardHeader>

                <div className="flex flex-wrap gap-2">
                    {filmStocks.slice(0, 6).map((stock, index) => (
                        <motion.button
                            key={stock.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            onClick={() => setFilmStock(stock.id)}
                            className={clsx(
                                'px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                                filmStock === stock.id
                                    ? 'bg-pink-500 text-white border-pink-500'
                                    : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:bg-zinc-800'
                            )}
                        >
                            {stock.name}
                        </motion.button>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
}
