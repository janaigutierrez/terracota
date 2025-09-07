import { motion } from 'framer-motion'
import SEO from '../components/common/SEO'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Spaces from '../components/sections/Spaces'
import History from '../components/sections/History'
import Gallery from '../components/sections/Gallery'
import Pricing from '../components/sections/Pricing'
import Booking from '../components/sections/Booking'
import Contact from '../components/sections/Contact'
import React from 'react'

const Home = () => {
    return (
        <>
            <SEO
                title="Inici"
                description="Paint-your-own pottery i cafeteria a Granollers. Crea la teva obra d'art ceràmica única mentre gaudeixes d'un bon cafè en un ambient relaxant."
                keywords="ceràmica, pottery, Granollers, cafeteria, paint your own, taller ceràmica, activitat família, Vallès Oriental"
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                {/* Hero Section */}
                <section id="home">
                    <Hero />
                </section>

                {/* About Section */}
                <section id="about">
                    <About />
                </section>

                {/* Spaces Section */}
                <section id="spaces">
                    <Spaces />
                </section>

                {/* History & Process */}
                <section id="process">
                    <History />
                </section>

                {/* Gallery */}
                <section id="gallery">
                    <Gallery />
                </section>

                {/* Pricing */}
                <section id="pricing">
                    <Pricing />
                </section>

                {/* Booking */}
                <section id="booking">
                    <Booking />
                </section>

                {/* Contact */}
                <section id="contact">
                    <Contact />
                </section>
            </motion.div>
        </>
    )
}

export default Home