import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users,
  ShieldCheck,
  BarChart2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Bell,
  Moon,
  Sun,
  AlertCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PawIcon({ className = 'w-6 h-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <ellipse cx="6" cy="9" rx="2" ry="2.6" />
      <ellipse cx="10.2" cy="5.5" rx="2.1" ry="2.7" />
      <ellipse cx="15.2" cy="6.2" rx="2.1" ry="2.7" />
      <ellipse cx="19" cy="10.2" rx="2" ry="2.6" />
      <path d="M7.8 15.2c-.7 1.5-.2 3.1 1.2 3.9 1.6.9 4.3 1.2 6.2 0 1.6-1 2.2-2.7.9-4-1.2-1.2-2.9-1.6-4.2-1.5-1.5.1-3 .7-4.1 1.6z" />
    </svg>
  )
}

const HERO_FEATURES = [
  {
    title: 'Manage',
    subtitle: 'Doctor registrations',
    icon: Users,
    bg: 'bg-[#E0F2FE]',
    color: 'text-[#0284C7]',
  },
  {
    title: 'Secure',
    subtitle: 'Approval process',
    icon: ShieldCheck,
    bg: 'bg-[#DCFCE7]',
    color: 'text-[#16A34A]',
  },
  {
    title: 'Track',
    subtitle: 'Real-time platform activity',
    icon: BarChart2,
    bg: 'bg-[#F3E8FF]',
    color: 'text-[#9333EA]',
  },
]

