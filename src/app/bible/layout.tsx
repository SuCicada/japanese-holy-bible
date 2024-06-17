export default function DashboardLayout({
                                          children, // will be a page or nested layout
                                          // params,
                                        }: {
  children: React.ReactNode,
  //  params: any,
}) {
  // const router = useRouter()
  // const pathname = usePathname();
  // const [index, setIndex] = useState<BibleIndex>()
  // useEffect(() => {
  //   console.log(pathname)
  //   if (pathname) {
  //     let res = getParams(pathname)
  //     console.log("dashboard layout",res)
  //     if (res) {
  //       let {book, chapter} = res
  //       setIndex({book, chapter})
  //     }
  //   }
  //   // console.log("DashboardLayout", params)
  // }, [pathname])
  //
  // function handleBookSelectChange(value: BibleIndex) {
  //   console.log("handleBookSelectChange", value)
  //   router.push(`/bible/${value.book}/${value.chapter}`)
  // }

  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav></nav>
      <div>
        {children}
      </div>
    </section>
  )
}

// function getParams(pathname: string) {
//   let match = pathname.match(/\/bible\/(.+)\/(\d+)/);
//
//   if (match) {
//     let book = decodeURIComponent(match[1]);
//     let chapter = parseInt(match[2]);
//     return {book, chapter}
//     // console.log("Chapter:", chapter);
//   } else {
//     console.log("URL format does not match.");
//   }
// }
