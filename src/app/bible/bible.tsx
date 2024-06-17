import React, {useContext, useEffect, useState} from "react";
import {WordElement} from "./word";
import {Bible} from "./data";
import {useMyStore} from "@/app/bible/myStore";
// import {useToolbar} from "@/app/bible/[book]/[chapter]/page";

function BibleTable({book, chapter,
                      // setText,
// playAudio
 }: {
  book: string, chapter: string,
  // setText: (text: string) => void,
  // playAudio: (text: string) => void
}) {
  console.log("BibleTable", book, chapter)
  const [words, setWords] = useState<Bible[]>([])
  useEffect(() => {
    (async function () {
      console.log("BibleTable useEffect", book, chapter)

      /** @type {import("@/app/api/bible/[book]/[chapter]/route.ts")} */
      const response = await fetch(`/api/bible/${book}/${chapter}`,
        {
          // cache: "no-store",
          // cache: "force-cache",
          // next: {
          //   revalidate: 10,
          // },
        }
      );
      const result: Bible[] = await response.json();
      setWords(result)
    })()
  }, []);
  // const {setText2} = useMyStore();
  const onClickAudio = (reading) => {
    // let {playAudio} = useToolbar()
    // playAudio(reading)
    // setText(reading)
    // setText2(reading)
    useMyStore.setState({text2: reading,
      clickSignal: -useMyStore.getState().clickSignal
    })
  }
  return (
    <div className={"bible-body"} key={null}>
      <table className={"bible-table"} key={null}>
        <tbody key={null}>
        {words.map((word, index) => {
          // let hiragana = getHiragana(word)
          let reading = word.reading ?? ""
          // const onClickAudio = () => {
          //   // let {playAudio} = useToolbar()
          //   // playAudio(reading)
          //   // setText(reading)
          //   setText2(reading)
          // }

          // console.log(`${book}-${chapter}-${index}`)
          return (
            <tr key={Math.random().toString()}>
              <td key={Math.random().toString()}
                  style={{
                    display: "block",
                    width: "30px",
                    marginRight: "5px",
                    // paddingRight: "-210px",
                  }}>
                <button
                  style={{
                    userSelect: "none"
                  }}
                  onClick={()=>onClickAudio(reading)}>言
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
              <td key={Math.random().toString()}
                  className={"bible-text"}
                // onClick={onClickAudio}
              >
                <div>
                  <WordElement {...{word}} />
                </div>
              </td>
            </tr>
           )
          // return (<tr key={Math.random().toString()}></tr>)
        })}
        </tbody>
      </table>
    </div>
  );
}
// export default React.memo(BibleTable);
export default BibleTable;
