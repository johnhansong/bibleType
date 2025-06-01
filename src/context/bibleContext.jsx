import { useEffect, useState, useContext, createContext } from "react";
import bibleData from '../assets/bibleMetadata.json'
import { useTestMode } from "./testModeContext";
import { isTitle } from "../Utils/bibleUtils";

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
    return sessionStorage.getItem("bibleBook") || randomBookIndex
  })
  useEffect(() => {
    sessionStorage.setItem("bibleBook", selectedBook)
  }, [selectedBook])

  /// SELECT/SET/FILTER CHAPTER
  const [selectedChapter, setSelectedChapter] = useState(() => {
    const savedChapter = Number(sessionStorage.getItem("bibleChapter"))
    const numberofChapters = bibleData[selectedBook]?.chapters?.length || 1
    return savedChapter && savedChapter <= numberofChapters
      ? savedChapter
      : 1
  })
  useEffect(() => {
    sessionStorage.setItem("bibleChapter", selectedChapter)
  }, [selectedBook, selectedChapter])

  /// SELECT/SET/FILTER VERSE(S)
  const [verseSelection, setVerseSelection] = useState([])

  /// SELECT/SET/FILTER BIBLE VERSION
  const [bibleVersion, setBibleVersion] = useState(() => {
    const valid_versions = ["NIV", "ESV", "NLT", "NASB", "KJV"]
    //Available versions: NIV, ESV, NLT, NASB, KJV
    const getBibleVersion = sessionStorage.getItem('bibleVersion') || 'NIV'
    return valid_versions.includes(getBibleVersion) ? getBibleVersion : 'NIV'
  })
  useEffect(() => {
    sessionStorage.setItem('bibleVersion', bibleVersion);
  }, [bibleVersion]);

   //FETCHING THE RAW BIBLE JSON DATA
  const [rawVerseContent, setRawVerseContent] = useState([])

  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const response = await fetch(`https://bolls.life/get-text/${bibleVersion}/${selectedBook}/${selectedChapter}/`)
        const data = await response.json();
        setRawVerseContent(data)
      } catch (error) {
        console.error("Failed to fetch passage: ", error)
        setVerseContent(["Please", "select", 'a', 'passage'])
      }
    }
    fetchPassage()
  }, [selectedChapter, bibleVersion, selectedBook])

  const [verseContent, setVerseContent] = useState([])
  useEffect(() => {
    if (!rawVerseContent) return;

    const filtered = verseSelection.length
      ? rawVerseContent.filter(text => {
        return verseSelection[0] <= text.verse &&
        (verseSelection.length === 1 || text.verse <= verseSelection[1]);
        })
      : rawVerseContent

    const cleanedVerses = filtered?.flatMap(verse => {
      const html = verse.text || "";
      const parts = html.split(/<br\s*\/?>/i);
      const [maybeTitle, ...rest] = parts;
      const contentParts = isTitle(maybeTitle) ? rest : [maybeTitle, ...rest];

      return contentParts.map(part =>
        part
        .replace(/<[^>]+>/g, '')
        .replace(/’/g, "'")
        .trim()
      )
    })

    const fullText = cleanedVerses.join(" ")
    setVerseContent(fullText.split(/[\s—]+/))
  }, [verseSelection, rawVerseContent])

    //edge case: reset chapter to 1 when selecting a new book
    useEffect(() => {
      if (!bibleData[selectedBook]) return;
      setSelectedChapter(1);
      setVerseContent([])
    }, [selectedBook])

    //edge case: clear verseSelection when a new book or new chapter is selected
    useEffect(() => {
      if (!bibleData[selectedBook]) return;
      setVerseSelection([])
    }, [selectedBook, selectedChapter])

  return (
    <BibleContext.Provider value={{
      selectedBook, setSelectedBook,
      selectedChapter, setSelectedChapter,
      verseSelection, setVerseSelection,
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
