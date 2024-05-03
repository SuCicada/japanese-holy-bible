// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import {Bible} from "../../data";
import '@/app/bible/App.css';
import {getAudioData} from "@/app/utils/service";
import BookSelect from '../../book';
import {BibleIndex} from '../../../api/bible/[book]/[chapter]/route';
import {useRouter} from "next/navigation";
// import { useRouter } from 'next/router'
import {getHash} from '../../../utils/web';
import BibleTable from '../../bible';
import Link from 'next/link';

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
export default function BiblePage(
  {params}: { params: { book: string, chapter: string } }
) {
  const {book, chapter} = params
  const [audioUrl, setAudioUrl] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ttsEngine, setTtsEngine] = useState("lain_style_bert_vits2")
  const [useAudioCache, setUseAudioCache] = useState(true)

  const handleTtsEngine = (event: ChangeEvent<HTMLSelectElement>) => {
    setTtsEngine(event.target.value);
  };

  const handleUseAudioCache = () => {
    setUseAudioCache(!useAudioCache)
    console.log("useAudioCache", !useAudioCache)
  }

  const playAudio = async (text: string) => {
    const key = `${text}||||${ttsEngine}`
    console.log("playAudio", key)
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
    console.log("BiblePage useEffect", book, chapter)
    //   const handleHashChange = () => {
    //     setHash(getHash());
    //   };
    //   window.addEventListener("hashchange", handleHashChange);
    //   return () => {
    //     window.removeEventListener("hashchange", handleHashChange);
    //   };
  }, []);

  // useEffect(() => {
  //   let paramsObject = Object.fromEntries(new URLSearchParams(hash));
  //   // paramsObject
  //   // let paramsString = new URLSearchParams(paramsObject).toString();
  //   paramsObject
  // }, [hash]);


  // useEffect(() => {
  //   async function fetchData() {
  //     // /** @type {import("../../pages/api/bible.ts")} */
  //     /** @type {import("@/app/api/bible/route.ts")} */
  //     const response = await fetch(`/api/bible/${selectedBible?.book}/${selectedBible?.chapter}`,
  //       {
  //         // cache: "no-store",
  //         cache: "force-cache",
  //         // next: {
  //         //   revalidate: 10,
  //         // },
  //       }
  //     );
  //     const result: Bible[] = await response.json();
  //     // let result = await handler();
  //     // console.log(result);
  //     setWords(result)
  //     // const {rows} = await sql`SELECT * FROM bible`;
  //   }

  //   fetchData();
  // }, [selectedBible]);

  const router = useRouter()

  function handleBookSelectChange(value: BibleIndex) {
    console.log("handleBookSelectChange", value)
    router.push(`/bible/${value.book}/${value.chapter}`)
  }

  return (
    <div>
      {/* <div className={"bible-header"}>
        <h1>信仰によって生きてください。</h1>
        <BookSelect handleSelectChange={handleBookSelectChange}
          index={{ book, chapter: parseInt(chapter) }}
        />
      </div> */}
      {/* <Link href="/bible/john/3">ssdf</Link> */}
      {/* <Link href="/bible/john/32">ssdf</Link> */}

      <BibleTable {...{book, chapter, playAudio}} />
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
          onChange={handleUseAudioCache}/>开启缓存
      </div>
      {/*</td></tr>*/}
      {/*</tbody>*/}
      {/*</table>*/}

    </div>
  );
}
