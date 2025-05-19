import { useEffect, useState, useContext, createContext } from "react";

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState( () => {
    const randomBookIndex = Math.floor(Math.random()*66) + 1
    return localStorage.getItem("bibleVersion") || randomBookIndex
  })

  useEffect(() => {
    localStorage.setItem("bibleBook", selectedBook)
  }, [selectedBook])

  const [selectedChapter, setSelectedChapter] = useState('')
  const [verseStart, setVerseStart] = useState('')
  const [verseEnd, setVerseEnd] = useState('')
  const [verseContent, setVerseContent] = useState(null)

  const [bibleVersion, setBibleVersion] = useState(() => {
    const valid_versions = ["NIV", "ESV", "NLT", "NASB", "KJV"]
    //Available versions: NIV, ESV, NLT, NASB
    const getBibleVersion = sessionStorage.getItem('bibleVersion') || 'NIV'
    return valid_versions.includes(getBibleVersion) ? getBibleVersion : 'NIV'
  })

  useEffect(() => {
    sessionStorage.getItem('bibleVersion', bibleVersion);
  }, [bibleVersion]);


  useEffect(() => {
    const passage_chapter = fetch(`https://bolls.life/get-text/${bibleVersion}/${selectedBook}/${selectedChapter}/`)
  })

  return (
    <BibleContext.Provider value={{
      selectedBook, setSelectedBook,
      selectedChapter, setSelectedChapter,
      verseStart, setVerseStart,
      verseEnd, setVerseEnd,
      verseContent, setVerseContent,
      bibleVersion, setBibleVersion,
    }}>
      {children}
    </BibleContext.Provider>
  );
};

export const useBible = () => {
  return useContext(BibleContext)
}
