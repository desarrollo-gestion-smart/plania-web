'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Business {
  id: number;
  nombre: string;
  correo: string;
  numero: string;
  avatar: string;
  banner: string;
  isInitialSetupComplete: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bookingPath, setBookingPath] = useState('mi-negocio/agendar');
  const [isEditing, setIsEditing] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [totalCitas, setTotalCitas] = useState(0);
  const [citasEsteMes, setCitasEsteMes] = useState(0);
  const [citasRecientes, setCitasRecientes] = useState<any[]>([]);
  const [servicios, setServicios] = useState(0);
  const [profesionales, setProfesionales] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<'service' | 'professional' | 'datetime' | 'confirm'>(
    'service'
  );
  const [serviciosList, setServiciosList] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [availableSchedules, setAvailableSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCountry, setSelectedCountry] = useState({ code: '57', name: 'Colombia', emoji: 'CO' });
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceStep, setServiceStep] = useState<'info' | 'pricing' | 'confirm'>('info');
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [creatingService, setCreatingService] = useState(false);
  const [serviceSuccessModal, setServiceSuccessModal] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffFirstName, setStaffFirstName] = useState('');
  const [staffLastName, setStaffLastName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffAvatarFile, setStaffAvatarFile] = useState<File | null>(null);
  const [staffAvatarPreview, setStaffAvatarPreview] = useState('');
  const [staffCountry, setStaffCountry] = useState({ code: '57', name: 'Colombia', emoji: 'CO' });
  const [staffCountryPicker, setStaffCountryPicker] = useState(false);
  const [staffCountrySearch, setStaffCountrySearch] = useState('');
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [staffSuccessModal, setStaffSuccessModal] = useState(false);
  const staffCountryPickerRef = useRef<HTMLDivElement>(null);
  const countryPickerRef = useRef<HTMLDivElement>(null);

  const allCountries = [
    { code: '57', name: 'Colombia', emoji: 'CO' },
    { code: '58', name: 'Venezuela', emoji: 'VE' },
    { code: '56', name: 'Chile', emoji: 'CL' },
    { code: '55', name: 'Brasil', emoji: 'BR' },
    { code: '54', name: 'Argentina', emoji: 'AR' },
    { code: '51', name: 'Perú', emoji: 'PE' },
    { code: '591', name: 'Bolivia', emoji: 'BO' },
    { code: '592', name: 'Guyana', emoji: 'GY' },
    { code: '593', name: 'Ecuador', emoji: 'EC' },
    { code: '594', name: 'Guayana Francesa', emoji: 'GF' },
    { code: '595', name: 'Paraguay', emoji: 'PY' },
    { code: '598', name: 'Uruguay', emoji: 'UY' },
    { code: '505', name: 'Nicaragua', emoji: 'NI' },
    { code: '503', name: 'El Salvador', emoji: 'SV' },
    { code: '502', name: 'Guatemala', emoji: 'GT' },
    { code: '504', name: 'Honduras', emoji: 'HN' },
    { code: '507', name: 'Panamá', emoji: 'PA' },
    { code: '506', name: 'Costa Rica', emoji: 'CR' },
    { code: '1', name: 'Estados Unidos', emoji: 'US' },
    { code: '1', name: 'Canadá', emoji: 'CA' },
    { code: '52', name: 'México', emoji: 'MX' },
    { code: '34', name: 'España', emoji: 'ES' },
    { code: '44', name: 'Reino Unido', emoji: 'GB' },
    { code: '33', name: 'Francia', emoji: 'FR' },
    { code: '39', name: 'Italia', emoji: 'IT' },
    { code: '49', name: 'Alemania', emoji: 'DE' },
    { code: '31', name: 'Países Bajos', emoji: 'NL' },
    { code: '41', name: 'Suiza', emoji: 'CH' },
    { code: '43', name: 'Austria', emoji: 'AT' },
    { code: '46', name: 'Suecia', emoji: 'SE' },
    { code: '47', name: 'Noruega', emoji: 'NO' },
    { code: '45', name: 'Dinamarca', emoji: 'DK' },
    { code: '32', name: 'Bélgica', emoji: 'BE' },
    { code: '353', name: 'Irlanda', emoji: 'IE' },
    { code: '30', name: 'Grecia', emoji: 'GR' },
    { code: '358', name: 'Finlandia', emoji: 'FI' },
    { code: '48', name: 'Polonia', emoji: 'PL' },
    { code: '420', name: 'República Checa', emoji: 'CZ' },
    { code: '36', name: 'Hungría', emoji: 'HU' },
    { code: '40', name: 'Rumania', emoji: 'RO' },
    { code: '7', name: 'Rusia', emoji: 'RU' },
    { code: '82', name: 'Corea del Sur', emoji: 'KR' },
    { code: '81', name: 'Japón', emoji: 'JP' },
    { code: '86', name: 'China', emoji: 'CN' },
    { code: '91', name: 'India', emoji: 'IN' },
    { code: '380', name: 'Ucrania', emoji: 'UA' },
    { code: '61', name: 'Australia', emoji: 'AU' },
  ];

  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.includes(countrySearch)
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://plania.ejesatelital.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://plania.ejesatelital.com/api';

  useEffect(() => {
    const token = localStorage.getItem('planiaToken');
    const businessData = localStorage.getItem('business');

    if (!token || !businessData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedBusiness = JSON.parse(businessData);
      setBusiness(parsedBusiness);

      // Load saved booking path from localStorage
      const saved = localStorage.getItem('bookingPath');
      if (saved) {
        setBookingPath(saved);
      }

      // Fetch appointments, services and staff data
      fetchAppointments(parsedBusiness.id, token);
      fetchServicios(parsedBusiness.id, token);
      fetchStaff(parsedBusiness.id, token);
    } catch (err) {
      console.error('Error parsing business data:', err);
      router.push('/auth/login');
    }
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryPickerRef.current && !countryPickerRef.current.contains(event.target as Node)) {
        setShowCountryPicker(false);
      }
    };

    if (showCountryPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCountryPicker]);

  const fetchAppointments = async (businessId: number, token: string) => {
    try {
      const appointmentsUrl = `${apiUrl}/appointments/${businessId}`;
      console.log('📤 Obteniendo citas de:', appointmentsUrl);

      const response = await fetch(appointmentsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener citas');
      }

      const data = await response.json();
      console.log('✅ Citas obtenidas:', data);

      // La respuesta viene como { appointments: [...] }
      const appointments = data.appointments || data || [];

      // Contar total de citas
      const total = appointments.length || 0;
      setTotalCitas(total);

      // Contar citas de este mes
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthCitas = appointments.filter((cita: any) => {
        // La fecha viene como 'DD/MM/YYYY'
        const [day, month, year] = cita.staffdates.split('/').map(Number);
        return (month - 1) === currentMonth && year === currentYear;
      }).length;
      setCitasEsteMes(monthCitas);

      // Guardar últimas 5 citas recientes
      const recentAppointments = appointments.slice(0, 5);
      setCitasRecientes(recentAppointments);

      setLoading(false);
    } catch (err) {
      console.error('❌ Error al obtener citas:', err);
    }
  };

  const fetchServicios = async (businessId: number, token: string) => {
    try {
      const serviciosUrl = `${apiUrl}/services/${businessId}?category=service`;
      console.log('📤 Obteniendo servicios de:', serviciosUrl);

      const response = await fetch(serviciosUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener servicios');
      }

      const data = await response.json();
      console.log('✅ Servicios obtenidos:', data);

      // Contar servicios - la respuesta podría ser un array o un objeto con array
      const serviciosList = data.services || data || [];
      const total = Array.isArray(serviciosList) ? serviciosList.length : 0;
      setServicios(total);
    } catch (err) {
      console.error('❌ Error al obtener servicios:', err);
    }
  };

  const fetchStaff = async (businessId: number, token: string) => {
    try {
      const staffUrl = `${apiUrl}/get-staff/${businessId}`;
      console.log('📤 Obteniendo staff de:', staffUrl);

      const response = await fetch(staffUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener staff');
      }

      const data = await response.json();
      console.log('✅ Staff obtenido:', data);

      // La respuesta viene como { staff: [...] }
      const staffList = data.staff || [];
      const total = Array.isArray(staffList) ? staffList.length : 0;
      setProfesionales(total);
    } catch (err) {
      console.error('❌ Error al obtener staff:', err);
    }
  };

  const handleCopyLink = () => {
    const businessId = business?.id;
    const link = `${appUrl}/${businessId}/${bookingPath}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSavePath = () => {
    localStorage.setItem('bookingPath', bookingPath);
    setIsEditing(false);
  };

  const handleOpenNewCita = async () => {
    if (!business) return;
    setModalOpen(true);
    setStep('service');
    setLoadingModal(true);

    try {
      const token = localStorage.getItem('planiaToken');

      // Obtener servicios
      const serviciosUrl = `${apiUrl}/services/${business.id}?category=service`;
      console.log('📤 Obteniendo servicios para nueva cita:', serviciosUrl);

      const serviciosResponse = await fetch(serviciosUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!serviciosResponse.ok) throw new Error('Error al obtener servicios');

      const serviciosData = await serviciosResponse.json();
      console.log('✅ Servicios obtenidos:', serviciosData);

      const services = serviciosData.services || serviciosData || [];
      setServiciosList(Array.isArray(services) ? services : []);

      // Obtener staff
      const staffUrl = `${apiUrl}/get-staff/${business.id}`;
      console.log('📤 Obteniendo staff para nueva cita:', staffUrl);

      const staffResponse = await fetch(staffUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!staffResponse.ok) throw new Error('Error al obtener staff');

      const staffData = await staffResponse.json();
      console.log('✅ Staff obtenido:', staffData);

      const staff = staffData.staff || [];
      setStaffList(Array.isArray(staff) ? staff : []);
    } catch (err) {
      console.error('❌ Error al obtener datos para nueva cita:', err);
    } finally {
      setLoadingModal(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setStep('service');
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedDate('');
    setSelectedTime('');
    setCustomerPhone('');
    setCustomerName('');
  };

  const handleCloseServiceModal = () => {
    setServiceModalOpen(false);
    setServiceStep('info');
    setServiceName('');
    setServiceType('');
    setServiceCategory('');
    setServiceDescription('');
    setServiceDuration('');
    setServicePrice('');
  };

  const handleCreateService = async () => {
    if (!business || !serviceName || !serviceType || !serviceCategory || !serviceDuration || !servicePrice) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setCreatingService(true);
    try {
      const token = localStorage.getItem('planiaToken');
      const serviceData = {
        businessId: business.id,
        name: serviceName,
        type: serviceType,
        category: serviceCategory,
        description: serviceDescription,
        duration: parseInt(serviceDuration),
        price: parseFloat(servicePrice),
      };

      console.log('📤 Creando servicio:', serviceData);

      const serviceUrl = `${apiUrl}/services`;
      const response = await fetch(serviceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serviceData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Respuesta del servidor:', errorText);
        throw new Error('Error al crear servicio');
      }

      const result = await response.json();
      console.log('✅ Servicio creado:', result);

      // Reset form
      setServiceName('');
      setServiceType('');
      setServiceCategory('');
      setServiceDescription('');
      setServiceDuration('');
      setServicePrice('');

      // Refresh services list
      fetchServicios(business.id, token!);

      // Show success modal instead of alert
      setServiceSuccessModal(true);
    } catch (err) {
      console.error('❌ Error al crear servicio:', err);
      alert('Error al crear el servicio. Por favor intenta de nuevo.');
    } finally {
      setCreatingService(false);
    }
  };

  const handleCreateStaff = async () => {
    if (!business || !staffFirstName || !staffLastName || !staffPhone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setCreatingStaff(true);
    try {
      const token = localStorage.getItem('planiaToken');

      // Step 1: Create staff with basic info
      const staffData = {
        businessId: business.id,
        nombre: staffFirstName,
        apellido: staffLastName,
        numero: staffPhone,
      };

      console.log('📤 Creando profesional:', staffData);

      const staffUrl = `${apiUrl}/add-staff`;
      const response = await fetch(staffUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(staffData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Respuesta del servidor:', errorText);
        throw new Error('Error al crear profesional');
      }

      const result = await response.json();
      const staffId = result.staff?.id || result.id;
      console.log('✅ Profesional creado:', result);

      // Step 2: Upload avatar if provided
      if (staffAvatarFile && staffId) {
        const avatarFormData = new FormData();
        avatarFormData.append('image', staffAvatarFile);
        avatarFormData.append('staffId', staffId.toString());

        console.log('📤 Subiendo avatar para staffId:', staffId);

        const avatarUrl = `${apiUrl}/upload-staff-avatar`;
        const avatarResponse = await fetch(avatarUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: avatarFormData,
        });

        if (!avatarResponse.ok) {
          console.warn('⚠️ Avatar no se subió correctamente');
        } else {
          console.log('✅ Avatar subido exitosamente');
        }
      }

      // Reset form
      setStaffFirstName('');
      setStaffLastName('');
      setStaffPhone('');
      setStaffAvatarFile(null);
      setStaffAvatarPreview('');
      setStaffCountry({ code: '57', name: 'Colombia', emoji: 'CO' });

      // Refresh staff list
      if (business) {
        const token = localStorage.getItem('planiaToken');
        if (token) {
          fetchStaff(business.id, token);
        }
      }

      // Show success modal
      setStaffSuccessModal(true);
    } catch (err) {
      console.error('❌ Error al crear profesional:', err);
      alert('Error al crear el profesional. Por favor intenta de nuevo.');
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleCloseStaffModal = () => {
    setStaffModalOpen(false);
    setStaffFirstName('');
    setStaffLastName('');
    setStaffPhone('');
    setStaffAvatarFile(null);
    setStaffAvatarPreview('');
    setStaffCountry({ code: '57', name: 'Colombia', emoji: 'CO' });
    setStaffCountrySearch('');
  };

  const generateTimeSlots = (start: string, until: string, breakStart: string | null, breakUntil: string | null) => {
    const slots = [];
    const [startHour, startMin] = start.split(':').map(Number);
    const [untilHour, untilMin] = until.split(':').map(Number);
    const [breakStartHour, breakStartMin] = breakStart ? breakStart.split(':').map(Number) : [null, null];
    const [breakUntilHour, breakUntilMin] = breakUntil ? breakUntil.split(':').map(Number) : [null, null];

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < untilHour || (currentHour === untilHour && currentMin < untilMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;

      // Check if time is in break period
      const isInBreak = breakStartHour !== null && breakUntilHour !== null && breakStartMin !== null && breakUntilMin !== null &&
        (currentHour > breakStartHour || (currentHour === breakStartHour && currentMin >= breakStartMin)) &&
        (currentHour < breakUntilHour || (currentHour === breakUntilHour && currentMin < breakUntilMin));

      if (!isInBreak) {
        slots.push({ hora: timeStr, time: timeStr });
      }

      // Add 30 minutes
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin -= 60;
        currentHour += 1;
      }
    }

    return slots;
  };

  const createAppointment = async () => {
    if (!business || !selectedService || !selectedStaff) {
      console.error('❌ Faltan datos para crear la cita');
      return false;
    }

    try {
      const token = localStorage.getItem('planiaToken');

      // Format date from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = selectedDate.split('-');
      const formattedDate = `${day}/${month}/${year}`;

      // Prepare appointment data
      const appointmentData = {
        businessId: business.id,
        staffId: selectedStaff.id.toString(),
        date: formattedDate,
        horario: selectedTime,
        serviceId: selectedService.id,
        name: customerName,
      };

      console.log('📤 Creando cita manual:', appointmentData);

      // Create appointment
      const appointmentUrl = `${apiUrl}/appointments/manual`;
      const appointmentResponse = await fetch(appointmentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!appointmentResponse.ok) {
        throw new Error('Error al crear la cita');
      }

      const appointmentResult = await appointmentResponse.json();
      console.log('✅ Cita creada:', appointmentResult);

      // Send WhatsApp message
      const businessName = business.nombre || 'Nuestro negocio';
      const serviceName = selectedService.nombre || selectedService.name || 'Servicio';
      const staffName = selectedStaff.nombre || selectedStaff.name || 'Nuestro equipo';
      const [dateYear, dateMonth, dateDay] = selectedDate.split('-');
      const displayDate = `${dateDay}/${dateMonth}/${dateYear}`;

      const whatsappMessage = `Alerta del sistema de rastreo de Eje Satelital
¡Hola ${customerName}! 🎉.Tu cita ha sido confirmada con éxito..📅 Fecha: ${displayDate}.⏰ Hora: ${selectedTime}.✂️ Servicio: ${serviceName}.👤 ${staffName}: ${staffName}.📍 Lugar: ${businessName}.Te esperamos 😎
Mas información consultar en el portal de rastreo`;

      // Send WhatsApp using the API
      const whatsappUrl = `https://apps.ejesatelital.com/api/messaging/whatsapp/send?apikey=4acd1256-a3f5-4d17-b3fb-58f4da702c1e&to=${selectedCountry.code}${customerPhone}&message='${encodeURIComponent(whatsappMessage)}'&company=2`;

      console.log('📱 Enviando WhatsApp:', whatsappUrl);

      const whatsappResponse = await fetch(whatsappUrl);

      if (!whatsappResponse.ok) {
        console.warn('⚠️ Error al enviar WhatsApp, pero la cita fue creada');
      } else {
        console.log('✅ WhatsApp enviado exitosamente');
      }

      return true;
    } catch (err) {
      console.error('❌ Error al crear cita o enviar WhatsApp:', err);
      return false;
    }
  };

  const fetchAvailableSchedules = async (businessId: number, selectedDateStr: string) => {
    if (!business) return;
    setLoadingSchedules(true);
    try {
      const token = localStorage.getItem('planiaToken');
      const schedulesUrl = `${apiUrl}/schedules/${businessId}`;
      console.log('📤 Obteniendo horarios disponibles de:', schedulesUrl);

      const response = await fetch(schedulesUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Error al obtener horarios');

      const data = await response.json();
      console.log('✅ Horarios obtenidos:', data);

      const schedulesList = data.schedules || [data] || [];
      const schedule = Array.isArray(schedulesList) ? schedulesList[0] : schedulesList;

      if (schedule && schedule.days) {
        // Get day of week from selected date
        const date = new Date(selectedDateStr);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        const daySchedule = schedule.days[dayName];

        if (daySchedule && daySchedule.active) {
          const slots = generateTimeSlots(daySchedule.start, daySchedule.until, daySchedule.breakStart, daySchedule.breakUntil);
          setAvailableSchedules(slots);
        } else {
          setAvailableSchedules([]);
        }
      }
    } catch (err) {
      console.error('❌ Error al obtener horarios:', err);
      setAvailableSchedules([]);
    } finally {
      setLoadingSchedules(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Citas', value: totalCitas.toString(), icon: '📅', gradient: 'from-teal-400 to-teal-600', lightGradient: 'from-teal-50 to-teal-100' },
    { label: 'Citas Este Mes', value: citasEsteMes.toString(), icon: '📊', gradient: 'from-orange-400 to-orange-600', lightGradient: 'from-orange-50 to-orange-100' },
    { label: 'Servicios', value: servicios.toString(), icon: '🔧', gradient: 'from-blue-400 to-blue-600', lightGradient: 'from-blue-50 to-blue-100' },
    { label: 'Profesionales', value: profesionales.toString(), icon: '👥', gradient: 'from-green-400 to-green-600', lightGradient: 'from-green-50 to-green-100' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, easing: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="space-y-8 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Banner */}
      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 text-white p-8 md:p-12 shadow-2xl"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <motion.div
          className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            ¡Bienvenido, {business?.nombre}! 🎉
          </h1>
          <p className="text-teal-100 text-lg">Gestiona tus servicios, profesionales y citas en un solo lugar</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.lightGradient} p-6 shadow-lg cursor-pointer group`}
            variants={itemVariants}
            whileHover={{ y: -8, boxShadow: '0 30px 60px rgba(26, 188, 156, 0.3)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
          >
            {/* Background gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{card.label}</p>
                  <motion.p
                    className={`text-5xl font-bold mt-3 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  >
                    {card.value}
                  </motion.p>
                </div>
                <motion.div
                  className="text-5xl"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ delay: index * 0.2, duration: 2, repeat: Infinity }}
                >
                  {card.icon}
                </motion.div>
              </div>
              <motion.div
                className={`w-12 h-1 bg-gradient-to-r ${card.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={containerVariants}>
        {/* Quick Actions */}
        <motion.div
          className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg p-8 border border-gray-100"
          variants={itemVariants}
          whileHover={{ boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white text-xl">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="space-y-3">
            {[
              { text: 'Nueva Cita', icon: '📅', onClick: handleOpenNewCita },
              { text: 'Agregar Servicio', icon: '🔧', onClick: () => setServiceModalOpen(true) },
              { text: 'Agregar Profesional', icon: '👥', onClick: () => setStaffModalOpen(true) },
            ].map((action, index) => (
              <motion.button
                key={action.text}
                onClick={action.onClick}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span>{action.icon}</span>
                <span>+ {action.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Booking Link */}
        <motion.div
          className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg p-8 border border-gray-100"
          variants={itemVariants}
          whileHover={{ boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-xl">
              🔗
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Link de Agendamiento</h3>
          </div>
          <p className="text-gray-600 mb-4 font-medium">Comparte este link con tus clientes:</p>
          <motion.div
            className="flex gap-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600 font-mono">{appUrl}/{business?.id}/</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={bookingPath}
                    onChange={(e) => setBookingPath(e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-teal-500 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="mi-negocio/agendar"
                  />
                ) : (
                  <span className="flex-1 text-sm text-gray-700 font-mono bg-gray-100 px-3 py-2 rounded-lg">{bookingPath}</span>
                )}
                <motion.button
                  onClick={() => isEditing ? handleSavePath() : setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isEditing ? '✓ Guardar' : '✏️ Editar'}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500">Ejemplo: {appUrl}/{business?.id}/mi-negocio/agendar</p>
            </div>
          </motion.div>
          <motion.button
            onClick={handleCopyLink}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? '✓ Link Copiado al Portapapeles' : '📋 Copiar Link Completo'}
          </motion.button>
          <p className="text-sm text-gray-500 mt-4">Los clientes podrán agendar fácilmente desde este link</p>
        </motion.div>
      </motion.div>

      {/* Recent Appointments */}
      <motion.div
        className="rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg p-8 border border-gray-100"
        variants={itemVariants}
        whileHover={{ boxShadow: '0 30px 60px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl">
            📋
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Citas Recientes</h3>
        </div>

        {citasRecientes.length > 0 ? (
          <div className="space-y-3">
            {citasRecientes.filter((cita) => {
              if (!cita.staffdates) return false;
              const [day, month, year] = cita.staffdates.split('/');
              const citaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return citaDate >= today;
            }).map((cita, idx) => (
              <motion.div
                key={cita.idappointment || idx}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer Info */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">CLIENTE</p>
                    <p className="text-lg font-bold text-gray-900">{cita.userNombre || 'Sin nombre'}</p>
                  </div>

                  {/* Service Info */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">SERVICIO</p>
                    <p className="text-lg font-bold text-gray-900">{cita.serviceType || 'Sin servicio'}</p>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">FECHA Y HORA</p>
                    <p className="text-lg font-bold text-gray-900">
                      {cita.staffdates && cita.staffAppointmentsHour
                        ? (() => {
                            const [day, month, year] = cita.staffdates.split('/');
                            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                            const formatted = dateObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
                            return `${formatted} - ${cita.staffAppointmentsHour}`;
                          })()
                        : 'Sin programar'}
                    </p>
                  </div>
                </div>

                {/* Professional & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">PROFESIONAL</p>
                    <p className="text-sm text-gray-900">{cita.staffNombre ? `${cita.staffNombre} ${cita.staffApellido || ''}` : '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">TELÉFONO CLIENTE</p>
                    <p className="text-sm text-gray-900">{cita.userNumero || '-'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-6xl mb-3">📅</div>
            <p className="font-medium">No hay citas registradas aún</p>
            <p className="text-sm mt-2">Las citas aparecerán aquí una vez que los clientes comiencen a agendar</p>
          </motion.div>
        )}
      </motion.div>

      {/* Modal Nueva Cita */}
      {modalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 1rem)' }}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold">Nueva Cita</h2>
              <button
                onClick={handleCloseModal}
                className="text-2xl hover:bg-teal-700 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                {['service', 'professional', 'datetime', 'confirm'].map((s, idx) => (
                  <div key={s} className="flex items-center flex-1">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
                        ['service', 'professional', 'datetime', 'confirm'].indexOf(step) >= idx
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </motion.div>
                    {idx < 3 && (
                      <div
                        className={`flex-1 h-1 mx-1 ${
                          ['service', 'professional', 'datetime', 'confirm'].indexOf(step) > idx
                            ? 'bg-teal-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content - No scroll */}
            <div className="flex-1 overflow-hidden p-4">
              {/* Step 1: Service Selection */}
              {step === 'service' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">¿Qué servicio deseas agendar?</h3>

                  {loadingModal ? (
                    <div className="flex justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full"
                      />
                    </div>
                  ) : serviciosList.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {serviciosList.map((service: any) => (
                        <motion.button
                          key={service.id}
                          onClick={() => {
                            setSelectedService(service);
                            setStep('professional');
                          }}
                          className={`p-5 rounded-2xl text-left border-2 transition-all ${
                            selectedService?.id === service.id
                              ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100'
                              : 'border-gray-200 hover:border-teal-500 hover:bg-gray-50'
                          }`}
                          whileHover={{ scale: 1.02, y: -2 }}
                        >
                          <div className="flex items-start justify-between gap-4">
                            {/* Left: Name and Description */}
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 mb-1">{service.nombre || service.name}</h4>
                              {(service.descripcion || service.description) && (
                                <p className="text-sm text-gray-600 mb-2">{service.descripcion || service.description}</p>
                              )}

                              {/* Duration and Price Row */}
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                  <span className="text-lg">⏱️</span>
                                  <span className="font-semibold text-gray-700">{service.duracion || service.duration} min</span>
                                </div>
                                <div className="w-px h-6 bg-gray-300" />
                                <div className="flex items-center gap-1">
                                  <span className="text-lg">💵</span>
                                  <span className="font-bold text-teal-600 text-lg">${service.precio || service.price}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right: Check mark if selected */}
                            {selectedService?.id === service.id && (
                              <motion.div
                                className="text-3xl text-teal-500 flex-shrink-0"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay servicios disponibles</p>
                    </div>
                  )}

                  <motion.button
                    onClick={handleCloseModal}
                    className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancelar
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Staff Selection */}
              {step === 'professional' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Elige un profesional</h3>
                  {selectedService && (
                    <p className="text-sm text-gray-600 mb-6">
                      Servicio: <span className="font-bold">{selectedService.nombre || selectedService.name}</span>
                    </p>
                  )}

                  {loadingModal ? (
                    <div className="flex justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-10 h-10 border-4 border-teal-200 border-t-teal-500 rounded-full"
                      />
                    </div>
                  ) : staffList.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {staffList.map((staff: any) => (
                        <motion.button
                          key={staff.id}
                          onClick={() => {
                            setSelectedStaff(staff);
                            setStep('datetime');
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-center ${
                            selectedStaff?.id === staff.id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-gray-200 hover:border-teal-500'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {/* Avatar */}
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center text-white text-2xl border-2 border-white shadow-md">
                            {staff.avatar ? (
                              <img
                                src={staff.avatar}
                                alt={staff.nombre || staff.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{(staff.nombre || staff.name || 'P').charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <h4 className="font-bold text-gray-900">{staff.nombre || staff.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {staff.especialidades ? staff.especialidades.join(', ') : 'Profesional'}
                          </p>
                          {staff.rating && (
                            <p className="text-teal-600 font-semibold text-sm mt-2">⭐ {staff.rating}</p>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay profesionales disponibles</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setStep('service')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      ← Atrás
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Customer Info */}
              {step === 'datetime' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Datos de contacto</h3>
                  {selectedStaff && (
                    <p className="text-sm text-gray-600 mb-6">
                      Profesional: <span className="font-bold">{selectedStaff.nombre || selectedStaff.name}</span>
                    </p>
                  )}

                  <div className="space-y-3 mb-4">
                    {/* Phone Number Input with Country Picker */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tu número de WhatsApp</label>
                      <div className="flex gap-2 items-center relative" ref={countryPickerRef}>
                        {/* Country Picker Button */}
                        <motion.button
                          onClick={() => setShowCountryPicker(!showCountryPicker)}
                          className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-teal-100 px-4 py-3 rounded-xl border-2 border-teal-300 hover:border-teal-500 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {selectedCountry.emoji}
                          </div>
                          <span className="text-sm font-semibold text-gray-700">+{selectedCountry.code}</span>
                        </motion.button>

                        {/* Country Dropdown */}
                        {showCountryPicker && (
                          <motion.div
                            className="absolute left-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 w-80"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {/* Search Input */}
                            <div className="sticky top-0 bg-white p-3 border-b border-gray-200 rounded-t-xl">
                              <input
                                type="text"
                                placeholder="Buscar país..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm"
                                autoFocus
                              />
                            </div>

                            {/* Countries List */}
                            <div className="max-h-80 overflow-y-auto">
                              {filteredCountries.length > 0 ? (
                                filteredCountries.map((country, idx) => (
                                  <motion.button
                                    key={`${country.code}-${idx}`}
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setShowCountryPicker(false);
                                      setCountrySearch('');
                                    }}
                                    className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                                      selectedCountry.code === country.code && selectedCountry.name === country.name ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                                    }`}
                                    whileHover={{ paddingLeft: 24 }}
                                  >
                                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                      {country.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-900">{country.name}</p>
                                      <p className="text-xs text-gray-600">+{country.code}</p>
                                    </div>
                                    {selectedCountry.code === country.code && selectedCountry.name === country.name && (
                                      <span className="text-teal-500 font-bold text-lg flex-shrink-0">✓</span>
                                    )}
                                  </motion.button>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-center text-gray-500">
                                  <p>No se encontraron países</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Phone Input */}
                        <input
                          type="tel"
                          placeholder="3001234567"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                        />
                        <div className="text-4xl">📱</div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Te enviaremos un código de confirmación por WhatsApp</p>
                    </div>

                    {/* Customer Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">¿A nombre de quién es la cita?</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                        />
                        <div className="text-4xl pt-2">👤</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setStep('professional')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ← Atrás
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (customerPhone && customerName) {
                          const today = new Date().toISOString().split('T')[0];
                          fetchAvailableSchedules(business!.id, today);
                          setStep('confirm');
                        }
                      }}
                      disabled={!customerPhone || !customerName}
                      className={`flex-1 font-semibold py-3 rounded-xl transition-colors ${
                        customerPhone && customerName
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={customerPhone && customerName ? { scale: 1.05 } : {}}
                      whileTap={customerPhone && customerName ? { scale: 0.95 } : {}}
                    >
                      Continuar
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Confirmation with Calendar */}
              {step === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Selecciona fecha y hora para confirmar</h3>

                  <div className="space-y-3 mb-4">
                    {/* Calendar */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Selecciona una fecha</label>
                      <motion.div
                        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                          <motion.button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                            className="px-3 py-2 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            ← Anterior
                          </motion.button>
                          <h4 className="text-lg font-bold text-gray-900">
                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                          </h4>
                          <motion.button
                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                            className="px-3 py-2 hover:bg-gray-200 rounded-lg text-gray-700 font-semibold"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Siguiente →
                          </motion.button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
                            <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-2">
                          {(() => {
                            const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                            const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                            const daysInMonth = lastDay.getDate();
                            const startingDayOfWeek = firstDay.getDay();
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const days = [];

                            // Empty cells before month starts
                            for (let i = 0; i < startingDayOfWeek; i++) {
                              days.push(null);
                            }

                            // Days of month
                            for (let day = 1; day <= daysInMonth; day++) {
                              days.push(day);
                            }

                            return days.map((day, idx) => {
                              if (day === null) {
                                return <div key={`empty-${idx}`} />;
                              }

                              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                              const isToday = dateObj.getTime() === today.getTime();
                              const isPast = dateObj < today;
                              const dateString = dateObj.toISOString().split('T')[0];
                              const isSelected = selectedDate === dateString;

                              return (
                                <motion.button
                                  key={day}
                                  onClick={() => {
                                    if (!isPast) {
                                      setSelectedDate(dateString);
                                      fetchAvailableSchedules(business!.id, dateString);
                                    }
                                  }}
                                  disabled={isPast}
                                  className={`py-2 rounded-lg font-semibold transition-all ${
                                    isPast
                                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                                      : isSelected
                                      ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg'
                                      : isToday
                                      ? 'bg-teal-100 border-2 border-teal-500 text-gray-900'
                                      : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-teal-500'
                                  }`}
                                  whileHover={!isPast ? { scale: 1.05 } : {}}
                                  whileTap={!isPast ? { scale: 0.95 } : {}}
                                >
                                  {day}
                                </motion.button>
                              );
                            });
                          })()}
                        </div>
                      </motion.div>
                    </div>

                    {/* Available Times */}
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Horarios disponibles</label>
                        {loadingSchedules ? (
                          <div className="flex justify-center py-8">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-8 h-8 border-4 border-teal-200 border-t-teal-500 rounded-full"
                            />
                          </div>
                        ) : availableSchedules.length > 0 ? (
                          <div className="grid grid-cols-4 gap-2">
                            {availableSchedules.map((schedule: any, idx: number) => (
                              <motion.button
                                key={idx}
                                onClick={() => setSelectedTime(schedule.hora || schedule.time)}
                                className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all border-2 ${
                                  selectedTime === (schedule.hora || schedule.time)
                                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-600'
                                    : 'border-gray-200 bg-white text-gray-900 hover:border-teal-500'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {schedule.hora || schedule.time}
                              </motion.button>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
                            <p>No hay horarios disponibles para esta fecha</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Summary */}
                  {selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 mb-6 bg-teal-50 rounded-2xl p-6 border-2 border-teal-200"
                    >
                      <h4 className="text-lg font-bold text-gray-900 mb-4">Resumen de tu cita</h4>

                      {/* Customer Name */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Cita para</p>
                          <p className="font-bold text-gray-900">👤 {customerName}</p>
                        </div>
                      </div>

                      {/* Service */}
                      <div className="flex items-start justify-between pt-4 border-t border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Servicio</p>
                          <p className="font-bold text-gray-900">{selectedService?.nombre || selectedService?.name}</p>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span>⏱️ {selectedService?.duracion || selectedService?.duration} min</span>
                            <span>💵 ${selectedService?.precio || selectedService?.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Professional */}
                      <div className="flex items-start justify-between pt-4 border-t border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Profesional</p>
                          <p className="font-bold text-gray-900">{selectedStaff?.nombre || selectedStaff?.name}</p>
                          {selectedStaff?.rating && (
                            <p className="text-sm text-teal-600 mt-1">⭐ {selectedStaff.rating}</p>
                          )}
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="flex items-start justify-between pt-4 border-t border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Fecha y Hora</p>
                          <p className="font-bold text-gray-900">
                            📅 {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="font-bold text-gray-900">🕐 {selectedTime}</p>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="flex items-start justify-between pt-4 border-t border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Contacto WhatsApp</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl">📱</span>
                            <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {selectedCountry.emoji}
                            </div>
                            <p className="font-bold text-gray-900">+{selectedCountry.code} {customerPhone}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Info Message */}
                  <motion.div
                    className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-sm text-blue-700">
                      <span className="font-bold">ℹ️ Confirmación por WhatsApp:</span> Recibirás un código de confirmación en tu WhatsApp. Ingresa el código para completar la cita.
                    </p>
                  </motion.div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setStep('datetime')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={creatingAppointment}
                    >
                      ← Atrás
                    </motion.button>
                    <motion.button
                      onClick={async () => {
                        setCreatingAppointment(true);
                        const success = await createAppointment();
                        setCreatingAppointment(false);

                        if (success) {
                          handleCloseModal();
                          // Refresh data
                          if (business) {
                            const token = localStorage.getItem('planiaToken');
                            if (token) {
                              fetchAppointments(business.id, token);
                            }
                          }
                        } else {
                          alert('Error al crear la cita. Por favor intenta de nuevo.');
                        }
                      }}
                      disabled={creatingAppointment || !selectedDate || !selectedTime}
                      className={`flex-1 font-semibold py-3 rounded-xl transition-all ${
                        !creatingAppointment && selectedDate && selectedTime
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                      whileHover={!creatingAppointment && selectedDate && selectedTime ? { scale: 1.05 } : {}}
                      whileTap={!creatingAppointment && selectedDate && selectedTime ? { scale: 0.95 } : {}}
                    >
                      {creatingAppointment ? (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Creando cita...
                        </motion.span>
                      ) : (
                        '✓ Confirmar Cita'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Agregar Servicio */}
      {serviceModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 1rem)' }}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold">Agregar Servicio</h2>
              <button
                onClick={handleCloseServiceModal}
                className="text-2xl hover:bg-teal-700 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-center gap-0 max-w-2xl mx-auto">
                {['info', 'pricing', 'confirm'].map((s, idx) => (
                  <div key={s} className="flex items-center flex-1">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        ['info', 'pricing', 'confirm'].indexOf(serviceStep) >= idx
                          ? 'bg-teal-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {idx + 1}
                    </motion.div>
                    {idx < 2 && (
                      <div
                        className={`flex-1 h-1 mx-3 ${
                          ['info', 'pricing', 'confirm'].indexOf(serviceStep) > idx
                            ? 'bg-teal-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Content - No scroll */}
            <div className="flex-1 overflow-hidden p-4">
              {/* Step 1: Service Info */}
              {serviceStep === 'info' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Información del Servicio</h3>

                  <div className="space-y-3 mb-4">
                    {/* Service Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Servicio</label>
                      <input
                        type="text"
                        placeholder="Ej: Corte de Cabello"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                      />
                    </div>

                    {/* Service Type Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Tipo de Servicio</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { value: 'belleza', label: 'Belleza', emoji: '💄' },
                          { value: 'barberia', label: 'Barbería', emoji: '💈' },
                          { value: 'peluqueria', label: 'Peluquería', emoji: '💇' },
                          { value: 'manicura', label: 'Manicura', emoji: '💅' },
                          { value: 'masaje', label: 'Masaje', emoji: '🧘' },
                          { value: 'salud', label: 'Salud', emoji: '⚕️' },
                          { value: 'fitness', label: 'Fitness', emoji: '💪' },
                          { value: 'otro', label: 'Otro', emoji: '⭐' },
                        ].map((type) => (
                          <motion.button
                            key={type.value}
                            onClick={() => setServiceType(type.value)}
                            className={`p-3 rounded-xl border-2 transition-all text-center ${
                              serviceType === type.value
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-500 bg-white'
                            }`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">{type.emoji}</div>
                            <p className="font-semibold text-gray-900 text-xs">{type.label}</p>
                            {serviceType === type.value && (
                              <motion.div
                                className="text-teal-500 text-sm mt-1"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                ✓
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">¿Es un servicio o promoción?</label>
                      <div className="flex gap-2">
                        {[
                          { value: 'service', label: 'Servicio', emoji: '🛍️' },
                          { value: 'promotion', label: 'Promoción', emoji: '🎉' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            onClick={() => setServiceCategory(option.value)}
                            className={`flex-1 p-2 rounded-lg border-2 transition-all text-center ${
                              serviceCategory === option.value
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 hover:border-teal-500'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-2xl mb-1">{option.emoji}</div>
                            <p className="font-semibold text-xs text-gray-900">{option.label}</p>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción (Opcional)</label>
                      <textarea
                        placeholder="Describe brevemente el servicio"
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={handleCloseServiceModal}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      onClick={() => serviceName && serviceType && setServiceStep('pricing')}
                      disabled={!serviceName || !serviceType}
                      className={`flex-1 font-semibold py-3 rounded-xl transition-colors ${
                        serviceName && serviceType
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={serviceName && serviceType ? { scale: 1.05 } : {}}
                      whileTap={serviceName && serviceType ? { scale: 0.95 } : {}}
                    >
                      Continuar
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Pricing & Duration */}
              {serviceStep === 'pricing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Duración y Precio</h3>

                  <div className="space-y-3 mb-4">
                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Duración (minutos)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="30"
                          value={serviceDuration}
                          onChange={(e) => setServiceDuration(e.target.value)}
                          min="15"
                          step="15"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                        />
                        <span className="text-2xl">⏱️</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Precio</label>
                      <div className="flex gap-2 items-center">
                        <span className="text-lg font-semibold text-gray-700 bg-gray-100 px-3 py-3 rounded-xl border-2 border-gray-200">$</span>
                        <input
                          type="number"
                          placeholder="25000"
                          value={servicePrice}
                          onChange={(e) => setServicePrice(e.target.value)}
                          min="0"
                          step="1000"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900"
                        />
                        <span className="text-2xl">💵</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setServiceStep('info')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ← Atrás
                    </motion.button>
                    <motion.button
                      onClick={() => serviceDuration && servicePrice && setServiceStep('confirm')}
                      disabled={!serviceDuration || !servicePrice}
                      className={`flex-1 font-semibold py-3 rounded-xl transition-colors ${
                        serviceDuration && servicePrice
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      whileHover={serviceDuration && servicePrice ? { scale: 1.05 } : {}}
                      whileTap={serviceDuration && servicePrice ? { scale: 0.95 } : {}}
                    >
                      Continuar
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirmation & Summary */}
              {serviceStep === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Servicio</h3>

                  {/* Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200 mb-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between pb-4 border-b border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Nombre</p>
                          <p className="font-bold text-gray-900 text-lg">{serviceName}</p>
                        </div>
                      </div>

                      <div className="flex items-start justify-between pb-4 border-b border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Tipo de Servicio</p>
                          <p className="font-bold text-gray-900 text-lg">{serviceType}</p>
                        </div>
                      </div>

                      {serviceCategory && (
                        <div className="flex items-start justify-between pb-4 border-b border-teal-200">
                          <div>
                            <p className="text-sm text-gray-600">Categoría</p>
                            <p className="font-bold text-gray-900 text-lg">{serviceCategory}</p>
                          </div>
                        </div>
                      )}

                      {serviceDescription && (
                        <div className="flex items-start justify-between pb-4 border-b border-teal-200">
                          <div>
                            <p className="text-sm text-gray-600">Descripción</p>
                            <p className="font-bold text-gray-900">{serviceDescription}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between pb-4 border-b border-teal-200">
                        <div>
                          <p className="text-sm text-gray-600">Duración</p>
                          <p className="font-bold text-gray-900 text-lg">⏱️ {serviceDuration} minutos</p>
                        </div>
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Precio</p>
                          <p className="font-bold text-gray-900 text-lg">💵 ${servicePrice}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setServiceStep('pricing')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={creatingService}
                    >
                      ← Atrás
                    </motion.button>
                    <motion.button
                      onClick={handleCreateService}
                      disabled={creatingService}
                      className={`flex-1 font-semibold py-3 rounded-xl transition-all ${
                        !creatingService
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                          : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      }`}
                      whileHover={!creatingService ? { scale: 1.05 } : {}}
                      whileTap={!creatingService ? { scale: 0.95 } : {}}
                    >
                      {creatingService ? (
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          Creando servicio...
                        </motion.span>
                      ) : (
                        '✓ Crear Servicio'
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal for Service Creation */}
      {serviceSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-sm flex flex-col overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                ✅
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Servicio Creado!</h2>
              <p className="text-gray-600 mb-6">Tu servicio se ha creado exitosamente</p>

              {/* Button */}
              <motion.button
                onClick={() => {
                  setServiceSuccessModal(false);
                  setServiceModalOpen(false);
                  setServiceStep('info');
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aceptar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal Agregar Profesional */}
      {staffModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-4xl flex flex-col overflow-hidden"
            style={{ height: '600px' }}
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold">Agregar Profesional</h2>
              <button
                onClick={handleCloseStaffModal}
                className="text-2xl hover:bg-teal-700 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Content - Scrolleable */}
            <div className="flex-1 overflow-y-auto p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-5">Información del Profesional</h3>

                <div className="space-y-4 mb-4 flex-1">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      placeholder="Ej: Juan"
                      value={staffFirstName}
                      onChange={(e) => setStaffFirstName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      placeholder="Ej: García"
                      value={staffLastName}
                      onChange={(e) => setStaffLastName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                    />
                  </div>

                  {/* Phone Number with Country Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Número de Teléfono</label>
                    <div className="flex gap-2 items-center relative" ref={staffCountryPickerRef}>
                      {/* Country Picker Button */}
                      <motion.button
                        onClick={() => setStaffCountryPicker(!staffCountryPicker)}
                        className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-teal-100 px-3 py-2 rounded-lg border-2 border-teal-300 hover:border-teal-500 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-teal-600 rounded flex items-center justify-center text-white text-sm font-bold">
                          {staffCountry.emoji}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">+{staffCountry.code}</span>
                      </motion.button>

                      {/* Country Dropdown */}
                      {staffCountryPicker && (
                        <motion.div
                          className="absolute left-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 w-60"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {/* Search Input */}
                          <div className="sticky top-0 bg-white p-2 border-b border-gray-200 rounded-t-xl">
                            <input
                              type="text"
                              placeholder="Buscar país..."
                              value={staffCountrySearch}
                              onChange={(e) => setStaffCountrySearch(e.target.value)}
                              className="w-full px-3 py-1 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-xs"
                              autoFocus
                            />
                          </div>

                          {/* Countries List */}
                          <div className="max-h-60 overflow-y-auto">
                            {allCountries
                              .filter((c) => c.name.toLowerCase().includes(staffCountrySearch.toLowerCase()) || c.code.includes(staffCountrySearch))
                              .map((country, idx) => (
                                <motion.button
                                  key={`${country.code}-${idx}`}
                                  onClick={() => {
                                    setStaffCountry(country);
                                    setStaffCountryPicker(false);
                                    setStaffCountrySearch('');
                                  }}
                                  className={`w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-teal-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm ${
                                    staffCountry.code === country.code && staffCountry.name === country.name ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                                  }`}
                                  whileHover={{ paddingLeft: 20 }}
                                >
                                  <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {country.emoji}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 text-xs">{country.name}</p>
                                    <p className="text-xs text-gray-600">+{country.code}</p>
                                  </div>
                                  {staffCountry.code === country.code && staffCountry.name === country.name && (
                                    <span className="text-teal-500 font-bold text-sm flex-shrink-0">✓</span>
                                  )}
                                </motion.button>
                              ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Phone Input */}
                      <input
                        type="tel"
                        placeholder="3001234567"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900 text-sm"
                      />
                    </div>
                  </div>

                  {/* Avatar URL */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Foto de Perfil (Opcional)</label>
                    <div className="flex gap-3 items-end">
                      {/* Preview */}
                      {staffAvatarPreview && (
                        <motion.div
                          className="w-20 h-20 rounded-lg overflow-hidden border-2 border-teal-500 flex-shrink-0"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <img src={staffAvatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        </motion.div>
                      )}

                      {/* File Input */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setStaffAvatarFile(file);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setStaffAvatarPreview(event.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 text-gray-700 text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-teal-500 file:text-white file:text-xs file:cursor-pointer file:font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto pt-4">
                  <motion.button
                    onClick={handleCloseStaffModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-lg text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={creatingStaff}
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    onClick={handleCreateStaff}
                    disabled={creatingStaff || !staffFirstName || !staffLastName || !staffPhone}
                    className={`flex-1 font-semibold py-2 rounded-lg transition-all text-sm ${
                      !creatingStaff && staffFirstName && staffLastName && staffPhone
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white'
                        : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    }`}
                    whileHover={!creatingStaff && staffFirstName && staffLastName && staffPhone ? { scale: 1.05 } : {}}
                    whileTap={!creatingStaff && staffFirstName && staffLastName && staffPhone ? { scale: 0.95 } : {}}
                  >
                    {creatingStaff ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Creando...
                      </motion.span>
                    ) : (
                      '✓ Crear'
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal for Staff Creation */}
      {staffSuccessModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-sm flex flex-col overflow-hidden"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
          >
            {/* Content */}
            <div className="p-8 text-center">
              {/* Success Icon */}
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                ✅
              </motion.div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Profesional Creado!</h2>
              <p className="text-gray-600 mb-6">Tu profesional se ha creado exitosamente</p>

              {/* Button */}
              <motion.button
                onClick={() => {
                  setStaffSuccessModal(false);
                  setStaffModalOpen(false);
                }}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-xl transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Aceptar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
