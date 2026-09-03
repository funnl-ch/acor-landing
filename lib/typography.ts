/**
 * Espace insécable avant ? et !, règle typographique française.
 * Évite aussi que la ponctuation se retrouve seule en début de ligne.
 */
export function nbsp(text: string): string {
  return text.replace(/ ([?!])/g, "\u00A0$1");
}
