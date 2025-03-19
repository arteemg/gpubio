import artemImage from './client/static/IMG_2825.webp';  // You'll need to add this image
import advisorImage from './client/static/IMG_2799.png';  // You'll need to add this image


import './Main.css'


export default function AboutUsPage() {
    return (
        <div className='relative pt-14 w-full'>
            <TopGradient />
            <BottomGradient />
            <div className='py-12 sm:py-16'>
                <div className='mx-auto max-w-7xl px-6 lg:px-8'>
                    <div className='mx-auto max-w-2xl text-center'>
                        <p className='text-lg text-gray-900 dark:text-white'>
                            For contact inquiries, please email: <strong>artem@gpubio.xyz</strong>
                        </p>
                    </div>

                    {/* Team Members and Advisors Section */}
                    <div className='mx-auto mt-20 max-w-7xl'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
                            {/* Team Members */}
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 text-center mb-12 dark:text-white'>
                                    Team Members
                                </h3>
                                <div className='flex justify-center'>
                                    <div className='text-center'>
                                        <img
                                            className='mx-auto h-40 w-40 rounded-full'
                                            src={artemImage}
                                            alt=''
                                        />
                                        <h4 className='mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                                            {['A', 'r', 't', 'e', 'm', ' ', 'G', 'a', 'z', 'i', 'z', 'o', 'v'].join('')}
                                        </h4>
                                        <p className='text-sm leading-6 text-gray-900 dark:text-gray-300'>
                                            <strong>Hanging around</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Advisors */}
                            <div>
                                <h3 className='text-2xl font-bold text-gray-900 text-center mb-12 dark:text-white'>
                                    Advisors
                                </h3>
                                <div className='flex justify-center'>
                                    <div className='text-center'>
                                        <img
                                            className='mx-auto h-40 w-40 rounded-full'
                                            src={advisorImage}
                                            alt='Advisor Name'
                                        />
                                        <h4 className='mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                                            Dr. Sergey Ovchinnikov
                                        </h4>
                                        <p className='text-sm leading-6 text-gray-900 dark:text-gray-300'>
                                            <strong>Scientific Advisor</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
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