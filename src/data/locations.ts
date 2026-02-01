// Earth Locations
export const earthLocations = [
    { id: 'tokyo', name: 'Tokyo, Japan', prompt: 'Tokyo, Japan', icon: '🗼' },
    { id: 'paris', name: 'Paris, France', prompt: 'Paris, France', icon: '🗼' },
    { id: 'newyork', name: 'New York City', prompt: 'New York City, USA', icon: '🗽' },
    { id: 'london', name: 'London, UK', prompt: 'London, England', icon: '🎡' },
    { id: 'dubai', name: 'Dubai, UAE', prompt: 'Dubai, UAE', icon: '🏙️' },
    { id: 'cairo', name: 'Cairo, Egypt', prompt: 'Cairo, Egypt near the pyramids', icon: '🏛️' },
    { id: 'rome', name: 'Rome, Italy', prompt: 'Rome, Italy', icon: '🏛️' },
    { id: 'beijing', name: 'Beijing, China', prompt: 'Beijing, China', icon: '🏯' },
    { id: 'mumbai', name: 'Mumbai, India', prompt: 'Mumbai, India', icon: '🕌' },
    { id: 'sydney', name: 'Sydney, Australia', prompt: 'Sydney, Australia', icon: '🌉' },
    { id: 'amazon', name: 'Amazon Rainforest', prompt: 'Amazon rainforest, South America', icon: '🌴' },
    { id: 'sahara', name: 'Sahara Desert', prompt: 'Sahara desert, Africa', icon: '🏜️' },
    { id: 'alps', name: 'Swiss Alps', prompt: 'Swiss Alps, Europe', icon: '🏔️' },
    { id: 'iceland', name: 'Iceland', prompt: 'Iceland, volcanic landscape', icon: '🌋' },
    { id: 'antarctica', name: 'Antarctica', prompt: 'Antarctica, frozen landscape', icon: '🧊' },
];

// Cosmic Locations
export const cosmicLocations = [
    // Solar System
    { id: 'moon', name: 'The Moon', prompt: 'on the surface of the Moon with Earth in the sky', icon: '🌙', category: 'Solar System' },
    { id: 'mars', name: 'Mars Surface', prompt: 'on the surface of Mars, red desert landscape', icon: '🔴', category: 'Solar System' },
    { id: 'europa', name: 'Europa (Jupiter Moon)', prompt: 'on Europa, icy moon of Jupiter with Jupiter looming in the sky', icon: '🪐', category: 'Solar System' },
    { id: 'titan', name: 'Titan (Saturn Moon)', prompt: 'on Titan, orange hazy atmosphere, hydrocarbon lakes', icon: '🟠', category: 'Solar System' },
    { id: 'saturn_rings', name: 'Saturn\'s Rings', prompt: 'floating among Saturn\'s rings, ice and rock debris', icon: '💫', category: 'Solar System' },
    { id: 'asteroid', name: 'Asteroid Belt', prompt: 'on an asteroid in the asteroid belt, rocky void of space', icon: '☄️', category: 'Solar System' },

    // Deep Space
    { id: 'orion', name: 'Orion Nebula', prompt: 'inside the Orion Nebula, swirling cosmic gas clouds', icon: '🌌', category: 'Deep Space' },
    { id: 'pillars', name: 'Pillars of Creation', prompt: 'near the Pillars of Creation, towering cosmic dust columns', icon: '✨', category: 'Deep Space' },
    { id: 'blackhole', name: 'Black Hole', prompt: 'near a supermassive black hole with accretion disk', icon: '⚫', category: 'Deep Space' },
    { id: 'andromeda', name: 'Andromeda Galaxy', prompt: 'viewing Andromeda Galaxy, spiral arms of billions of stars', icon: '🌀', category: 'Deep Space' },
    { id: 'neutron', name: 'Neutron Star', prompt: 'near a pulsar neutron star, intense radiation beams', icon: '💥', category: 'Deep Space' },

    // Fictional/Sci-Fi
    { id: 'dyson', name: 'Dyson Sphere', prompt: 'inside a Dyson Sphere, massive megastructure around a star', icon: '🔆', category: 'Sci-Fi' },
    { id: 'ringworld', name: 'Ringworld', prompt: 'on a Ringworld megastructure, artificial horizon curves upward', icon: '⭕', category: 'Sci-Fi' },
    { id: 'wormhole', name: 'Wormhole', prompt: 'entering a wormhole, spacetime tunnel with gravitational lensing', icon: '🕳️', category: 'Sci-Fi' },
];

