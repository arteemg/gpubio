import { footerNavigation } from './contentSections';
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function LandingPage() {
    return (
        <div className='bg-white dark:text-white dark:bg-boxdark-2'>
            <main className='isolate dark:bg-boxdark-2'>
                <Hero />
            </main>
            {/* <Footer footerNavigation={footerNavigation} /> */}
        </div>
    );
}
