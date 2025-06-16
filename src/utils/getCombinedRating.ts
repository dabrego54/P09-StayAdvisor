// src/utils/getCombinedRating.ts

export function getCombinedRating(interna: number, externa: number): number {
  const pesoInterno = parseFloat(process.env.RATING_WEIGHT_INTERNAL || '0.6');
  const pesoExterno = parseFloat(process.env.RATING_WEIGHT_EXTERNAL || '0.4');

  // Si alguna nota es null o undefined, no se puede calcular
  if (interna == null || externa == null) {
    console.warn('⚠️ Rating interno o externo nulo. No se puede calcular el ranking combinado.');
    return NaN;
  }

  // Validar que los pesos sean válidos
  if (isNaN(pesoInterno) || isNaN(pesoExterno)) {
    console.warn('⚠️ Pesos inválidos, usando promedio simple');
    return (interna + externa) / 2;
  }

  return (
    (pesoInterno * interna + pesoExterno * externa) /
    (pesoInterno + pesoExterno)
  );
}
