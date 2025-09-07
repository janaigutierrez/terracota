import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, Check, AlertCircle, Send } from 'lucide-react'
import { ANIMATION_VARIANTS, SITE_CONFIG, EMAIL_CONFIG, API_CONFIG } from '../../utils/constants'
import emailjs from '@emailjs/browser'

const BOOKING_OPTIONS = [
    {
        id: 'tassa',
        name: 'Tassa',
        price: 8,
        duration: '45 min',
        description: 'Perfecta per començar',
        maxPeople: 1
    },
    {
        id: 'plat',
        name: 'Plat',
        price: 12,
        duration: '60-90 min',
        description: 'L\'opció més popular',
        maxPeople: 1
    },
    {
        id: 'decorativa',
        name: 'Peça decorativa',
        price: 18,
        duration: '90-120 min',
        description: 'Per creacions especials',
        maxPeople: 1
    },
    {
        id: 'grup',
        name: 'Taller grupal',
        price: 80,
        duration: '2 hores',
        description: 'Per grups de 6-10 persones',
        maxPeople: 10
    }
]

const TIME_SLOTS = [
    '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00', '19:00'
]

const Booking = () => {
    const [formData, setFormData] = useState({
        selectedOption: '',
        date: '',
        time: '',
        people: 1,
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptTerms: false
    })

    const [formErrors, setFormErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.selectedOption) errors.selectedOption = 'Selecciona una opció'
        if (!formData.date) errors.date = 'Selecciona una data'
        if (!formData.time) errors.time = 'Selecciona una hora'
        if (!formData.name.trim()) errors.name = 'El nom és obligatori'
        if (!formData.email.trim()) errors.email = 'L\'email és obligatori'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email no vàlid'
        if (!formData.phone.trim()) errors.phone = 'El telèfon és obligatori'
        if (!formData.acceptTerms) errors.acceptTerms = 'Has d\'acceptar els termes'

        // Validate date is not in the past
        if (formData.date) {
            const selectedDate = new Date(formData.date)
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            if (selectedDate < today) {
                errors.date = 'La data no pot ser en el passat'
            }
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        setIsSubmitting(true)

        try {
            // Preparar dades per enviar
            const selectedOption = BOOKING_OPTIONS.find(opt => opt.id === formData.selectedOption)

            // Dades per EmailJS
            const emailData = {
                to_email: SITE_CONFIG.email,
                from_name: formData.name,
                from_email: formData.email,
                phone: formData.phone,
                booking_option: selectedOption?.name,
                booking_date: new Date(formData.date).toLocaleDateString('ca-ES'),
                booking_time: formData.time,
                people_count: formData.people,
                total_price: calculateTotal(),
                message: formData.message || 'Sense missatge adicional',
                booking_id: `TER-${Date.now()}`
            }

            // Dades per Backend (API dinàmica)
            const backendData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                selectedOption: formData.selectedOption,
                date: formData.date,
                time: formData.time,
                people: formData.people,
                message: formData.message,
                totalPrice: calculateTotal()
            }

            // 1. Guardar al backend (prioritari) - URL dinàmica
            console.log('📤 Enviant reserva al backend...', backendData)
            console.log('🌐 API URL:', `${API_CONFIG.baseURL}/bookings`)

            const backendResponse = await fetch(`${API_CONFIG.baseURL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backendData)
            })

            const backendResult = await backendResponse.json()

            if (!backendResponse.ok) {
                throw new Error(`Backend error: ${backendResult.error || 'Error desconegut'}`)
            }

            console.log('✅ Reserva guardada al backend:', backendResult)

            // 2. Enviar email amb EmailJS (secundari)
            try {
                const emailResult = await emailjs.send(
                    EMAIL_CONFIG.serviceId,
                    EMAIL_CONFIG.templateId,
                    emailData,
                    EMAIL_CONFIG.publicKey
                )
                console.log('📧 Email enviat correctament:', emailResult)
            } catch (emailError) {
                console.warn('⚠️ Error enviant email (però reserva guardada):', emailError)
                // No fallem per l'email - la reserva ja està guardada
            }

            // 3. Mostrar èxit
            console.log('🎉 Reserva completada amb èxit!')
            setSubmitted(true)

        } catch (error) {
            console.error('❌ Error processant reserva:', error)

            // Missatge d'error més informatiu
            let errorMessage = 'Hi ha hagut un error guardant la reserva.'

            if (error.message.includes('Backend error')) {
                errorMessage += ' Problema amb el servidor.'
            } else if (error.message.includes('fetch')) {
                errorMessage += ' Problema de connexió.'
            }

            errorMessage += ` Si us plau, truqueu-nos directament al ${SITE_CONFIG.phone}`

            alert(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }

    const calculateTotal = () => {
        const option = BOOKING_OPTIONS.find(opt => opt.id === formData.selectedOption)
        if (!option) return 0

        if (option.id === 'grup') {
            return option.price // Grup price is fixed
        }
        return option.price * formData.people
    }

    const getMinDate = () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
    }

    if (submitted) {
        return (
            <section className="section-padding bg-gradient-to-br from-terracotta-100 to-cream-200">
                <div className="container-custom">
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl mx-auto text-center"
                    >
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check className="w-10 h-10 text-green-600" />
                            </div>

                            <h2 className="heading-lg mb-4">Reserva confirmada! 🎉</h2>
                            <p className="text-large text-clay-600 mb-6">
                                Hem rebut la teva reserva i t'enviem un email de confirmació en breus.
                                T'esperem el <strong>{new Date(formData.date).toLocaleDateString('ca-ES')}</strong> a les <strong>{formData.time}</strong>!
                            </p>

                            <div className="bg-terracotta-50 rounded-xl p-6 mb-6">
                                <h3 className="font-semibold text-terracotta-800 mb-3">Detalls de la reserva:</h3>
                                <div className="text-left space-y-2 text-clay-600">
                                    <p><strong>Opció:</strong> {BOOKING_OPTIONS.find(opt => opt.id === formData.selectedOption)?.name}</p>
                                    <p><strong>Persones:</strong> {formData.people}</p>
                                    <p><strong>Total:</strong> {calculateTotal()}€</p>
                                    <p><strong>Contacte:</strong> {formData.name} ({formData.email})</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-secondary"
                                >
                                    Nova reserva
                                </button>
                                <a
                                    href="/"
                                    className="btn-primary"
                                >
                                    Tornar a l'inici
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <section className="section-padding bg-gradient-to-br from-terracotta-100 to-cream-200">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    variants={ANIMATION_VARIANTS.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="inline-flex items-center space-x-2 bg-gradient-to-br from-terracotta-100 to-cream-200 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >

                    </motion.div>

                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Crea el teu
                        <span className="text-terracotta-600"> moment perfecte</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto"
                    >
                        Selecciona la teva opció preferida i reserva l'experiència.
                        T'ajudarem a crear una obra única mentre gaudeixes d'un bon cafè.
                    </motion.p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Step 1: Select Option */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="heading-md mb-6">1. Escull la teva experiència</h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {BOOKING_OPTIONS.map((option) => (
                                    <motion.div
                                        key={option.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.selectedOption === option.id
                                            ? 'border-terracotta-500 bg-terracotta-50'
                                            : 'border-gray-200 hover:border-terracotta-300'
                                            }`}
                                        onClick={() => handleInputChange('selectedOption', option.id)}
                                    >
                                        {formData.selectedOption === option.id && (
                                            <div className="absolute top-3 right-3 w-6 h-6 bg-terracotta-500 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        <h4 className="font-semibold text-clay-800 mb-2">{option.name}</h4>
                                        <p className="text-clay-600 text-sm mb-3">{option.description}</p>

                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center space-x-1 text-clay-500">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{option.duration}</span>
                                                </span>
                                                <span className="flex items-center space-x-1 text-clay-500">
                                                    <Users className="w-4 h-4" />
                                                    <span>Max {option.maxPeople}</span>
                                                </span>
                                            </div>
                                            <span className="font-bold text-terracotta-600">{option.price}€</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {formErrors.selectedOption && (
                                <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{formErrors.selectedOption}</span>
                                </p>
                            )}
                        </div>

                        {/* Step 2: Date & Time */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="heading-md mb-6">2. Selecciona data i hora</h3>

                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Date */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Data
                                    </label>
                                    <input
                                        type="date"
                                        min={getMinDate()}
                                        value={formData.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 ${formErrors.date ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.date && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.date}</p>
                                    )}
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Clock className="w-4 h-4 inline mr-2" />
                                        Hora
                                    </label>
                                    <select
                                        value={formData.time}
                                        onChange={(e) => handleInputChange('time', e.target.value)}
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 ${formErrors.time ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Selecciona hora</option>
                                        {TIME_SLOTS.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                    {formErrors.time && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.time}</p>
                                    )}
                                </div>

                                {/* People */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Persones
                                    </label>
                                    <select
                                        value={formData.people}
                                        onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
                                        disabled={formData.selectedOption === 'grup'}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 disabled:bg-gray-100"
                                    >
                                        {Array.from({ length: formData.selectedOption === 'grup' ? 1 : 4 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'persona' : 'persones'}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Contact Details */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="heading-md mb-6">3. Les teves dades</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Nom complet *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="El teu nom"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.name && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="el.teu@email.com"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.email && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Telèfon *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="666 123 456"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {formErrors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Missatge (opcional)
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => handleInputChange('message', e.target.value)}
                                        placeholder="Alguna petició especial?"
                                        rows="3"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Summary & Submit */}
                        <div className="p-8 bg-terracotta-50">
                            <h3 className="heading-md mb-6">4. Confirmació</h3>

                            {/* Summary */}
                            {formData.selectedOption && (
                                <div className="bg-white rounded-xl p-6 mb-6">
                                    <h4 className="font-semibold text-clay-800 mb-4">Resum de la reserva:</h4>
                                    <div className="space-y-2 text-clay-600">
                                        <p><strong>Experiència:</strong> {BOOKING_OPTIONS.find(opt => opt.id === formData.selectedOption)?.name}</p>
                                        {formData.date && <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('ca-ES')}</p>}
                                        {formData.time && <p><strong>Hora:</strong> {formData.time}</p>}
                                        <p><strong>Persones:</strong> {formData.people}</p>
                                        <div className="border-t pt-2 mt-3">
                                            <p className="text-lg font-bold text-terracotta-600">
                                                <strong>Total: {calculateTotal()}€</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Terms */}
                            <div className="mb-6">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptTerms}
                                        onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                                        className={`mt-1 w-4 h-4 text-terracotta-600 border-gray-300 rounded focus:ring-terracotta-500 ${formErrors.acceptTerms ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <span className="text-clay-600 text-sm">
                                        Accepto les{' '}
                                        <Link
                                            to="/condicions"
                                            className="text-terracotta-600 hover:underline font-medium"
                                            target="_blank"
                                        >
                                            condicions d'ús
                                        </Link>
                                        {' '}i la{' '}
                                        <Link
                                            to="/politica-privacitat"
                                            className="text-terracotta-600 hover:underline font-medium"
                                            target="_blank"
                                        >
                                            política de privacitat
                                        </Link>
                                        . Entenc que la reserva es confirmarà per email i que puc cancel·lar fins 24h abans.
                                    </span>
                                </label>
                                {formErrors.acceptTerms && (
                                    <p className="text-red-500 text-sm mt-2 ml-7">{formErrors.acceptTerms}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                        <span>Enviant reserva...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Confirmar reserva</span>
                                    </>
                                )}
                            </motion.button>

                            <p className="text-center text-clay-500 text-sm mt-4">
                                <strong>Recordatori:</strong> Rebràs un email de confirmació i t'enviarem un recordatori el dia abans
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Booking