import React, {ChangeEvent, useEffect, useRef, useState} from "react";
import {getAudioData} from "@/app/utils/service";
import {useMyStore} from "@/app/bible/myStore";
// import {useToolbar} from "@/app/bible/[book]/[chapter]/page";

const autoPlay = true
const AudioCache: { [key: string]: string } = {}
const PlayingAudio: HTMLAudioElement[] = []

export default function Toolbar(
  // {text,clickSignal}: { text: string ,clickSignal: number}

  {text,
  // getAudioTest
  }: {text:string,
   // getAudioTest: () => string
   }
) {
  const [audioUrl, setAudioUrl] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ttsEngine, setTtsEngine] = useState("lain_style_bert_vits2")
  const [useAudioCache, setUseAudioCache] = useState(true)

  const handleTtsEngine = (event: ChangeEvent<HTMLSelectElement>) => {
    setTtsEngine(event.target.value);
  };
  // let {text} = useToolbar()
  // const currentText = getAudioTest()

  // const text = getAudioTest();
  const {text2,clickSignal} = useMyStore();

  const currentText = text2;

  const handleUseAudioCache = () => {
    setUseAudioCache(!useAudioCache)
    console.log("useAudioCache", !useAudioCache)
  }

  const stopAllAudio = () => {
    PlayingAudio.forEach(audio => audio.pause())
    PlayingAudio.length = 0
    setAudioUrl("")
  }


  useEffect(() => {
    if (!currentText) return
    (async () => {
      const key = `${currentText}||||${ttsEngine}`
      console.log("playAudio", key)
      let dataUrl = ""
      if (!useAudioCache || !(key in AudioCache)) {
        const res = await getAudioData(currentText, ttsEngine)
        // let res ={audioUrl:key}
        if (res?.audioUrl) {
          AudioCache[key] = res.audioUrl
        }
      }
      console.log("audio cache key", key)
      dataUrl = AudioCache[key]

      if (dataUrl) {
        if (dataUrl === audioUrl) {
          console.log("dataUrl === audioUrl")
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
          }
        } else {
          console.log(dataUrl)
          stopAllAudio()
          setAudioUrl(dataUrl)
          // setText("")
          // setTemp(dataUrl)
        }
      }
    })()
  }, [currentText,clickSignal])


  // const router = useRouter()
  // function handleBookSelectChange(value: BibleIndex) {
  //   console.log("handleBookSelectChange", value)
  //   router.push(`/bible/${value.book}/${value.chapter}`)
  // }

  return (
    <div className={"bible-toolbar"}>
      {/*<div>{currentText}</div>*/}
      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        autoPlay={autoPlay}
        onCanPlay={(e) => {
          e.currentTarget.playbackRate = 1
          e.currentTarget.play()
        }}
      ></audio>
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
  )
}
