// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, {useEffect, useState} from 'react';
// import './App.css';

import {TEXT_DATA, Word,} from "./data";
import {Bible} from "@/app/bible/data";
// import BookSelect from "@/app/book/page";
import BookSelect from "@/app/bible/book";
import TwoColumnSelect from './select';
import { BibleIndex } from '../api/bible/[book]/[chapter]/route';

// const url = `${process.env.REACT_APP_TTSHUB_SERVER}`;
const autoPlay = true
const AudioCache: { [key: string]: string } = {}
const PlayingAudio: HTMLAudioElement[] = []

function Page() {
  const [words, setWords] = useState<any[]>([])
  const [selectedValue, setSelectedValue] = useState<BibleIndex>();
  const handleSelectChange = (value: BibleIndex) => {
    console.log(value)
    setSelectedValue(value);
  };
  useEffect(() => {
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
      const result  = await response.json();
      // let result = await handler();
      // console.log(result);
      setWords(result)
      // const {rows} = await sql`SELECT * FROM bible`;
    }

    fetchData();
  }, []);
    return (
      
      <div className="App">
        {selectedValue?.book}
        {selectedValue?.chapter}
          {/* <TwoColumnSelect/> */}
          <BookSelect  handleSelectChange={handleSelectChange} />
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
