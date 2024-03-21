// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, { ChangeEvent, ChangeEventHandler, MouseEvent, Suspense, useEffect, useRef, useState } from 'react';
import { Bible } from "./data";
import './App.css';
import { decodeJapaneseFurigana, getAudioData, getHiragana, getJapaneseFurigana } from "@/app/utils/service";
import BookSelect from './book';
import { BibleIndex } from '../api/bible/[book]/[chapter]/route';
import { japanese } from './util';
import Loading from './loading';

// const url = `${process.env.REACT_APP_TTSHUB_SERVER}`;
const autoPlay = true
const AudioCache: { [key: string]: string } = {}
const PlayingAudio: HTMLAudioElement[] = []

// const useStyles = makeStyles({
//     select: {
//         color: '#999999', // 设置字体颜色
//         '&:before': {
//             borderColor: 'red', // 设置边框颜色
//         },
//         '&:after': {
//             borderColor: 'green', // 设置选中状态下的边框颜色
//         },

//     },
//     inputLabel: {
//         color: 'orange', // 设置InputLabel的颜色
//     },
// });

function Page() {
  const [audioUrl, setAudioUrl] = useState('')
  // const [currentSpeaker, setCurrentSpeaker] = useState(SPEAKERS[0].id)
  const [words, setWords] = useState<Bible[]>([])
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ttsEngine, setTtsEngine] = useState("lain_style_bert_vits2")
  const [useAudioCache, setUseAudioCache] = useState(true)
  const [selectedBible, setSelectedBible] = useState<BibleIndex>();

  const handleTtsEngine = (event: ChangeEvent<HTMLSelectElement>) => {
    setTtsEngine(event.target.value);
  };

  const handleUseAudioCache = () => {
    setUseAudioCache(!useAudioCache)
    console.log("useAudioCache", !useAudioCache)
  }

  const playAudio = async (text: string) => {
    const key = `${text}||||${ttsEngine}`
    let dataUrl = ""

    if (!useAudioCache || !(key in AudioCache)) {
      const res = await getAudioData(text, ttsEngine)
      // console.log(res)
      if (res?.audioUrl) {
        // const arrayBuffer = res.audioData
        // console.log(res.audioData)
        // dataUrl = `data:audio/wav;base64,${arrayBufferToBase64(arrayBuffer)}`
        AudioCache[key] = res.audioUrl
      }
    }
    // dataUrl = res.audioUrl
    // if (useAudioCache) {
    console.log("audio cache key", key)
    dataUrl = AudioCache[key]
    // } else {
    //   let res = await getAudioData(text)
    //   if (res?.audioUrl) {
    //     dataUrl = res.audioUrl
    //     AudioCache[key] = res.audioUrl
    //   }
    // }
    if (dataUrl) {
      if (dataUrl === audioUrl) {
        console.log("dataUrl === audioUrl")
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play()
        }
      } else {
        // setAudioUrl("")
        console.log(dataUrl)
        stopAllAudio()
        setAudioUrl(dataUrl)
        // console.log(dataUrl)
        //             const audio = new Audio(dataUrl);
        //             PlayingAudio.push(audio)
        //             audio.playbackRate = 1
        // console.log(audioRef.current)
        // if (audioRef.current) {
        //     audioRef.current.currentTime = 0
        // audioRef.current.on
        // }
      }
      // await audio.play();
    }
  }
  const stopAllAudio = () => {
    PlayingAudio.forEach(audio => audio.pause())
    PlayingAudio.length = 0
    setAudioUrl("")
  }

  useEffect(() => {
    async function fetchData() {
      // /** @type {import("../../pages/api/bible.ts")} */
      /** @type {import("@/app/api/bible/route.ts")} */
      const response = await fetch(`/api/bible/${selectedBible?.book}/${selectedBible?.chapter}`,
        {
          // cache: "no-store",
          cache: "force-cache",
          // next: {
          //   revalidate: 10,
          // },
        }
      );
      const result: Bible[] = await response.json();
      // let result = await handler();
      // console.log(result);
      setWords(result)
      // const {rows} = await sql`SELECT * FROM bible`;
    }

    fetchData();
  }, [selectedBible]);

  // let [ttsEngine, setTtsEngine] = useState("edge-tts")
  //
  // // function handleTtsEngine(event: SelectChangeEvent) {
  // //     setTtsEngine(event.target.value as string);
  // // }
  //
  // const classes = useStyles();
  // const options = [
  //     { value: 'chocolate', label: 'Chocolate' },
  //     { value: 'strawberry', label: 'Strawberry' },
  //     { value: 'vanilla', label: 'Vanilla' }
  // ]
  // const [selectedValue, setSelectedValue] = useState('');

  return (
    <div className="App">
      <div className={"bible-header"}>
        <h1>信仰によって生きてください。</h1>
        <BookSelect handleSelectChange={setSelectedBible} />
      </div>

      <div className={"bible-body"}>
        <table className={"bible-table"}>
          <Suspense fallback={<Loading />}>
            <tbody>
              {words.map((word, index) => {
                let hiragana = getHiragana(word)
                const onClickAudio = () => playAudio(hiragana)
                return (<>
                  <tr key={index}>
                    <td style={{
                      display: "block",
                      width: "30px",
                      marginRight: "5px",
                      // paddingRight: "-210px",
                    }}>
                      <button
                        style={{
                          userSelect: "none"
                        }}
                        onClick={onClickAudio}>言
                      </button>
                      <span style={{
                        // display: "block",
                        // marginTop: "20px",
                        // verticalAlign: "text-top",
                        userSelect: "none"
                      }}>
                        {word.verse}:
                      </span>
                    </td>
                    <td className={"bible-text"}
                      onClick={onClickAudio}>
                      <div>
                        <WordElement {...{ word }} />
                      </div>
                    </td>
                    {/*<td>*/}
                    {/*  */}
                    {/*</td>*/}
                  </tr>
                  {/*<hr/>*/}
                </>)
              })}
            </tbody>
          </Suspense>
        </table>
        {/*<br/>*/}
        {/*<div style={{*/}
        {/*  height: "100px",*/}
        {/*  display: "block",*/}
        {/*}}>sssss*/}
        {/*</div>*/}
      </div>
      {/*</td></tr>*/}
      {/*<tr><td>*/}
      <div className={"bible-toolbar"}>
        <audio ref={audioRef}
          src={audioUrl} controls autoPlay={autoPlay} onCanPlay={(e) => {
            e.currentTarget.playbackRate = 1
            e.currentTarget.play()
          }}></audio>
        <button onClick={() => {
          stopAllAudio()
        }}>全部停止
        </button>

        <select value={ttsEngine}
          onChange={handleTtsEngine}
        // defaultValue={"lain_style_bert_vits2"}
        >
          <option value="lain_style_bert_vits2">Lain</option>
          <option value="gtts">Google</option>
          <option value="edge-tts">Edge</option>
          <option value="openai-tts">OpenAI</option>
        </select>

        <input
          type={"checkbox"}
          checked={useAudioCache}
          onChange={handleUseAudioCache} />开启缓存
      </div>
      {/*</td></tr>*/}
      {/*</tbody>*/}
      {/*</table>*/}

    </div>
  );
}

export default Page;

function WordElement(prop: { word: Bible }) {
  const { word } = prop
  const [rubyHtml, setRubyHtml] = useState<JSX.Element>(<> </>)
  useEffect(() => {
    (async () => {
      if (word.furigana) {
        let ruby = await japanese(word.furigana)
        if (ruby) {
          setRubyHtml(ruby)
        }
      }
    })()
  }, [word.text])

  return (<>
    {rubyHtml}
  </>)
}
