// ============================================
// GEO SERVICE UNIT TESTS
// ============================================

import { calculateDistance, isValidCoordinates } from '../../../services/geoService';

describe('GeoService - calculateDistance', () => {
  it('calculates known distance (Lima → Cusco ~ 571km)', () => {
    const lima = { lat: -12.0464, lon: -77.0428 };
    const cusco = { lat: -13.5319, lon: -71.9675 };
    const km = calculateDistance(lima.lat, lima.lon, cusco.lat, cusco.lon);
    expect(km).toBeGreaterThan(500);
    expect(km).toBeLessThan(700);
  });

  it('returns 0 for identical coordinates', () => {
    const km = calculateDistance(0, 0, 0, 0);
    expect(km).toBe(0);
  });
});

describe('GeoService - isValidCoordinates', () => {
  it('validates proper ranges', () => {
    expect(isValidCoordinates(0, 0)).toBe(true);
    expect(isValidCoordinates(90, 180)).toBe(true);
    expect(isValidCoordinates(-90, -180)).toBe(true);
  });

  it('rejects out of range values', () => {
    expect(isValidCoordinates(91, 0)).toBe(false);
    expect(isValidCoordinates(0, 181)).toBe(false);
  });
});
