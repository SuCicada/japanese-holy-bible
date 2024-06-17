"use client"
import '@/app/bible/App.css';
import BibleTable from '../../bible';
import Toolbar from "@/app/bible/toolbar";
import React from "react";
import BookSelect from "@/app/bible/book";


export default function BiblePage(
  {params}: { params: { book: string, chapter: string } }
) {
  const {book, chapter} = params
  // const [text, setText] = useState("")
  // const [clickSignal, setClickSignal] = useState(1)
  // const router = useRouter()
  const index = {book: decodeURI(book), chapter: parseInt(chapter)}
  // const pathname = usePathname();

  // const playAudio = async (text: string) => {
  //   setText(text)
  //   // setClickSignal(-clickSignal)
  // }
  // const getAudioTest =  () => {
  //   return text
  // }

  // function handleBookSelectChange(value: BibleIndex) {
  //   console.log("handleBookSelectChange", value)
  //   // router.push(`/bible/${value.book}/${value.chapter}`)
  // }

  console.log("BiblePage", decodeURI(book), chapter)

  return (
    <div className="App">
      <div className={"bible-header"}>
        <h1>信仰によって生きてください。</h1>
        <BookSelect index={index}/>
      </div>

      <BibleTable {...{book, chapter}} />

      <Toolbar {...{text: "null",}} />
    </div>
  );
}
