import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_CONFIG } from '../../utils/constants'

const SEO = ({
    title,
    description,
    keywords,
    image,
    type = 'website'
}) => {
    const location = useLocation()

    // Default values
    const seoTitle = title ? `${title} | ${SITE_CONFIG.name}` : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`
    const seoDescription = description || SITE_CONFIG.description
    const seoImage = image || '/og-image.jpg' // TODO: Crear imatge OG
    const seoUrl = `https://terracottagranollers.com${location.pathname}`

    useEffect(() => {
        // Update document title
        document.title = seoTitle

        // Update meta tags
        updateMetaTag('description', seoDescription)
        updateMetaTag('keywords', keywords)

        // Open Graph tags
        updateMetaTag('og:title', seoTitle, 'property')
        updateMetaTag('og:description', seoDescription, 'property')
        updateMetaTag('og:image', seoImage, 'property')
        updateMetaTag('og:url', seoUrl, 'property')
        updateMetaTag('og:type', type, 'property')
        updateMetaTag('og:site_name', SITE_CONFIG.name, 'property')

        // Twitter Card tags
        updateMetaTag('twitter:card', 'summary_large_image', 'name')
        updateMetaTag('twitter:title', seoTitle, 'name')
        updateMetaTag('twitter:description', seoDescription, 'name')
        updateMetaTag('twitter:image', seoImage, 'name')

        // Additional meta tags
        updateMetaTag('author', 'Terracotta Granollers', 'name')
        updateMetaTag('robots', 'index, follow', 'name')
        updateMetaTag('language', 'ca', 'name')

    }, [seoTitle, seoDescription, seoImage, seoUrl, type, keywords])

    const updateMetaTag = (name, content, attribute = 'name') => {
        if (!content) return

        let element = document.querySelector(`meta[${attribute}="${name}"]`)

        if (element) {
            element.setAttribute('content', content)
        } else {
            element = document.createElement('meta')
            element.setAttribute(attribute, name)
            element.setAttribute('content', content)
            document.getElementsByTagName('head')[0].appendChild(element)
        }
    }

    // This component doesn't render anything
    return null
}

export default SEO

// Hook personalitzat per facilitar l'ús
export const useSEO = (seoData) => {
    useEffect(() => {
        // Crear una instància de SEO amb les dades proporcionades
        const seoComponent = SEO(seoData)
    }, [seoData])
}