const CARD_BADGES = [
  { icon: Users, text: 'Review sign-ups' },
  { icon: Bell, text: 'Instant alerts' },
  { icon: ShieldCheck, text: 'One-click approve' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@zenve.in')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return (
      localStorage.getItem('zenve_theme') === 'dark' ||
      document.documentElement.classList.contains('dark')
    )
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('zenve_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('zenve_theme', 'light')
    }
  }, [isDark])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#EFF4FA] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row relative overflow-x-hidden font-sans transition-colors duration-300">
      {/* Top Right Dark Mode Toggle */}
      <div className="absolute top-5 right-5 sm:top-7 sm:right-9 z-40">
        <button
          type="button"
          onClick={() => setIsDark((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white/70 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-sm transition-all"
          aria-label="Toggle dark mode"
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* LEFT SECTION: Hero & Veterinary Branding */}
      <div className="relative w-full lg:w-[57%] xl:w-[59%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 min-h-[580px] lg:min-h-screen overflow-hidden">
        {/* Soft Organic Wavy Backdrop Shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subtle curved background overlay */}
          <svg
            className="absolute -top-24 -left-24 w-[600px] h-[600px] text-white/60 dark:text-slate-800/20"
            viewBox="0 0 500 500"
            fill="currentColor"
          >
            <path d="M421,310Q390,370,335,405Q280,440,215,435Q150,430,95,385Q40,340,45,270Q50,200,95,145Q140,90,210,75Q280,60,340,105Q400,150,426,200Q452,250,421,310Z" />
          </svg>
          <svg
            className="absolute -bottom-28 -left-20 w-[550px] h-[550px] text-blue-100/40 dark:text-slate-900/40"
            viewBox="0 0 500 500"
            fill="currentColor"
          >
            <path d="M430,320Q400,390,330,425Q260,460,195,435Q130,410,85,360Q40,310,45,240Q50,170,100,120Q150,70,225,65Q300,60,365,105Q430,150,445,200Q460,250,430,320Z" />
          </svg>
        </div>

        {/* Pet Hero Image with Stethoscope on Clinic Table */}
        <div className="absolute right-0 bottom-0 top-0 w-[52%] lg:w-[54%] hidden md:block pointer-events-none z-0">
          <div className="relative w-full h-full">
            {/* The real high-resolution photo */}
            <img
              src="/assets/login-pets.jpg"
              alt="Golden Retriever dog and Tabby cat with stethoscope on examination table"
              className="w-full h-full object-cover object-[55%_35%] lg:object-[50%_35%]"
            />
            {/* Smooth organic wave cutting into the image from left to match screenshot */}
            <svg
              className="absolute inset-y-0 -left-[1px] h-full w-28 lg:w-40 text-[#EFF4FA] dark:text-[#0B0F19] preserve-3d"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="currentColor"
            >
              <path d="M0,0 C35,20 75,10 65,35 C55,60 15,65 25,85 C32,95 10,98 0,100 Z" />
            </svg>
            {/* Soft subtle gradient blend at edges */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#EFF4FA]/90 via-transparent to-transparent lg:from-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#EFF4FA]/60 dark:from-[#0B0F19]/70 to-transparent" />
          </div>
        </div>

        {/* Content Container (Header, Titles, Highlights, Script) */}
        <div className="relative z-10 flex flex-col justify-between h-full max-w-xl">
          {/* Zenve Doctors Brand Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex items-center gap-3.5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-[#141A46] to-[#0E1235] shadow-md ring-1 ring-white/10 p-2 overflow-hidden">
              <img
                src="/assets/zenve-emblem.png"
                alt="Zenve Logo"
                className="h-full w-full object-contain filter drop-shadow"
              />
            </div>
            <div>
              <span className="block font-display text-[21px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Zenve Doctors
              </span>
              <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-[#3D47E8] dark:text-[#818CF8] mt-1">
                ADMIN CRM
              </span>
            </div>
          </motion.div>

          {/* Headline & Badges Section */}
          <div className="my-8 lg:my-10 space-y-7 max-w-[430px]">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400"
            >
              <span className="w-5 h-[2px] bg-[#3B49DF] rounded-full inline-block" />
              <span>Together for a Healthier Tomorrow</span>
            </motion.div>

            {/* Main Catchy Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.45 }}
              className="font-extrabold text-3xl sm:text-4xl lg:text-[43px] leading-[1.14] tracking-tight text-slate-900 dark:text-white"
            >
              Empowering
              <br />
              Veterinary Care
              <br />
              <span className="text-[#3B49DF] dark:text-[#6366F1]">
                Through Technology
              </span>
            </motion.h1>

            {/* Sub-paragraph */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[390px]"
            >
              Manage doctor registrations, approvals and platform activity with a seamless and secure experience.
            </motion.p>

            {/* 3 Vertically Stacked Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="space-y-4 pt-1"
            >
              {HERO_FEATURES.map(({ title, subtitle, icon: Icon, bg, color }) => (
                <div key={title} className="flex items-center gap-3.5 group">
                  <div
                    className={`w-11 h-11 rounded-full ${bg} dark:bg-slate-800/90 flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                      {subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Left Script Typography & Paw Icon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="pt-4 flex items-center gap-3 select-none"
          >
            <div className="font-script text-[26px] sm:text-[30px] font-semibold text-[#667B96] dark:text-[#8AA0BC] leading-tight -rotate-3">
              <div>Healthy Pets</div>
              <div className="flex items-center gap-2">
                <span>Brighter Tomorrows</span>
                <PawIcon className="w-6 h-6 text-[#7E93AE] dark:text-[#9FB5D1] inline-block" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SECTION: Floating White Card Login */}
      <div className="w-full lg:w-[43%] xl:w-[41%] flex flex-col items-center justify-center p-5 sm:p-8 lg:p-10 relative z-20 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Main Card Container */}
          <div className="bg-white dark:bg-[#111726] rounded-[28px] p-7 sm:p-9 shadow-[0_12px_45px_-12px_rgba(15,23,42,0.08)] dark:shadow-[0_12px_45px_-12px_rgba(0,0,0,0.4)] border border-slate-100 dark:border-slate-800 transition-all">
            {/* Card Header */}
            <div className="text-center mb-6">
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                Welcome to
              </span>
              <h2 className="text-2xl sm:text-[29px] font-extrabold text-slate-900 dark:text-white tracking-tight mt-0.5 leading-snug">
                Zenve Doctors
              </h2>
              <div className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#3D47E8] dark:text-[#818CF8] mt-1">
                ADMIN CRM
              </div>
              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 mt-2">
                Sign in to continue to your admin dashboard
              </p>
            </div>

            {/* Error / Notification Banners */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 mb-4"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 focus-within:border-[#3D47E8] focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-[#3D47E8]/15 transition-all shadow-xs">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 shrink-0" />
                  <input
                    required
                    type="email"
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-normal"
                    placeholder="admin@zenve.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 px-3.5 py-2.5 focus-within:border-[#3D47E8] focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:ring-2 focus-within:ring-[#3D47E8]/15 transition-all shadow-xs">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2.5 shrink-0" />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none font-normal"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors ml-2 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#3944DF] to-[#4752F0] hover:from-[#303BCA] hover:to-[#3B47DF] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#3944DF]/20 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
              </button>
            </form>

            {/* Bottom 3 Badges inside the Card */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium">
              {CARD_BADGES.map(({ icon: Icon, text }, idx) => (
                <div key={text} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Icon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 shrink-0" />
                    <span className="whitespace-nowrap">{text}</span>
                  </div>
                  {idx < CARD_BADGES.length - 1 && (
                    <span className="text-slate-300 dark:text-slate-700 select-none pl-1 sm:pl-2">
                      |
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Below Card */}
          <div className="mt-6 text-center space-y-1">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              © 2024 Zenve Doctors. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Care Today. Healthier Tomorrows.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
