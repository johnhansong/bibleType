import { useEffect, useState, useContext, createContext } from "react";
import bibleData from '../assets/bibleMetadata.json'

export const BibleContext = createContext();

/// Bible JSON structure
// "1": {
//     "name": "Genesis",
//     "testament": "OT",
//     "chapters": [
//       {
//         "length", 31
//       },
//       {
//         "length": 25
//       },
//       ...
//     ]
//   }

export const BibleProvider = ({ children }) => {
  /// SELECT/SET BOOK
  const [selectedBook, setSelectedBook] = useState( () => {
    const randomBookIndex = Math.floor(Math.random()*66) + 1
    return localStorage.getItem("bibleVersion") || randomBookIndex
  })
  useEffect(() => {
    localStorage.setItem("bibleBook", selectedBook)
  }, [selectedBook])

  /// SELECT/SET CHAPTER
  const [selectedChapter, setSelectedChapter] = useState(() => {
    if (!localStorage.getItem("bibleChapter")) {
      const numberOfChapters = bibleData[selectedBook]["chapters"].length
      return Math.floor(Math.random()*numberOfChapters) + 1
    }
    else {
      return localStorage.getItem("bibleChapter")
    }
  })
  useEffect(() => {
    localStorage.setItem("bibleChapter", selectedChapter)
  }, [selectedChapter])

  /// SELECT/SET VERSE(S)
  const [verseStart, setVerseStart] = useState('')
  const [verseEnd, setVerseEnd] = useState('')

  const [verseContent, setVerseContent] = useState(null)

  /// SELECT/SET BIBLE VERSION
  const [bibleVersion, setBibleVersion] = useState(() => {
    const valid_versions = ["NIV", "ESV", "NLT", "NASB", "KJV"]
    //Available versions: NIV, ESV, NLT, NASB
    const getBibleVersion = sessionStorage.getItem('bibleVersion') || 'NIV'
    return valid_versions.includes(getBibleVersion) ? getBibleVersion : 'NIV'
  })
  useEffect(() => {
    sessionStorage.getItem('bibleVersion', bibleVersion);
  }, [bibleVersion]);

  // useEffect(() => {
  //   const passage_chapter = fetch(`https://bolls.life/get-text/${bibleVersion}/${selectedBook}/${selectedChapter}/`)
  // }, [])

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
