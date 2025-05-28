import { useEffect, useState, useContext, createContext } from "react";
import bibleData from '../assets/bibleMetadata.json'
import { useTestMode } from "./testModeContext";

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
  const { mode } = useTestMode();
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
    } else {
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

  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const response = await fetch(`https://bolls.life/get-text/${bibleVersion}/${selectedBook}/${selectedChapter}/`)
        // console.log("response", response)
        const data = await response.json();
        console.log("data", data)
        const cleanedVerses = data.map(verse => {
          const html = verse.text;
          const parts = html.split(/<br\s*\/?>/i);
          return parts[1] ? parts[1].trim() : "";
        })

        const fullText = cleanedVerses.join(" ")

        /// regex to split on whitespace including tabs and newlines
        setVerseContent(fullText.split(/[\s—]+/))

      } catch (error) {
        console.error("Failed to fetch passage: ", error)
        setVerseContent(["Please", "select", 'a', 'passage'])
      }
    }
    fetchPassage()
  }, [mode, selectedChapter])



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
