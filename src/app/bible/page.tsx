import React from 'react';
import BiblePage from './[book]/[chapter]/page';
import Link from 'next/link';

const Page = () => {
    return (
        <div>
            <h1>Hello, World!</h1>
            <p>This is a sample page.</p>
            <Link href="/bible/john/3">ssdf</Link>
            {/* <BiblePage params={{ */}
                {/* book: "john", */}
                {/* chapter: "3" */}
            {/* }}/> */}
        </div>
    );
};

export default Page;