import openSaasBannerWebp from '../../client/static/pdb_example.webp';
import { useState, useEffect } from 'react';

export default function Hero() {
    const words = ['Molecules.', 'Medicines.', 'Inhibitors.', 'Peptides.'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setOpacity(0); // Fade out
            setTimeout(() => {
                setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
                setOpacity(1); // Fade in
            }, 500); // Wait for fade out to complete
        }, 2700);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='relative pt-14 w-full'>
            <TopGradient />
            <BottomGradient />
            <div className='py-24 sm:py-32'>
                <div className='mx-auto max-w-8xl px-6 lg:px-8'>
                    <div className='lg:mb-18 mx-auto max-w-3xl text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 sm:text-6xl dark:text-white'>
                            Smarter Models.
                            <span className='block'>
                                Better <span style={{ transition: 'opacity 0.5s ease-in-out', opacity }}>{words[currentWordIndex]}</span>
                            </span>
                        </h1>

                        <p className='mt-6 mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-white'>
                            Making programmable drug discovery a reality by decoding nature's language at the atomic scale.
                        </p>
                        <div className='mt-10 flex items-center justify-center gap-x-6'>
                            {<a
                                href={"humanproteome"}
                                className='rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-800 ring-1 ring-inset ring-gray-300 hover:ring-2 hover:ring-yellow-300 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-white'
                            >
                                Explore <span aria-hidden='true'>→</span>
                            </a>}
                        </div>
                    </div>
                    <div className='mt-14 flow-root sm:mt-14'>
                        <div className='-m-2  flex justify-center rounded-xl lg:-m-4 lg:rounded-2xl lg:p-4'>
                            <img
                                src={openSaasBannerWebp}
                                alt='App screenshot'
                                width={1000}
                                height={530}
                                loading='lazy'
                                className='rounded-md shadow-2xl ring-1 ring-gray-900/10'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function TopGradient() {
    return (
        <div
            className='absolute top-0 right-0 -z-10 transform-gpu overflow-hidden w-full blur-3xl sm:top-0'
            aria-hidden='true'
        >
            <div
                className='aspect-[1020/880] w-[55rem] flex-none sm:right-1/4 sm:translate-x-1/2 dark:hidden bg-gradient-to-tr from-amber-400 to-purple-300 opacity-40'
                style={{
                    clipPath: 'polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)',
                }}
            />
        </div>
    );
}

function BottomGradient() {
    return (
        <div
            className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] -z-10 transform-gpu overflow-hidden blur-3xl'
            aria-hidden='true'
        >
            <div
                className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 dark:hidden bg-gradient-to-br from-amber-400 to-purple-300  opacity-50 w-[72.1875rem]'
                style={{
                    clipPath: 'ellipse(80% 30% at 80% 50%)',
                }}
            />
        </div>
    );
}