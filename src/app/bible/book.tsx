import {sql} from "@/app/utils/db";
import * as Prisma from "@prisma/client";
import {prisma} from "@/app/utils/db";
import {ChangeEventHandler, useEffect, useState} from "react";
import {BibleBooks, BibleBookChapters, BookChapters} from "../api/book/route";
import {BibleIndex} from "../api/bible/[book]/[chapter]/route";
import {router} from "next/client";
// import Link from 'next/link';
import { useRouter } from 'next/navigation'

export default function BookSelect(
  {
    index,
    // handleSelectChange
  }: {
    // selectedValue: string;
    index: BibleIndex | undefined;
    // handleSelectChange: (value: BibleIndex) => void;
  }
) {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  // const [bibleIndex, setBibleIndex] = useState<string>()
  // const [characters, setCharacters] = useState<number[]>([]) // 章s
  const [bookChapters, setBookChapters] = useState<BookChapters>({})
  const [books, setBooks] = useState<BibleBooks>() // 书名s

  const [oldOption, setOldOption] = useState<string>()
  const [newOption, setNewOption] = useState<string>()
  const router = useRouter()

  console.log("BookSelect", decodeURI(index?.book ?? ""), index?.chapter)
  useEffect(() => {
    console.log("BookSelect useEffect", books)
    if (!books) {
      (async function () {
        // "use server"
        /** @type {import("@/app/api/book/route.ts")} */
        const response = await fetch('/api/book',
          {
            // cache: "no-store",
            cache: "force-cache",
            // next: {
            //   revalidate: 10,
            // },
          }
        );
        const bibleBookChapters = await response.json() as BibleBookChapters;
        setBooks(bibleBookChapters.books)
        setBookChapters(bibleBookChapters.book_chapters)
      })();
    }
  }, []);
  useEffect(() => {
    console.log("BookSelect useEffect", books, index)
    if (books && index) {
      let nB = books.newBooks.find(book => index.book === book.long_name)
      if (nB && nB.long_name) {
        console.log("setNewOption", nB)
        setNewOption(nB.long_name)
      }

      let oB = books.oldBooks.find(book => index.book === book.long_name)
      console.log("setOldOption", oB)
      if (oB && oB.long_name) {
        setOldOption(oB.long_name)
      }
      setSelectedBook(index.book)
      setSelectedChapter(index.chapter)
    }
  }, [books, index]);

  // useEffect(() => {
  //   console.log("BookSelect useEffect", index, characters)
  //   if (index && characters.length > 0) {
  //     setSelectedChapter(index.chapter)
  //   }
  // }, [index?.chapter, characters])

  // function handleBookSelectChange(value: BibleIndex) {
  //   console.log("handleBookSelectChange", value)
  //   router.push(`/bible/${value.book}/${value.chapter}`)
  // }

  // useEffect(() => {
  //   if (!selectedBook) return
  //
  //   (async function () {
  //     const queryString = Object.entries({
  //       book: selectedBook,
  //     })
  //       .map(([key, value]) => `${key}=${value}`)
  //       .join('&');
  //
  //     /** @type {import("@/app/api/chapter/route.ts")} */
  //     const response: Response = await fetch('/api/chapter?' + queryString,
  //       {cache: "force-cache",});
  //     const _characters = await response.json() as number[];
  //     console.log(_characters)
  //     console.log(characters)
  //     setCharacters(_characters)
  //     if (characters.length > 0) { // 说明不是第一次进入初始化的时候
  //       // setSelectedChapter(_characters[0])
  //       // setHandleSelect(selectedBook, characters[0])
  //       changeBible(_characters[0])
  //     }
  //     // setBibleIndex(`${selectedBook} ${selectedChapter}`)
  //   })();
  // }, [selectedBook])

  function changeBible(book: string, chapter: number) {
    setSelectedChapter(chapter)
    setHandleSelect(book, chapter)
  }

  function setHandleSelect(book: string, chapter: number) {
    if (book && chapter) {
      router.push(`/bible/${book}/${chapter}`)
      // handleBookSelectChange({
      //   book: book,
      //   chapter: chapter
      // })
    }
  }

  async function selectBook(newSelectBok: string) {
    console.log("selectBook", newSelectBok)
    if (newSelectBok && newSelectBok !== selectedBook) {
      // const queryString = Object.entries({
      //   book: newSelectBok,
      // })
      //   .map(([key, value]) => `${key}=${value}`)
      //   .join('&');
      //
      // /** @type {import("@/app/api/chapter/route.ts")} */
      // const response: Response = await fetch('/api/chapter?' + queryString,
      //   {cache: "force-cache",});
      // const _characters = await response.json() as number[];
      // console.log(_characters)
      // console.log(characters)
      // setCharacters(_characters)
      // if (characters.length > 0) { // 说明不是第一次进入初始化的时候
      // setSelectedChapter(_characters[0])
      // setHandleSelect(selectedBook, characters[0])
      // changeBible(newSelectBok, _characters[0])
      // }
      // setBibleIndex(`${selectedBook} ${selectedChapter}`)
      // })();
    }
  }

  function BookOption({type}: { type: "old" | "new" }) {
    let isOld = type === "old"
    let name = isOld ? "旧" : "新"
    let value = isOld ? oldOption : newOption
    let optionBooks = isOld ? books?.oldBooks : books?.newBooks
    return <>
      {name}：
      <select value={value} onChange={async (e) => {
        let newSelectBook = e.target.value
        if (isOld) {
          setOldOption(newSelectBook)
          setNewOption("")
        } else {
          setNewOption(newSelectBook)
          setOldOption("")
        }
        console.log("BookOption", newSelectBook)
        // setSelectedBook(e.target.value)
        let chapter  = bookChapters[newSelectBook]?.[0] ?? 0
        if (chapter) {
          changeBible(newSelectBook, chapter)
        }
        // await selectBook(e.target.value)
        // handleSelectChangeEvent(e)
      }}>
        <option value="">---</option>
        {optionBooks?.map((book) => (
          <option key={book.id} value={book.long_name ?? ""}>
            {book.long_name}
          </option>
        ))}
      </select>
    </>
  }

  return (<>
    <div style={{display: "flex"}}>
      <div style={{flex: 1}}>
        <BookOption type={"old"}/>
      </div>
      <div style={{flex: 1}}>
        <BookOption type={"new"}/>
      </div>
      <div style={{flex: 1}}>
        章：
        <select value={selectedChapter} onChange={(e) => {
          let chapter = parseInt(e.target.value)
          // setSelectedChapter(chapter)
          // setHandleSelect(selectedBook, chapter)
          changeBible(selectedBook, chapter)
        }}>
          {bookChapters[selectedBook]?.map((chapter) => (
            <option key={chapter} value={chapter}>
              {/*<Link href={`/bible/${selectedBook}/${chapter}`}>{chapter}</Link>*/}
              {chapter}
            </option>
          ))}
        </select>
      </div>
    </div>
  </>)
}
