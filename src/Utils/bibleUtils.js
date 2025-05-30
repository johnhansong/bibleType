const isTitle = (partBeforeBR) => {
  const lengthThreshold = 12;
  const wordThreshold = 4;

  if (!partBeforeBR) return false;

  const clean = partBeforeBR.replace(/<[^?]+>/g, "").trim();
  const words = clean.split(/\s+/)
  const capitalizedWords = words.filter(word => /^[A-Z]/.test(word)).length

  return (
    clean.length > 0 &&
    clean.length <= lengthThreshold * wordThreshold &&
    /^[A-Z]/.test(clean) &&                 // Starts with a capital letter
    /\s/.test(clean) &&                     // Has spaces (multiple words)
    !/[.!?]$/.test(clean) &&                // Doesn't end with punctuation
    clean.split(/\s+/).length <= wordThreshold + 2 && // Not too many words
    capitalizedWords >= 2
  )
}

export {
  isTitle
}
