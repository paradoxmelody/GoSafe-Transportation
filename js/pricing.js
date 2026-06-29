const BASE_FARE = 25;
const RATE_PER_KM = 10;
const MIN_FARE = 35;
const ROAD_FACTOR = 1.3;

export function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function calculateFare(straightLineKm) {
    const roadKm = straightLineKm * ROAD_FACTOR;
    const fare = BASE_FARE + roadKm * RATE_PER_KM;
    return {
        roadKm: Math.round(roadKm * 10) / 10,
        fare: Math.max(MIN_FARE, Math.round(fare))
    };
}

export function formatZAR(amount) {
    return `R${amount.toFixed(0)}`;
}

export async function geocodeAddress(address) {
    const query = encodeURIComponent(`${address}, Cape Town, Western Cape, South Africa`);
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
    );

    if (!response.ok) {
        throw new Error("Could not look up locations right now. Please try again.");
    }

    const results = await response.json();
    if (!results.length) {
        throw new Error(`We couldn't find "${address}". Try a more specific Cape Town address.`);
    }

    return {
        lat: parseFloat(results[0].lat),
        lon: parseFloat(results[0].lon),
        displayName: results[0].display_name
    };
}
