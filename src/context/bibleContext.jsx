import { useEffect, useState, useContext, createContext } from "react";
import bibleData from '../assets/bibleMetadata.json'
import { useTestMode } from "./testModeContext";
import { isTitle } from "../Utils/bibleUtils";

export const BibleContext = createContext();

export const BibleProvider = ({ children }) => {
  const { mode } = useTestMode();

  /// SELECT/SET BOOK
  const [selectedBook, setSelectedBook] = useState(() => {
    const randomBookIndex = Math.floor(Math.random()*66) + 1
    return sessionStorage.getItem("bibleBook") || randomBookIndex.toString()
  })
  useEffect(() => {
    sessionStorage.setItem("bibleBook", selectedBook)
  }, [selectedBook])

  /// SELECT/SET/FILTER CHAPTER
  const [isReset, setIsReset] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(() => {
    const savedChapter = Number(sessionStorage.getItem("bibleChapter")) ? Number(sessionStorage.getItem("bibleChapter")) : 0
    const numberOfChapters = bibleData[selectedBook] && bibleData[selectedBook]?.chapters?.length
    return savedChapter && !isNaN(savedChapter) && savedChapter > 0 && savedChapter <= numberOfChapters
      ? savedChapter
      : Math.floor(Math.random()*numberOfChapters) + 1
  })

  useEffect(() => {
    if (!isReset) {
      sessionStorage.setItem("bibleChapter", selectedChapter)
    }
  }, [selectedChapter, isReset])

  const resetStorage = () => {
    setIsReset(true);
    sessionStorage.clear();
    const newBook = Math.floor(Math.random()*66) + 1;
    setSelectedBook(newBook.toString());

    setTimeout(() => {
      const numOfChapters = bibleData[newBook].chapters.length
      const newChapter = Math.floor(Math.random() * numOfChapters) + 1
      setSelectedChapter(newChapter)
      setIsReset(false)
    }, 0);
  };

  /// SELECT/SET/FILTER VERSE(S)
  const [verseSelection, setVerseSelection] = useState([])

  /// SELECT/SET/FILTER BIBLE VERSION
  const [bibleVersion, setBibleVersion] = useState(() => {
    const valid_versions = ["NIV", "ESV", "NLT", "NASB", "KJV"]
    const getBibleVersion = sessionStorage.getItem('bibleVersion') || 'NIV'
    return valid_versions.includes(getBibleVersion) ? getBibleVersion : 'NIV'
  })
  useEffect(() => {
    sessionStorage.setItem('bibleVersion', bibleVersion);
  }, [bibleVersion]);

  //edge case: reset chapter when selecting a new book
  useEffect(() => {
    if (!bibleData[selectedBook]) return;
    const numberOfChapters = bibleData[selectedBook].chapters.length
    const currChapter = Number(sessionStorage.getItem("bibleChapter"))

    if (!currChapter || currChapter < 1 || currChapter > numberOfChapters) {
      setSelectedChapter(Math.floor(Math.random() * numberOfChapters) + 1);
    }
    setVerseContent([])
    setVerseSelection([])
  }, [selectedBook])

   //FETCHING THE RAW BIBLE JSON DATA
  const [rawVerseContent, setRawVerseContent] = useState([])

  useEffect(() => {
    const fetchPassage = async () => {
      try {
        const response = await fetch(`https://bolls.life/get-text/${bibleVersion}/${selectedBook}/${selectedChapter}/`)
        const data = await response.json();
        // console.log("raw bible json fetched", data)
        setRawVerseContent(data)
      } catch (error) {
        console.error("Failed to fetch passage: ", error)
        setRawVerseContent([])
      }
    }
    if (mode === "passage" && bibleData[selectedBook] && selectedChapter > 0) {
      fetchPassage()
    }
  }, [mode, selectedChapter, bibleVersion, selectedBook])

  const [verseContent, setVerseContent] = useState([])

  useEffect(() => {
    if (!rawVerseContent) return;

    const filtered = verseSelection.length
      ? rawVerseContent.filter(text => {
        return verseSelection[0] <= text.verse &&
        (verseSelection.length === 1 || text.verse <= verseSelection[1]);
        })
      : rawVerseContent

      // console.log("bibledata JSON filtered", filtered)

    const cleanedVerses = filtered?.flatMap(verse => {
      const html = verse.text || "";
      const parts = html.split(/<br\s*\/?>/i);

      let contentParts
      let maybeTitle, rest
      // included for edge cases where maybeTitle was targeting sections without <br> tags and
      // treating them like titles.
      if (parts.length > 1) {
        [maybeTitle, ...rest] = parts;
        contentParts = isTitle(maybeTitle) ? rest : [maybeTitle, ...rest];
      } else {
        contentParts = parts
      }

      if (bibleVersion === "KJV") {
        return contentParts.map(part =>
          part
            .replace(/<S>[^>]*<\/S>/g, "")
            .replace(/<sup>[^>]*<\/sup>/g, "")
        )
      }

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