// Eras / Time Periods
export const eras = [
    { id: 'prehistoric', name: 'Prehistoric', year: -50000, prompt: 'prehistoric era, primitive world', icon: '🦕' },
    { id: 'ancient_egypt', name: 'Ancient Egypt', year: -2500, prompt: 'ancient Egyptian era, pharaohs and pyramids', icon: '🏺' },
    { id: 'ancient_rome', name: 'Ancient Rome', year: 100, prompt: 'ancient Roman era, togas and temples', icon: '🏛️' },
    { id: 'medieval', name: 'Medieval', year: 1200, prompt: 'medieval era, castles and knights', icon: '⚔️' },
    { id: 'renaissance', name: 'Renaissance', year: 1500, prompt: 'Renaissance era, art and enlightenment', icon: '🎨' },
    { id: 'victorian', name: 'Victorian', year: 1880, prompt: 'Victorian era, steam and industry', icon: '🎩' },
    { id: 'roaring20s', name: 'Roaring 20s', year: 1925, prompt: '1920s era, jazz age and art deco', icon: '🎺' },
    { id: 'ww2', name: 'World War II', year: 1943, prompt: '1940s wartime era', icon: '✈️' },
    { id: 'retro60s', name: '1960s Retro', year: 1965, prompt: '1960s era, mod fashion and space race', icon: '🚀' },
    { id: 'synthwave80s', name: '1980s Synthwave', year: 1985, prompt: '1980s synthwave aesthetic, neon and chrome', icon: '📼' },
    { id: 'y2k', name: 'Y2K / 2000s', year: 2000, prompt: 'Y2K era, millennium aesthetic', icon: '💿' },
    { id: 'modern', name: 'Modern Day', year: 2024, prompt: 'modern day, contemporary setting', icon: '📱' },
    { id: 'nearfuture', name: 'Near Future', year: 2050, prompt: 'near future, advanced technology', icon: '🤖' },
    { id: 'cyberpunk', name: 'Cyberpunk', year: 2077, prompt: 'cyberpunk future, neon dystopia', icon: '🌃' },
    { id: 'farfuture', name: 'Far Future', year: 3000, prompt: 'far future, post-singularity civilization', icon: '🛸' },
];

// Time of Day
export const timesOfDay = [
    { id: 'dawn', name: 'Dawn', prompt: 'at dawn, first light of day', icon: '🌅' },
    { id: 'morning', name: 'Morning', prompt: 'in the morning, soft daylight', icon: '☀️' },
    { id: 'noon', name: 'Noon', prompt: 'at noon, harsh midday sun', icon: '🌞' },
    { id: 'afternoon', name: 'Afternoon', prompt: 'in the afternoon, warm golden light', icon: '🌤️' },
    { id: 'goldenhour', name: 'Golden Hour', prompt: 'during golden hour, warm sunset light', icon: '🌇' },
    { id: 'dusk', name: 'Dusk', prompt: 'at dusk, twilight fading', icon: '🌆' },
    { id: 'night', name: 'Night', prompt: 'at night, darkness and city lights', icon: '🌃' },
    { id: 'midnight', name: 'Midnight', prompt: 'at midnight, deep night', icon: '🌑' },
    { id: 'bluehour', name: 'Blue Hour', prompt: 'during blue hour, ethereal twilight', icon: '🔵' },
];

// Weather
export const weatherOptions = [
    { id: 'clear', name: 'Clear', prompt: '', icon: '☀️' },
    { id: 'cloudy', name: 'Cloudy', prompt: 'overcast sky', icon: '☁️' },
    { id: 'rain', name: 'Rain', prompt: 'rain falling, wet surfaces', icon: '🌧️' },
    { id: 'storm', name: 'Thunderstorm', prompt: 'thunderstorm, lightning in the sky', icon: '⛈️' },
    { id: 'snow', name: 'Snow', prompt: 'snowfall, winter atmosphere', icon: '❄️' },
    { id: 'fog', name: 'Fog', prompt: 'thick fog, low visibility', icon: '🌫️' },
    { id: 'sandstorm', name: 'Sandstorm', prompt: 'sandstorm, dusty atmosphere', icon: '🏜️' },
    { id: 'aurora', name: 'Aurora', prompt: 'aurora borealis in the sky', icon: '🌌' },
];

// Seasons
export const seasons = [
    { id: 'spring', name: 'Spring', prompt: 'spring season, cherry blossoms', icon: '🌸' },
    { id: 'summer', name: 'Summer', prompt: 'summer season, vibrant green', icon: '☀️' },
    { id: 'autumn', name: 'Autumn', prompt: 'autumn season, golden leaves', icon: '🍂' },
    { id: 'winter', name: 'Winter', prompt: 'winter season, bare trees and frost', icon: '❄️' },
];
