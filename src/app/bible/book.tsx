import { sql } from "@vercel/postgres";
import * as Prisma from "@prisma/client";
import { prisma } from "@/app/utils/db";
import { ChangeEventHandler, useEffect, useState } from "react";
import { BibleBooks } from "../api/book/route";
import { BibleIndex } from "../api/bible/[book]/[chapter]/route";

export default function BookSelect(
  { handleSelectChange }: {
    // selectedValue: string;
    handleSelectChange: (value: BibleIndex) => void;
  }
) {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  // const [bibleIndex, setBibleIndex] = useState<string>()
  const [characters, setCharacters] = useState<number[]>([]) // 章s
  const [books, setBooks] = useState<BibleBooks>() // 书名s
  useEffect(() => {
    (async function () {
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
      const books = await response.json() as BibleBooks;
      setBooks(books)
    })();
  }, []);
  useEffect(() => {
    (async function () {
      /** @type {import("@/app/api/book/route.ts")} */
      // const queryString = new URLSearchParams(
      const queryString = Object.entries({
        book: selectedBook,
      })
        .map(([key, value]) => `${(key)}=${(value)}`)
        .join('&');

      // ).toString();
      const response = await fetch('/api/chapater?' + queryString,
        { cache: "force-cache", });
      const characters = await response.json() as number[];
      console.log(characters)
      setCharacters(characters)
      setSelectedChapter(characters[0])
      // setBibleIndex(`${selectedBook} ${selectedChapter}`)
      setHandleSelect(selectedBook, characters[0])
    })();
  }, [selectedBook])

  function setHandleSelect(book:string,chapater:number) {
    if (book && chapater) {
      handleSelectChange({
        book: book,
        chapter: chapater
      })
    }
  }

  // function handleSelectChangeEvent(event: React.ChangeEvent<HTMLSelectElement>) {
  //   handleSelectChange(event.target.value)
  //   setSelectedValue(event.target.value)
  // }
  const [oldOption, setOldOption] = useState<string>()
  const [newOption, setNewOption] = useState<string>()
  // const {rows} = await sql`select * from books order by sort`;
  // let rows = await prisma.books.findMany() as Prisma.books[]
  return (<>
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        旧：
        <select value={oldOption} onChange={(e) => {
          setOldOption(e.target.value)
          setNewOption("")
          // handleSelectChangeEvent(e)
        }}>
          <option value="">---</option>
          {books?.oldBooks.map((book) => (
            <option key={book.id} value={book.long_name ?? ""}>
              {book.long_name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        新：
        <select value={newOption} onChange={(e) => {
          setNewOption(e.target.value)
          setOldOption("")
          setSelectedBook(e.target.value)
          // handleSelectChangeEvent(e)
        }}>
          <option value="">---</option>
          {books?.newBooks.map((book) => (
            <option key={book.id} value={book.long_name ?? ""}>
              {book.long_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select value={selectedChapter} onChange={(e) => {
          let chapater = parseInt(e.target.value)
          setSelectedChapter(chapater)
          setHandleSelect(selectedBook, chapater)
        }}>
          {characters?.map((character) => (
            <option key={character} value={character}>
              {character}
            </option>
          ))}
        </select>
      </div>
    </div>
  </>)
}
