'use client';

import { motion } from 'framer-motion';
import { useState, use, useEffect } from 'react';
import Image from 'next/image';

// Datos ficticios - fallback si la API falla
const businessData: Record<string, any> = {
  'mi-negocio': {
    nombre: 'Salón de Belleza Premium',
    name: 'Salón de Belleza Premium',
    description: 'Tu salón de confianza con los mejores servicios de belleza',
    avatar: '/assets/images/plania-logo-full.webp',
    numero: '+57 300 123 4567',
    rating: 4.8,
    reviews: 125,
    services: [
      { id: 1, name: 'Corte de Cabello', duration: 30, price: 25000 },
      { id: 2, name: 'Tinte', duration: 90, price: 50000 },
      { id: 3, name: 'Peinado', duration: 45, price: 35000 },
      { id: 4, name: 'Manicure', duration: 30, price: 20000 },
      { id: 5, name: 'Pedicure', duration: 30, price: 20000 },
    ],
    professionals: [
      { id: 1, name: 'María', specialties: ['Corte', 'Tinte'], rating: 4.9 },
      { id: 2, name: 'Laura', specialties: ['Peinado', 'Manicure'], rating: 4.7 },
      { id: 3, name: 'Ana', specialties: ['Pedicure', 'Manicure'], rating: 4.8 },
    ],
  },
};

interface PageProps {
  params: Promise<{
    businessId: string;
    businessSlug: string;
  }>;
}

