import { getCombinedRating } from '@/utils/getCombinedRating';

describe('getCombinedRating', () => {
  beforeEach(() => {
    process.env.RATING_WEIGHT_INTERNAL = '0.6';
    process.env.RATING_WEIGHT_EXTERNAL = '0.4';
  });

  it('debe calcular correctamente cuando ambas notas existen', () => {
    const result = getCombinedRating(4.5, 4.0);
    expect(result).toBeCloseTo(4.3);
  });

  it('funciona con extremos altos', () => {
    const result = getCombinedRating(5.0, 1.0);
    expect(result).toBeCloseTo(3.4);
  });

  it('funciona con extremos bajos', () => {
    const result = getCombinedRating(1.0, 5.0);
    expect(result).toBeCloseTo(2.6);
  });

  it('tolera peso mal configurado', () => {
    process.env.RATING_WEIGHT_INTERNAL = 'abc';
    process.env.RATING_WEIGHT_EXTERNAL = 'xyz';
    const result = getCombinedRating(5.0, 5.0);
    expect(result).toBe(5.0); // Promedio simple
    });

  it('tolera nota interna vacía (simulada por null)', () => {
    const result = getCombinedRating(null as any, 4.7);
    expect(result).toBeNaN();
    });

});
