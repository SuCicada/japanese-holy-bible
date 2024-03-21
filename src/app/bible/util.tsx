import { decodeJapaneseFurigana } from "../utils/service";


export function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const uint8Array = new Uint8Array(arrayBuffer);
  let binaryString = '';
  uint8Array.forEach((byte) => {
    binaryString += String.fromCharCode(byte);
  });
  return btoa(binaryString);
}

export async function japanese(str: string) {
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
