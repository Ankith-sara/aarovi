import React from 'react';
import Hero from '../components/Hero';
import LastestCollection from '../components/LastestCollection';
import ExclusiveOffers from '../components/ExclusiveOffers';
import Collections from '../components/Collections';
import Services from '../components/Services';

const Index = () => {
    return (
        <div>
            <Hero />
            <Collections />
            <LastestCollection />
            <ExclusiveOffers />
            <Services />
        </div>
    )
}

export default Index;