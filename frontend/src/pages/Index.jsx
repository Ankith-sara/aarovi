import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import Collections from '../components/Collections';
import Services from '../components/Services';

const Index = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <Services />
        </div>
    )
}

export default Index;