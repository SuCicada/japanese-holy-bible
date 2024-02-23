// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, {ChangeEvent, ChangeEventHandler, MouseEvent, useEffect, useRef, useState} from 'react';
import {Bible} from "./data";
import './App.css';
import {decodeJapaneseFurigana, getAudioData, getHiragana, getJapaneseFurigana} from "@/app/utils/service";

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

  const handleTtsEngine = (event: ChangeEvent<HTMLSelectElement>) => {
    setTtsEngine(event.target.value);
  };

  const handleUseAudioCache = () => {
    setUseAudioCache(!useAudioCache)
    console.log("useAudioCache", !useAudioCache)
  }

  const playAudio = async (text: string, speaker: string = "lain") => {
    const key = `${text}||||${speaker}`
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
      /** @type {import("../api/route")} */
      const response = await fetch('/api/bible');
      const result: Bible[] = await response.json();
      // let result = await handler();
      // console.log(result);
      setWords(result)
      // const {rows} = await sql`SELECT * FROM bible`;
    }

    fetchData();
  }, []);

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

  return (
    <div className="App">
      <div className={"bible-header"}>
        <h1>生きてください。</h1>
      </div>
      <div className={"bible-body"}>
        <table className={"bible-table"}>
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
                  <button onClick={onClickAudio}>言</button>
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
                  <WordElement {...{word}}/>
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
          onChange={handleUseAudioCache}/>开启缓存

      </div>
      {/*</td></tr>*/}
      {/*</tbody>*/}
      {/*</table>*/}

    </div>
  );
}

export default Page;

function WordElement(prop: { word: Bible }) {
  const {word} = prop
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


function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  uint8Array.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
}


async function japanese(str: string) {
  str = str.trim();
  if (str.length === 0) {
    // setOutput("");
    return;
  }
  try {
    // const data = await getJapaneseFurigana(str)
    const data = decodeJapaneseFurigana(str)
    // console.log(data);
    let rubyHtmlArr: JSX.Element[] = [];
    let furiStr = "";
    let kanjiFuStr = "";
    data.forEach((item: any) => {
      const [character, type, hiragana, katakana] = item;
      let ruby: JSX.Element;
      switch (type) {
        case 1:
          ruby = (
            <>
              <ruby>
                {character}
                <rp>(</rp>
                <rt>{hiragana}</rt>
                <rp>)</rp>
              </ruby>
            </>
          );

          furiStr += hiragana;
          kanjiFuStr += `${character}(${hiragana})`;
          break;

        case 2:
        default:
          switch (character) {
            case " ":
              ruby = <>&nbsp;</>;
              break;
            case "\n":
              ruby = <br/>;
              break;
            default:
              ruby = <>{character}</>;
          }
          furiStr += character;
          kanjiFuStr += character;
      }
      rubyHtmlArr.push(ruby);
    });

    let rubyHtml1 = <span className={"morpheme"}>{
      rubyHtmlArr.map((item, i) => <span key={i}>{item}</span>)
    }</span>;
    return rubyHtml1;
    // setRubyHtml(rubyHtml1);
    // setFurigana(furiStr);
    // setKanjiFurigana(kanjiFuStr);
    // setAudioUrl("");

    // setOutput(data);
  } catch (error) {
    console.error(error);
  }
}
