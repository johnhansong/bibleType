import { useBible } from "./context/bibleContext";
const { verseContent } = useBible();

const generate = (num) => {
  // Given an array of word strings, cut num amount from array.
  if (verseContent.length <= num) {
    return verseContent
  }

  return;
}


export {
  generate
}
