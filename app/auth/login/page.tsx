'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [numero, setNumero] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const requestData = { numero, password };
    console.log('📤 Enviando solicitud a /login-business:', requestData);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/login-business`;
      console.log('🔗 URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const responseData = await response.json();
      console.log('✅ Datos recibidos:', JSON.stringify(responseData, null, 2));

      // Validar que la respuesta tenga la estructura esperada
      if (!responseData.planiaToken || !responseData.data) {
        console.error('❌ Estructura de respuesta inválida:', responseData);
        throw new Error('La respuesta del servidor no tiene la estructura esperada');
      }

      // Guardar todos los datos necesarios
      localStorage.setItem('planiaToken', responseData.planiaToken);
      localStorage.setItem('refreshToken', responseData.refreshToken);
      localStorage.setItem('business', JSON.stringify(responseData.data));
      console.log('🔐 Datos guardados en localStorage');
      console.log('📊 Negocio:', responseData.data.nombre);

      router.push('/dashboard');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error en el login';
      console.error('❌ Error en login:', errorMsg);
      console.error('❌ Error completo:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-teal-200 opacity-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-teal-100 opacity-10"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="flex justify-center mb-12" variants={itemVariants}>
          <Image
            src="/assets/images/plania.nobg.png"
            alt="Plania"
            width={200}
            height={100}
            priority
          />
        </motion.div>

        {/* Form Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ boxShadow: '0 20px 50px rgba(26, 188, 156, 0.2)' }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}

            {/* Phone Input */}
            <motion.div variants={itemVariants}>
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 transition-all"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants} className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-gray-100 transition-all"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-3 text-gray-600 hover:text-teal-500 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </motion.button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-full transition-colors shadow-lg"
            >
              {loading ? (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Iniciando sesión...
                </motion.span>
              ) : (
                'INICIAR SESIÓN'
              )}
            </motion.button>

            {/* Register Button */}
            <motion.button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-full transition-colors shadow-lg"
            >
              REGISTRARSE
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
