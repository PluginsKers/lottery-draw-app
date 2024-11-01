import '@/styles/globals.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" type="image/svg+xml" href="/icon.svg" />
                <title>抽签签</title>
            </Head>
            <main className='bg-emerald-50'>
                <Component {...pageProps} />
            </main>
        </>
    );
}
