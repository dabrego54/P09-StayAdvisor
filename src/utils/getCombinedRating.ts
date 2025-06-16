export function getCombinedRating(interna: number, externa: number): number {
  const pesoInterno = parseFloat(process.env.RATING_WEIGHT_INTERNAL || '0.6');
  const pesoExterno = parseFloat(process.env.RATING_WEIGHT_EXTERNAL || '0.4');

  return (
    (pesoInterno * interna + pesoExterno * externa) /
    (pesoInterno + pesoExterno)
  );
}
