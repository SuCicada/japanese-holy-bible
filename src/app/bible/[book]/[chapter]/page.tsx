"use client"
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import '@/app/bible/App.css';
import {getAudioData} from "@/app/utils/service";
import BibleTable from '../../bible';
import Toolbar from "@/app/bible/toolbar";


export default function BiblePage(
  {params}: { params: { book: string, chapter: string } }
) {
  const {book, chapter} = params
  const [text, setText] = useState("")
  const [clickSignal, setClickSignal] = useState(1)
  const playAudio = async (text: string) => {
    setText(text)
    setClickSignal(-clickSignal)
  }

  return (
    <div>
      <BibleTable {...{book, chapter, playAudio}} />

      <Toolbar {...{text, clickSignal}} />
    </div>
  );
}
