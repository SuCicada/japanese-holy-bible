// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, {SelectChangeEvent} from '@mui/material/Select';
// import {makeStyles} from '@mui/styles';
// import Select from 'react-select'
"use client"
import React, {useEffect, useRef, useState} from 'react';
import {Bible} from "./data";
import './App.css';
import {decodeJapaneseFurigana, getHiragana, getJapaneseFurigana} from "@/app/utils/service";

// const url = `${process.env.REACT_APP_TTSHUB_SERVER}`;
const autoPlay = false
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

    const playAudio = async (text: string, speaker: string = "lain") => {
        const key = `${text}||||${speaker}`
        let dataUrl = ""
        if (!(key in AudioCache)) {
            const res = await getAudioData(text)
            // console.log(res)
            if (res?.audioUrl) {
                // const arrayBuffer = res.audioData
                // console.log(res.audioData)
                // dataUrl = `data:audio/wav;base64,${arrayBufferToBase64(arrayBuffer)}`
                AudioCache[key] = res.audioUrl
            }
        }
        dataUrl = AudioCache[key]
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
            const response = await fetch('/api');
            const result: Bible[] = await response.json();
            // let result = await handler();
            console.log(result);
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
                {/*<Select options={options} />*/}
                {/*<Select*/}
                {/*    // defaultValue={flavourOptions[2]}*/}
                {/*    options={options}*/}
                {/*    theme={(theme) => ({*/}
                {/*        ...theme,*/}
                {/*        borderRadius: 0,*/}
                {/*        colors: {*/}
                {/*            ...theme.colors,*/}
                {/*            primary25: 'hotpink',*/}
                {/*            primary: 'black',*/}
                {/*        },*/}
                {/*    })}*/}
                {/*/>*/}

                <audio ref={audioRef}
                       src={audioUrl} controls autoPlay={autoPlay} onCanPlay={(e) => {
                    e.currentTarget.playbackRate = 1
                    e.currentTarget.play()
                }}></audio>
                <button onClick={() => {
                    stopAllAudio()
                }}>全部停止
                </button>
            </div>
            <table className={"bible-table"}>
                <tbody>
                {words.map((word, index) => {
                    let hiragana = getHiragana(word)
                    const onClickAudio = () => playAudio(hiragana)
                    return (
                        <tr key={index}>
                            <td style={{
                                display: "block"
                            }}>
                                <span style={{
                                    display: "block",
                                    marginTop: "20px",
                                    // verticalAlign: "text-top",
                                    userSelect: "none"
                                }}>
                                    {word.verse}:
                                </span>
                            </td>
                            <td onClick={onClickAudio}>
                            <span>
                                <WordElement {...{word}}/>
                            </span>
                            </td>
                            <td>
                                <button onClick={onClickAudio}>play</button>
                            </td>
                        </tr>)
                })}
                </tbody>
            </table>
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

const getAudioData = async (text: string,) => {
    return await fetch(process.env.NEXT_PUBLIC_TTSHUB_SERVER as string, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // "Access-Control-Allow-Origin": "*"
        },
        mode: 'cors',
        body: JSON.stringify({
            tts_engine: "gtts",
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
            console.log(data)
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

async function japanese(str: string) {
    str = str.trim();
    if (str.length === 0) {
        // setOutput("");
        return;
    }
    try {
        // const data = await getJapaneseFurigana(str)
        const data = decodeJapaneseFurigana(str)
        console.log(data);
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
