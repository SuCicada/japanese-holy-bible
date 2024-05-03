// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, { useEffect, useState } from 'react';
// import './App.css';

import { TEXT_DATA, Word, } from "./data";
import { Bible } from "@/app/bible/data";
// import BookSelect from "@/app/book/page";
import BookSelect from "@/app/bible/book";
import TwoColumnSelect from './select';
import { BibleIndex } from '../api/bible/[book]/[chapter]/route';
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from 'next/router';

// const url = `${process.env.REACT_APP_TTSHUB_SERVER}`;
const autoPlay = true
const AudioCache: { [key: string]: string } = {}
const PlayingAudio: HTMLAudioElement[] = []
const getHash = () =>
  typeof window !== "undefined"
    ? decodeURIComponent(window.location.hash.replace("#", ""))
    : undefined;
function Page() {
  const [hash, setHash] = useState(getHash());
  const [words, setWords] = useState<any[]>([])
  const [selectedValue, setSelectedValue] = useState<BibleIndex>();
  const handleSelectChange = (value: BibleIndex) => {
    console.log(value)
    setSelectedValue(value);
  };
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  useEffect(() => {
    const handleHashChange = () => {
      setHash(getHash());
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  useEffect(() => {
  console.log(hash)
  }, [hash]);

  useEffect(() => {
    // const router = useRouter()
    async function fetchData() {
      // /** @type {import("../../pages/api/bible.ts")} */
      /** @type {import("@/app/api/bible/route.ts")} */
      const response = await fetch('/api/test',
        {
          // headers: {
          //   "Cache-Control": "no-store",
          // },
          // cache: "no-store",
          // cache: "force-cache",
          next: {
            revalidate: 10,
          },
        }
      );
      const result = await response.json();
      // let result = await handler();
      // console.log(result);
      setWords(result)
      // const {rows} = await sql`SELECT * FROM bible`;
    }

    fetchData();
    // console.log(router)
    // console.log(router.asPath)
    console.log(hash)
    console.log(pathname)
    // console.log(searchParams)
  }, []);

  const params = useParams();

  // useEffect(() => {
    // console.log(window.location.hash);
  // }, [window.location.hash]);
  return (

    <div className="App">
      {selectedValue?.book}
      {selectedValue?.chapter}
      {/* <TwoColumnSelect/> */}
      {/*<BookSelect handleSelectChange={handleSelectChange} />*/}
      {/* ---- */}
      {words.map((word, index) => {
        return (
          <div key={index}>
            {word.name}
          </div>
        )
      })}
    </div>
  );
}

export default Page;
