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
  const [currentText, setCurrentText] = useState("")
  const playAudio = async (text: string) => {
    setCurrentText(text)
  }

  return (
    <div>
      <BibleTable {...{book, chapter, playAudio}} />

      <Toolbar params={{text: currentText}}/>
    </div>
  );
}
