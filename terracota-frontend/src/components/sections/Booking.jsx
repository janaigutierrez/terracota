import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, Phone, Mail, User, MessageSquare, Check, AlertCircle, Send, Euro, Info } from 'lucide-react'
import { ANIMATION_VARIANTS, SITE_CONFIG, API_CONFIG } from '../../utils/constants'

const TIME_SLOTS = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
]

const Booking = () => {
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        people: 1,
        name: '',
        email: '',
        phone: '',
        message: '',
        acceptPolicy: false
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

        if (!formData.date) errors.date = 'Selecciona una data'
        if (!formData.time) errors.time = 'Selecciona una hora'
        if (!formData.name.trim()) errors.name = 'El nom és obligatori'
        if (!formData.email.trim()) errors.email = 'L\'email és obligatori'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email no vàlid'
        if (!formData.phone.trim()) errors.phone = 'El telèfon és obligatori'
        if (!formData.acceptPolicy) errors.acceptPolicy = 'Has d\'acceptar la política de cancel·lacions'

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
            // Dades per Backend (nou sistema)
            const backendData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                date: formData.date,
                time: formData.time,
                people: formData.people,
                message: formData.message,
                acceptPolicy: formData.acceptPolicy
            }

            console.log('📤 Enviant reserva al backend...', backendData)
            console.log('🌐 API URL:', `${API_CONFIG.baseURL}/api/bookings`)

            const backendResponse = await fetch(`${API_CONFIG.baseURL}/api/bookings`, {
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
            setSubmitted(true)

        } catch (error) {
            console.error('❌ Error processant reserva:', error)

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
        return formData.people * 8
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
                                    <p><strong>Sistema:</strong> 8€ per persona</p>
                                    <p><strong>Persones:</strong> {formData.people}</p>
                                    <p><strong>Total pagat:</strong> {calculateTotal()}€</p>
                                    <p><strong>Contacte:</strong> {formData.name} ({formData.email})</p>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    <strong>Recordatori:</strong> Al local podràs triar entre més de 50 peces diferents.
                                    Si la peça costa més de 8€, pagaràs la diferència. Si costa menys, tens crèdit per cafeteria!
                                </p>
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
                    <motion.h2
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="heading-lg mb-6"
                    >
                        Reserva la teva
                        <span className="text-terracotta-600"> experiència</span>
                    </motion.h2>

                    <motion.p
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="text-large max-w-2xl mx-auto mb-8"
                    >
                        Sistema simplificat: 8€ per persona - Tria la peça perfecta al local
                    </motion.p>

                    {/* Info Sistema Nou */}
                    <motion.div
                        variants={ANIMATION_VARIANTS.fadeInUp}
                        className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto"
                    >
                        <div className="flex items-start space-x-3">
                            <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="text-left">
                                <h3 className="font-semibold text-blue-800 mb-3">Com funciona el nou sistema:</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                                    <div>
                                        <p className="mb-2">✅ <strong>Reserves la taula:</strong> 8€ per persona</p>
                                        <p className="mb-2">🏺 <strong>Al local:</strong> +50 peces disponibles</p>
                                    </div>
                                    <div>
                                        <p className="mb-2">💰 <strong>Peça més cara:</strong> Pagues diferència</p>
                                        <p className="mb-2">☕ <strong>Peça més barata:</strong> Crèdit cafeteria</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Step 1: Date & Time */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="heading-md mb-6">1. Selecciona data i hora</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Date */}
                                <div>
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Data *
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
                                        Hora *
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
                            </div>
                        </div>

                        {/* Step 2: People & Price */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="heading-md mb-6">2. Quantes persones?</h3>

                            <div className="flex items-center justify-between">
                                <div className="flex-1 mr-8">
                                    <label className="block text-clay-700 font-medium mb-2">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Nombre de persones *
                                    </label>
                                    <select
                                        value={formData.people}
                                        onChange={(e) => handleInputChange('people', parseInt(e.target.value))}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500"
                                    >
                                        {Array.from({ length: 8 }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'persona' : 'persones'}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="bg-terracotta-50 border border-terracotta-200 rounded-xl p-6 text-center">
                                    <div className="flex items-center justify-center text-terracotta-600 mb-2">
                                        <Euro className="w-6 h-6 mr-2" />
                                        <span className="text-3xl font-bold">{calculateTotal()}</span>
                                    </div>
                                    <p className="text-sm text-terracotta-700">
                                        8€ × {formData.people} persona{formData.people > 1 ? 'es' : ''}
                                    </p>
                                    <p className="text-xs text-terracotta-600 mt-1">Import mínim per qualsevol peça</p>
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
                                        placeholder="Ocasió especial, al·lèrgies, peticions especials..."
                                        rows="3"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Policy & Submit */}
                        <div className="p-8 bg-terracotta-50">
                            <h3 className="heading-md mb-6">4. Confirmació</h3>

                            {/* Summary */}
                            {formData.date && formData.time && (
                                <div className="bg-white rounded-xl p-6 mb-6">
                                    <h4 className="font-semibold text-clay-800 mb-4">Resum de la reserva:</h4>
                                    <div className="space-y-2 text-clay-600">
                                        <p><strong>Sistema:</strong> 8€ per persona</p>
                                        <p><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('ca-ES')}</p>
                                        <p><strong>Hora:</strong> {formData.time}</p>
                                        <p><strong>Persones:</strong> {formData.people}</p>
                                        <div className="border-t pt-2 mt-3">
                                            <p className="text-lg font-bold text-terracotta-600">
                                                <strong>Total a pagar: {calculateTotal()}€</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Policy */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Política de Cancel·lacions
                                </h4>
                                <div className="text-sm text-amber-700 mb-3 space-y-1">
                                    <p>✅ <strong>+48h abans:</strong> Cancel·lació gratuïta amb reemborsament complet</p>
                                    <p>❌ <strong>-48h abans:</strong> Import no reemborsable</p>
                                    <p>🆘 <strong>Emergències:</strong> Contacta'ns i valorarem reagendar</p>
                                </div>

                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.acceptPolicy}
                                        onChange={(e) => handleInputChange('acceptPolicy', e.target.checked)}
                                        className={`mt-1 w-4 h-4 text-terracotta-600 border-gray-300 rounded focus:ring-terracotta-500 ${formErrors.acceptPolicy ? 'border-red-500' : ''
                                            }`}
                                    />
                                    <span className="text-sm text-amber-800">
                                        Accepto la política de cancel·lacions i entenc que els {calculateTotal()}€ només són reemborsables si cancel·lo amb més de 48h d'antelació
                                    </span>
                                </label>
                                {formErrors.acceptPolicy && (
                                    <p className="text-red-500 text-sm mt-2">{formErrors.acceptPolicy}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <motion.button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting || !formData.acceptPolicy}
                                className="w-full bg-terracotta-500 hover:bg-terracotta-600 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                        <span>Processant reserva...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Reservar i Pagar {calculateTotal()}€</span>
                                    </>
                                )}
                            </motion.button>

                            <p className="text-center text-clay-500 text-sm mt-4">
                                <strong>Recordatori:</strong> Rebràs un email de confirmació i podràs triar la peça al local
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Booking