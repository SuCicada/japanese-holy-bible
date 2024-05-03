import React, { ChangeEvent, ChangeEventHandler, MouseEvent, Suspense, useEffect, useRef, useState } from 'react';
import { Bible } from './data';
import { japanese } from './util';
export 
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
  