export default function BookingPage({ params }: PageProps) {
  const { businessId, businessSlug } = use(params);
  const [business, setBusiness] = useState<any>(null);
  const [step, setStep] = useState<'business' | 'service' | 'professional' | 'datetime' | 'phone' | 'confirm' | 'otp' | 'success'>('business');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<number | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState({ code: '57', name: 'Colombia', flag: '🇨🇴' });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const countries = [
    { code: '1', name: 'USA', flag: '🇺🇸' },
    { code: '54', name: 'Argentina', flag: '🇦🇷' },
    { code: '55', name: 'Brasil', flag: '🇧🇷' },
    { code: '56', name: 'Chile', flag: '🇨🇱' },
    { code: '57', name: 'Colombia', flag: '🇨🇴' },
    { code: '52', name: 'México', flag: '🇲🇽' },
    { code: '51', name: 'Perú', flag: '🇵🇪' },
    { code: '34', name: 'España', flag: '🇪🇸' },
    { code: '39', name: 'Italia', flag: '🇮🇹' },
    { code: '44', name: 'Reino Unido', flag: '🇬🇧' },
    { code: '33', name: 'Francia', flag: '🇫🇷' },
    { code: '49', name: 'Alemania', flag: '🇩🇪' },
  ];

  const filteredCountries = countries.filter((c) =>
    c.code.includes(countrySearch) || c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/business/${businessId}/public-info`;
        console.log('🔗 Llamando a:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('✅ Información del negocio:', data);
        setBusiness(data);
      } catch (err) {
        console.error('❌ Error al obtener negocio:', err);
        // Fallback a datos ficticios si la API falla
        const fallbackBusiness = businessData[businessSlug];
        setBusiness(fallbackBusiness);
      } finally {
        setLoading(false);
      }
    };

    if (businessId && businessSlug) {
      fetchBusinessData();
    }
  }, [businessId, businessSlug]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/services/${businessId}?category=service`;
        console.log('🔗 Obteniendo servicios:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('✅ Servicios obtenidos:', data);

        if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else if (Array.isArray(data)) {
          setServices(data);
        } else {
          // Fallback a datos ficticios
          const fallbackBusiness = businessData[businessSlug];
          setServices(fallbackBusiness?.services || []);
        }
      } catch (err) {
        console.error('❌ Error al obtener servicios:', err);
        // Fallback a datos ficticios si la API falla
        const fallbackBusiness = businessData[businessSlug];
        setServices(fallbackBusiness?.services || []);
      } finally {
        setLoadingServices(false);
      }
    };

    if (businessId) {
      fetchServices();
    }
  }, [businessId, businessSlug]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoadingProfessionals(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/staff/${businessId}`;
        console.log('🔗 Obteniendo profesionales:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('✅ Profesionales obtenidos:', data);

        if (data.staff && Array.isArray(data.staff)) {
          setProfessionals(data.staff);
        } else if (Array.isArray(data)) {
          setProfessionals(data);
        } else {
          // Fallback a datos ficticios
          const fallbackBusiness = businessData[businessSlug];
          setProfessionals(fallbackBusiness?.professionals || []);
        }
      } catch (err) {
        console.error('❌ Error al obtener profesionales:', err);
        // Fallback a datos ficticios si la API falla
        const fallbackBusiness = businessData[businessSlug];
        setProfessionals(fallbackBusiness?.professionals || []);
      } finally {
        setLoadingProfessionals(false);
      }
    };

    if (businessId) {
      fetchProfessionals();
    }
  }, [businessId, businessSlug]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/public/schedules/${businessId}`;
        console.log('🔗 Obteniendo horarios:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('✅ Horarios obtenidos:', data);

        if (data.schedules && Array.isArray(data.schedules)) {
          setSchedules(data.schedules);
        }
      } catch (err) {
        console.error('❌ Error al obtener horarios:', err);
      }
    };

    if (businessId) {
      fetchSchedules();
    }
  }, [businessId]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/bookings/${businessId}`;
        console.log('🔗 Obteniendo citas:', apiUrl);

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log('✅ Citas obtenidas:', data);

        if (data.appointments && Array.isArray(data.appointments)) {
          setBookings(data.appointments);
        }
      } catch (err) {
        console.error('❌ Error al obtener citas:', err);
      }
    };

    if (businessId) {
      fetchBookings();
    }
  }, [businessId]);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentTime = new Date(2026, 0, 1, startHour, startMin);
    const endTimeDate = new Date(2026, 0, 1, endHour, endMin);

    while (currentTime < endTimeDate) {
      const hours = String(currentTime.getHours()).padStart(2, '0');
      const minutes = String(currentTime.getMinutes()).padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      currentTime.setMinutes(currentTime.getMinutes() + 40);
    }

    return slots;
  };

  const getOccupiedSlots = (date: string, staffId: number) => {
    const selectedStaff = professionals.find((p) => p.id === staffId);

    console.log('🔎 Buscando citas para:', date, 'Staff:', selectedStaff?.nombre, selectedStaff?.apellido);

    return bookings
      .filter((booking) => {
        const match = booking.staffdates === date &&
                     booking.staffNombre?.toLowerCase() === selectedStaff?.nombre?.toLowerCase() &&
                     booking.staffApellido?.toLowerCase() === selectedStaff?.apellido?.toLowerCase();
        if (match) {
          console.log('🔴 Cita ocupada:', booking.staffAppointmentsHour);
        }
        return match;
      })
      .map((booking) => booking.staffAppointmentsHour);
  };

  const getDayName = (date: Date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = `${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`;
    setSelectedDate(dateStr);

    const dayName = getDayName(selected);
    const schedule = schedules[0]?.days?.[dayName];

    console.log('🔍 Día:', dayName, 'Horario:', schedule);

    if (schedule && schedule.active) {
      const slots = generateTimeSlots(schedule.start, schedule.until);
      const occupied = getOccupiedSlots(dateStr, selectedProfessional);
      const available = slots.map((time) => ({
        time,
        occupied: occupied.includes(time),
      }));
      console.log('📅 Slots generados:', slots);
      console.log('🔴 Ocupados:', occupied);
      setAvailableSlots(available);
    } else {
      console.log('❌ El negocio no atiende este día');
      setAvailableSlots([]);
    }
  };

  const handleConfirmAppointment = async () => {
    try {
      // Prepare booking data
      const bookingData = {
        businessId: business.id || business.businessId,
        staffId: String(selectedProfessional),
        date: selectedDate,
        horario: selectedTime,
        serviceId: selectedService,
        name: customerName,
      };

      console.log('📤 Creando booking:', bookingData);

      // Create booking
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://plania.ejesatelital.com/api';
      const bookingUrl = `${apiUrl}/bookings`;

      const bookingResponse = await fetch(bookingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error('Error al crear la cita');
      }

      const bookingResult = await bookingResponse.json();
      console.log('✅ Booking creado:', bookingResult);

      // Send WhatsApp message
      const serviceName = services?.find?.((s: any) => s.id === selectedService)?.nombre ||
                         services?.find?.((s: any) => s.id === selectedService)?.name || 'Servicio';
      const staffName = professionals?.find?.((p: any) => p.id === selectedProfessional)?.nombre ||
                       professionals?.find?.((p: any) => p.id === selectedProfessional)?.name || 'Profesional';
      const businessName = business.nombre || business.name || 'Nuestro negocio';

      const whatsappMessage = `¡Hola ${customerName}! 🎉\n\nTu cita ha sido confirmada con éxito.\n\n📅 Fecha: ${selectedDate}\n⏰ Hora: ${selectedTime}\n✂️ Servicio: ${serviceName}\n👤 Profesional: ${staffName}\n📍 Lugar: ${businessName}\n\nTe esperamos 😎`;

      // Send WhatsApp without + symbol in the phone number
      const phoneNumber = `${selectedCountry.code}${customerPhone}`;
      const whatsappUrl = `https://apps.ejesatelital.com/api/messaging/whatsapp/send?apikey=4acd1256-a3f5-4d17-b3fb-58f4da702c1e&to=${phoneNumber}&message='${encodeURIComponent(whatsappMessage)}'&company=2`;

      console.log('📱 Enviando WhatsApp a:', phoneNumber);

      const whatsappResponse = await fetch(whatsappUrl);

      if (!whatsappResponse.ok) {
        console.warn('⚠️ Error al enviar WhatsApp, pero la cita fue creada');
      } else {
        console.log('✅ WhatsApp enviado exitosamente');
      }

      // Navigate to success step
      setStep('success');
    } catch (err) {
      console.error('❌ Error al crear cita:', err);
      alert('Hubo un error al crear la cita. Por favor, intenta de nuevo.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-block"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full" />
          </motion.div>
          <p className="text-gray-600 mt-4">Cargando información del negocio...</p>
        </motion.div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Negocio no encontrado</h1>
          <p className="text-gray-600">Lo sentimos, no pudimos encontrar el negocio</p>
        </motion.div>
      </div>
    );
  }

  const handleStartBooking = () => {
    setStep('service');
  };

  const handleSelectService = (serviceId: number) => {
    setSelectedService(serviceId);
    setStep('professional');
  };

  const handleSelectProfessional = (professionalId: number) => {
    setSelectedProfessional(professionalId);
    setStep('datetime');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Usar nombre o name del negocio
  const businessName = business.nombre || business.name || 'Negocio';
  const businessPhone = business.numero || business.phone || 'Sin teléfono';
  const businessAvatar = business.avatar || business.logo || '/assets/images/plania-logo-full.webp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {/* Progress Bar */}
      <motion.div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {['business', 'service', 'professional', 'datetime', 'phone', 'confirm', 'otp', 'success'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    ['business', 'service', 'professional', 'datetime', 'phone', 'confirm', 'otp', 'success'].indexOf(step) >= idx
                      ? 'bg-teal-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  animate={{
                    scale: ['business', 'service', 'professional', 'datetime', 'phone', 'confirm', 'otp', 'success'].indexOf(step) === idx ? 1.1 : 1,
                  }}
                >
                  {idx + 1}
                </motion.div>
                {idx < 7 && (
                  <motion.div
                    className={`flex-1 h-1 mx-2 ${
                      ['business', 'service', 'professional', 'datetime', 'phone', 'confirm', 'otp', 'success'].indexOf(step) > idx
                        ? 'bg-teal-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Business Info Step */}
      {step === 'business' && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Business Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={businessAvatar}
                  alt={businessName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                  loading="eager"
                />
              </motion.div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{businessName}</h1>
              <p className="text-xl text-gray-600 mb-4">{business.description || 'Negocio de servicios'}</p>

              {/* Rating */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xl font-bold text-gray-900">{business.rating || 4.8}</span>
                  <span className="text-gray-600">({business.reviews || 0} reseñas)</span>
                </div>
              </div>

              {/* Phone */}
              <div className="text-gray-600 mb-8">
                <p className="font-semibold">📱 {businessPhone}</p>
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={handleStartBooking}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-lg"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(26, 188, 156, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                🗓️ Agendar una Cita
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t-2 border-gray-100">
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-bold text-gray-900 mb-1">Rápido</h3>
                <p className="text-sm text-gray-600">Agenda en menos de 2 minutos</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-bold text-gray-900 mb-1">Seguro</h3>
                <p className="text-sm text-gray-600">Confirmación por WhatsApp</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-bold text-gray-900 mb-1">Flexible</h3>
                <p className="text-sm text-gray-600">Cancela o modifica fácilmente</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Service Selection Step */}
      {step === 'service' && selectedService === null && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">¿Qué servicio deseas?</h2>

            {loadingServices ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full" />
                </motion.div>
                <p className="text-gray-600 mt-4">Cargando servicios...</p>
              </motion.div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service: any, idx: number) => (
                  <motion.button
                    key={service.id}
                    onClick={() => handleSelectService(service.id)}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 border-2 border-gray-200 hover:border-teal-500 rounded-2xl p-6 text-left transition-all"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{service.nombre || service.name}</h3>
                        <p className="text-sm text-gray-600">⏱️ {service.duracion || service.duration} minutos</p>
                      </div>
                      <p className="font-bold text-teal-600 text-lg">${(service.precio || service.price)?.toLocaleString?.() || service.precio || service.price}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-600 text-lg">No hay servicios disponibles</p>
              </motion.div>
            )}

            <motion.button
              onClick={() => setStep('business')}
              className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Atrás
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Professional Selection Step */}
      {step === 'professional' && selectedProfessional === null && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Elige un profesional</h2>
            <p className="text-gray-600 text-center mb-8">
              Servicio: <span className="font-bold">{services?.find?.((s: any) => s.id === selectedService)?.nombre || services?.find?.((s: any) => s.id === selectedService)?.name}</span>
            </p>

            {loadingProfessionals ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full" />
                </motion.div>
                <p className="text-gray-600 mt-4">Cargando profesionales...</p>
              </motion.div>
            ) : professionals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professionals.map((prof: any, idx: number) => (
                  <motion.button
                    key={prof.id}
                    onClick={() => handleSelectProfessional(prof.id)}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 hover:from-teal-50 hover:to-teal-100 border-2 border-gray-200 hover:border-teal-500 rounded-2xl p-6 text-center transition-all"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    {prof.avatar ? (
                      <motion.div
                        className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Image
                          src={prof.avatar}
                          alt={prof.nombre || prof.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-teal-600 to-teal-900 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {(prof.nombre || prof.name)?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{prof.nombre || prof.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{prof.especialidades?.join?.(', ') || prof.specialties?.join?.(', ') || '-'}</p>
                    <p className="text-teal-600 font-semibold">⭐ {prof.rating || prof.calificacion || 4.8}</p>
                  </motion.button>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-600 text-lg">No hay profesionales disponibles</p>
              </motion.div>
            )}

            <motion.button
              onClick={() => setStep('service')}
              className="mt-8 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Atrás
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Date & Time Step */}
      {step === 'datetime' && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Elige fecha y hora</h2>

            {/* Calendar */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <motion.button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="px-4 py-2 hover:bg-gray-200 rounded-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  ← Anterior
                </motion.button>
                <h3 className="text-xl font-bold text-gray-900">
                  {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                </h3>
                <motion.button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="px-4 py-2 hover:bg-gray-200 rounded-lg transition"
                  whileHover={{ scale: 1.05 }}
                >
                  Siguiente →
                </motion.button>
              </div>

              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isDisabled = date < today;
                  const isSelected = selectedDate === `${String(day).padStart(2, '0')}/${String(currentMonth.getMonth() + 1).padStart(2, '0')}/${currentMonth.getFullYear()}`;

                  return (
                    <motion.button
                      key={day}
                      onClick={() => !isDisabled && handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`py-2 rounded-lg font-semibold transition ${
                        isDisabled
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'bg-teal-500 text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-teal-500'
                      }`}
                      whileHover={!isDisabled ? { scale: 1.05 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    >
                      {day}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Horarios disponibles</h3>
                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableSlots.map((slot) => (
                      <motion.button
                        key={slot.time}
                        onClick={() => !slot.occupied && setSelectedTime(slot.time)}
                        disabled={slot.occupied}
                        className={`py-3 rounded-lg font-semibold transition ${
                          slot.occupied
                            ? 'bg-red-100 text-red-500 cursor-not-allowed'
                            : selectedTime === slot.time
                            ? 'bg-teal-500 text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-teal-500'
                        }`}
                        whileHover={!slot.occupied ? { scale: 1.05 } : {}}
                        whileTap={!slot.occupied ? { scale: 0.95 } : {}}
                      >
                        {slot.time}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">El negocio no atiende este día</p>
                )}
              </motion.div>
            )}

            <motion.button
              onClick={() => setStep('phone')}
              disabled={!selectedDate || !selectedTime}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continuar
            </motion.button>
            <motion.button
              onClick={() => setStep('professional')}
              className="mt-3 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Atrás
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Phone Step */}
      {step === 'phone' && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with gradient and icon */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-8 md:px-12 py-12 text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💬
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-2">Confirma tu número</h2>
              <p className="text-teal-100 text-lg">Te enviaremos la confirmación por WhatsApp</p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              {/* Why we need it */}
              <div className="bg-teal-50 rounded-2xl p-6 mb-8 border-l-4 border-teal-500">
                <div className="flex gap-4">
                  <div className="text-2xl">✓</div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">Confirmación automática</p>
                    <p className="text-sm text-gray-600">Recibirás los detalles de tu cita, recordatorios y actualizaciones en WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Input with Country Picker */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">Número de WhatsApp</label>
                <div className="flex gap-3">
                  {/* Country Picker */}
                  <motion.div className="relative w-32">
                    <motion.button
                      onClick={() => setShowCountryPicker(!showCountryPicker)}
                      className="w-full flex items-center gap-2 px-4 py-4 border-2 border-gray-200 rounded-xl hover:border-teal-500 transition text-left"
                      whileHover={{ borderColor: '#14b8a6' }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {selectedCountry.flag}
                      </div>
                      <span className="font-semibold text-gray-900">+{selectedCountry.code}</span>
                    </motion.button>

                    {/* Dropdown */}
                    {showCountryPicker && (
                      <motion.div
                        className="absolute left-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 w-80"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="sticky top-0 bg-white p-3 border-b border-gray-200 rounded-t-xl">
                          <input
                            type="text"
                            placeholder="Buscar país..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm text-gray-900"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {filteredCountries.map((country) => (
                            <motion.button
                              key={country.code}
                              onClick={() => {
                                setSelectedCountry(country);
                                setShowCountryPicker(false);
                                setCountrySearch('');
                              }}
                              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0"
                              whileHover={{ paddingLeft: 24 }}
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {country.flag}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900">{country.name}</p>
                                <p className="text-xs text-gray-600">+{country.code}</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    placeholder="300 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-gray-900 text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">+{selectedCountry.code} {customerPhone}</p>
              </div>

              {/* Customer Name */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-900 mb-3">¿A nombre de quién es la cita?</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-gray-900 text-lg"
                  />
                  <div className="text-4xl pt-2">👤</div>
                </div>
              </div>

              {/* Security note */}
              <div className="flex gap-2 text-xs text-gray-600 mb-8">
                <span>🔒</span>
                <p>Tu número está seguro. Solo lo usaremos para tu cita</p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => setStep('confirm')}
                  disabled={!customerPhone || !customerName}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 rounded-xl transition text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continuar a Confirmación
                </motion.button>
                <motion.button
                  onClick={() => setStep('datetime')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-xl transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Volver
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Confirmation Step */}
      {step === 'confirm' && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Resumen de tu cita</h2>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 mb-8 space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">👤 NOMBRE DEL CLIENTE</p>
                <p className="text-lg font-bold text-gray-900">{customerName}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">SERVICIO</p>
                <p className="text-lg font-bold text-gray-900">
                  {services?.find?.((s: any) => s.id === selectedService)?.nombre ||
                   services?.find?.((s: any) => s.id === selectedService)?.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">PROFESIONAL</p>
                <p className="text-lg font-bold text-gray-900">
                  {professionals?.find?.((p: any) => p.id === selectedProfessional)?.nombre ||
                   professionals?.find?.((p: any) => p.id === selectedProfessional)?.name}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">FECHA Y HORA</p>
                <p className="text-lg font-bold text-gray-900">{selectedDate} - {selectedTime}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-600">📱 TELÉFONO DE CONTACTO</p>
                <p className="text-lg font-bold text-gray-900">+{selectedCountry.code} {customerPhone}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.button
              onClick={() => setStep('phone')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl mb-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Atrás
            </motion.button>

            <motion.button
              onClick={handleConfirmAppointment}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✓ Confirmar Cita
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Success Step */}
      {step === 'success' && (
        <motion.div
          className="max-w-4xl mx-auto px-4 py-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-600 px-8 md:px-12 py-16 text-center">
              <motion.div
                className="text-7xl mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                ✅
              </motion.div>
              <h2 className="text-4xl font-bold text-white mb-4">¡Cita confirmada!</h2>
              <p className="text-green-50 text-lg">Tu cita ha sido reservada exitosamente</p>
            </div>

            {/* Success Content */}
            <div className="p-8 md:p-12">
              <div className="bg-green-50 rounded-2xl p-8 mb-8 text-center">
                <p className="text-gray-700 mb-4">
                  Recibirás la confirmación y los detalles de tu cita en WhatsApp
                </p>
                <p className="text-sm text-gray-600">
                  📱 +{selectedCountry.code} {customerPhone}
                </p>
              </div>

              {/* Confirmation Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm text-gray-600">Nombre</p>
                    <p className="font-semibold text-gray-900">{customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">✂️</span>
                  <div>
                    <p className="text-sm text-gray-600">Servicio</p>
                    <p className="font-semibold text-gray-900">
                      {services?.find?.((s: any) => s.id === selectedService)?.nombre ||
                       services?.find?.((s: any) => s.id === selectedService)?.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600">Fecha y Hora</p>
                    <p className="font-semibold text-gray-900">{selectedDate} - {selectedTime}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-3 rounded-xl transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🏠 Volver al Inicio
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
