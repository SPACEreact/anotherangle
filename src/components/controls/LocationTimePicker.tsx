import { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Cloud, Zap, Globe, Crosshair } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { useLocationStore, type LocationMode } from '../../stores/useLocationStore';
import { earthLocations, cosmicLocations, eras, timesOfDay, weatherOptions, seasons } from '../../data/locations';
import { getSceneSuggestions } from '../../services/aiService';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Map Component using an iframe
function SimpleMap() {
    const { coordinates, setCoordinates } = useLocationStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);

        try {
            // Use Google Geocoding API
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=AIzaSyAU695i1Apsq5X-geQRp7lAdDsmDOfHOSc`
            );
            const data = await res.json();

            if (data.results?.[0]) {
                const result = data.results[0];
                const { lat, lng } = result.geometry.location;

                // Extract place name
                const city = result.address_components?.find((c: any) => c.types.includes('locality'))?.long_name;
                const country = result.address_components?.find((c: any) => c.types.includes('country'))?.long_name;
                const placeName = city && country ? `${city}, ${country}` : result.formatted_address?.split(',').slice(0, 2).join(',');

                setCoordinates({ lat, lng, placeName: placeName || searchQuery });
            }
        } catch (err) {
            console.error('Geocode failed:', err);
        }

        setSearching(false);
    };

    return (
        <div className="space-y-2">
            {/* Search Box */}
            <div className="flex gap-1">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search location... (e.g., Tokyo, Paris)"
                    className="flex-1 bg-zinc-900/50 border border-zinc-700 rounded p-2 text-xs focus:border-rose-500 focus:outline-none"
                />
                <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="px-3 bg-rose-500 text-white rounded text-xs font-bold hover:bg-rose-600 disabled:opacity-50"
                >
                    {searching ? '...' : '🔍'}
                </button>
            </div>

            {/* Map Preview or Current Location */}
            {coordinates ? (
                <div className="relative">
                    <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAU695i1Apsq5X-geQRp7lAdDsmDOfHOSc&q=${coordinates.lat},${coordinates.lng}&zoom=10`}
                        className="w-full h-32 rounded-lg border border-zinc-700"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                        <div className="flex items-center gap-1 text-[10px]">
                            <Crosshair size={10} className="text-rose-500" />
                            <span className="text-white truncate font-medium">{coordinates.placeName}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-24 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center">
                    <div className="text-center opacity-50">
                        <Globe size={20} className="mx-auto mb-1" />
                        <span className="text-[10px]">Search for a location above</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export function LocationTimePicker() {
    const {
        mode, coordinates, earthLocation, customLocation, cosmicLocation, era, year, timeOfDay, weather, season, smartFilterEnabled,
        setMode, setEarthLocation, setCustomLocation, setCosmicLocation, setEra, setYear, setTimeOfDay, setWeather, setSeason, setSmartFilterEnabled, setCoordinates
    } = useLocationStore();

    const [showAllCosmic, setShowAllCosmic] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    // Get AI suggestions when coordinates change
    const handleGetSuggestions = async () => {
        if (!coordinates?.placeName) return;
        setLoadingSuggestions(true);
        const suggestions = await getSceneSuggestions(coordinates.placeName);
        setAiSuggestions(suggestions);
        setLoadingSuggestions(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
        >
            {/* Smart Filter Toggle */}
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Zap size={14} className="text-yellow-500" />
                        <span className="text-xs font-bold uppercase text-yellow-500">Smart Filter</span>
                    </div>
                    <button
                        onClick={() => setSmartFilterEnabled(!smartFilterEnabled)}
                        className={clsx(
                            'px-3 py-1 rounded text-xs font-bold transition-all',
                            smartFilterEnabled
                                ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-300'
                                : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                        )}
                    >
                        {smartFilterEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
                <p className="text-[10px] opacity-50 mt-1">Removes contradicting keywords</p>
            </Card>

            {/* Location Card */}
            <Card>
                <CardHeader icon={<MapPin size={14} className="text-rose-500" />}>
                    <span className="text-rose-500">Location</span>
                </CardHeader>

                {/* Mode Tabs */}
                <div className="flex gap-1 mb-3">
                    {(['earth', 'cosmic'] as LocationMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={clsx(
                                'flex-1 py-2 rounded text-xs font-bold uppercase transition-all flex items-center justify-center gap-1',
                                mode === m
                                    ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                                    : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400 hover:bg-zinc-700/50'
                            )}
                        >
                            <span>{m === 'earth' ? '🌍' : '🌌'}</span>
                            <span>{m === 'earth' ? 'Earth' : 'Cosmos'}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {mode === 'earth' && (
                        <motion.div
                            key="earth"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            {/* Map Search */}
                            <SimpleMap />

                            {/* AI Suggestions Button */}
                            {coordinates && (
                                <button
                                    onClick={handleGetSuggestions}
                                    disabled={loadingSuggestions}
                                    className="w-full py-1.5 bg-purple-500/20 border border-purple-500/30 rounded text-[10px] text-purple-300 hover:bg-purple-500/30"
                                >
                                    {loadingSuggestions ? '🤖 Getting AI suggestions...' : '✨ Get AI Scene Ideas'}
                                </button>
                            )}

                            {/* AI Suggestions */}
                            {aiSuggestions.length > 0 && (
                                <div className="space-y-1">
                                    <span className="text-[10px] opacity-50">AI Scene Ideas:</span>
                                    {aiSuggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCustomLocation(s)}
                                            className="w-full text-left text-[10px] p-1.5 rounded bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Quick Locations */}
                            <div>
                                <span className="text-[10px] uppercase opacity-50 block mb-1">Quick Select</span>
                                <div className="grid grid-cols-5 gap-1">
                                    {earthLocations.slice(0, 10).map((loc) => (
                                        <button
                                            key={loc.id}
                                            onClick={() => { setEarthLocation(loc.id); setCoordinates(null); }}
                                            className={clsx(
                                                'p-1.5 rounded text-center transition-all',
                                                earthLocation === loc.id && !coordinates
                                                    ? 'bg-rose-500/20 border border-rose-500/50'
                                                    : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                                            )}
                                            title={loc.name}
                                        >
                                            <div className="text-lg">{loc.icon}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'cosmic' && (
                        <motion.div
                            key="cosmic"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-2"
                        >
                            <div className="grid grid-cols-5 gap-1">
                                {(showAllCosmic ? cosmicLocations : cosmicLocations.slice(0, 10)).map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setCosmicLocation(loc.id)}
                                        className={clsx(
                                            'p-1.5 rounded text-center transition-all',
                                            cosmicLocation === loc.id
                                                ? 'bg-purple-500/20 border border-purple-500/50'
                                                : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                                        )}
                                        title={loc.name}
                                    >
                                        <div className="text-lg">{loc.icon}</div>
                                    </button>
                                ))}
                            </div>
                            {cosmicLocations.length > 10 && (
                                <button
                                    onClick={() => setShowAllCosmic(!showAllCosmic)}
                                    className="w-full text-[10px] text-zinc-400 hover:text-white py-1"
                                >
                                    {showAllCosmic ? 'Show less' : `+${cosmicLocations.length - 10} more`}
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>

            {/* Time Card */}
            <Card>
                <CardHeader icon={<Clock size={14} className="text-amber-500" />}>
                    <span className="text-amber-500">Time Period</span>
                </CardHeader>

                {/* Era Selection */}
                <div className="grid grid-cols-5 gap-1 mb-3">
                    {eras.slice(0, 10).map((e) => (
                        <button
                            key={e.id}
                            onClick={() => { setEra(e.id); setYear(e.year); }}
                            className={clsx(
                                'p-1.5 rounded text-center transition-all',
                                era === e.id
                                    ? 'bg-amber-500/20 border border-amber-500/50'
                                    : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                            )}
                            title={e.name}
                        >
                            <div className="text-lg">{e.icon}</div>
                        </button>
                    ))}
                </div>

                {/* Year Slider */}
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] uppercase opacity-50">Year</span>
                        <span className="text-xs font-mono font-bold">
                            {year < 0 ? `${Math.abs(year)} BC` : `${year} AD`}
                        </span>
                    </div>
                    <Slider
                        value={year}
                        onChange={setYear}
                        min={-10000}
                        max={3000}
                        showValue={false}
                        color="pink"
                    />
                </div>

                {/* Time of Day */}
                <div className="grid grid-cols-5 gap-1">
                    {timesOfDay.slice(0, 5).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTimeOfDay(t.id)}
                            className={clsx(
                                'p-1.5 rounded text-center transition-all',
                                timeOfDay === t.id
                                    ? 'bg-amber-500/20 border border-amber-500/50'
                                    : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                            )}
                            title={t.name}
                        >
                            <div className="text-sm">{t.icon}</div>
                        </button>
                    ))}
                </div>
            </Card>

            {/* Weather & Season */}
            <Card>
                <CardHeader icon={<Cloud size={14} className="text-sky-500" />}>
                    <span className="text-sky-500">Environment</span>
                </CardHeader>

                <div className="space-y-2">
                    {/* Weather */}
                    <div>
                        <span className="text-[10px] uppercase opacity-50 block mb-1">Weather</span>
                        <div className="grid grid-cols-8 gap-1">
                            {weatherOptions.map((w) => (
                                <button
                                    key={w.id}
                                    onClick={() => setWeather(w.id)}
                                    className={clsx(
                                        'p-1 rounded text-center transition-all',
                                        weather === w.id
                                            ? 'bg-sky-500/20 border border-sky-500/50'
                                            : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                                    )}
                                    title={w.name}
                                >
                                    <div className="text-sm">{w.icon}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Season */}
                    <div>
                        <span className="text-[10px] uppercase opacity-50 block mb-1">Season</span>
                        <div className="grid grid-cols-4 gap-1">
                            {seasons.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSeason(s.id)}
                                    className={clsx(
                                        'p-1.5 rounded text-center transition-all flex items-center justify-center gap-1',
                                        season === s.id
                                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                                            : 'bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50'
                                    )}
                                    title={s.name}
                                >
                                    <span className="text-sm">{s.icon}</span>
                                    <span className="text-[10px]">{s.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
