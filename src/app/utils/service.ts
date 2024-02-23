import {Bible} from "@/app/bible/data";

export async function getJapaneseFurigana(str: string) {
    const data = await fetch(process.env.NEXT_PUBLIC_JAPANESE_FURIGANA_API as string,
        {
            method: "POST",
            // url: 'http://localhost:41401/convert',
            headers: {"content-type": "application/json"},
            body: JSON.stringify({text: str}),
        })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
            throw error
        })
    return data
}

/*
    どんなことでも、{{思|おも}}い
*/
export function decodeJapaneseFurigana(text: string) {
    const pattern = /{{(.*?)}}/g;
    let lastIndex = 0
    let res: any[] = []

    function pushHira(hira: string) {
        hira.split("").forEach((item) => {
            res.push([item, 2, item])
        })
    }

    text.replace(pattern, function (match, p1, offset) {
        let hira = text.slice(lastIndex, offset)
        pushHira(hira)
        let [kanji, hira2] = p1.split("|")
        res.push([kanji, 1, hira2])
        lastIndex = offset + match.length
        return ""
    });
    pushHira(text.slice(lastIndex))
    return res
}

export function getHiragana(bible:Bible){
    return decodeJapaneseFurigana(bible.furigana??"").map(item=>item[2]).join("")
}

export const getAudioData = async (text: string,ttsEngine:string) => {
  return await fetch(process.env.NEXT_PUBLIC_TTSHUB_SERVER as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // "Access-Control-Allow-Origin": "*"
    },
    mode: 'cors',
    body: JSON.stringify({
      // tts_engine: "gtts",
      voice: "fable",
      tts_engine: ttsEngine,
      text: text,
      // speaker: speaker,
      language: "ja",
      speed: 1,
    })
  })
    .then(async response => {
      // const audioData = await response.arrayBuffer()
      const data = await response.json()
      // const jsonData = await response.headers.get('Response-Data')
      // const json = jsonData ? JSON.parse(jsonData) : {}
      // console.log(data)
      let sampling_rate = data["sampling_rate"];
      let audioBase64 = data["audio"];
      // let arrayBuffer = Buffer.from(audioBase64, "base64");

      let binaryString = window.atob(audioBase64);
      let len = binaryString.length;
      let arrayBuffer = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        arrayBuffer[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([arrayBuffer], {type: "audio/wav"});
      const audioUrl = URL.createObjectURL(blob);
      return {sampling_rate, audioData: arrayBuffer, audioUrl}
    })
    .catch(error => {
      console.error(error);
    });
}
