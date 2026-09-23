import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  Users,
  XCircle,
  UserPlus,
  ChevronRight,
  Activity,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'
import api from '../lib/api'

function timeAgo(iso) {
  if (!iso) return 'recently'
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.round(hrs / 24)}d ago`
}

function PendingEmptyStateIllustration() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center select-none my-1">
      {/* Subtle sparkles */}
      <svg className="absolute top-1 left-2 w-3.5 h-3.5 text-[#A5B4FC]/70 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
      <svg className="absolute top-3 right-1 w-3 h-3 text-[#38BDF8]/70" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>
      <svg className="absolute bottom-3 left-1 w-2.5 h-2.5 text-[#DDD6FE]/70" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
      </svg>

      {/* Document Graphic */}
      <div className="relative">
        <div className="w-20 h-24 bg-[#EEF2FF] rounded-2xl absolute -top-1 -left-1 transform -rotate-3" />
        <div className="relative w-20 h-24 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-[#E0E7FF] flex items-center justify-center text-[#434EE8]">
              <Users className="h-3 w-3" />
            </div>
            <div className="space-y-0.5 flex-1">
              <div className="h-1.5 w-6 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-4 bg-slate-200 rounded-full" />
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1" />
          <div className="h-1.5 w-4/5 bg-slate-100 rounded-full" />
          <div className="h-1.5 w-3/5 bg-slate-100 rounded-full" />
        </div>
      </div>

      {/* Green Checkmark Badge overlapping */}
      <div className="absolute -bottom-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#10B981] text-white shadow-md ring-3 ring-white">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { token } = useAuth()
  const { notifications } = useNotifications()
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, all: 0 })
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    if (!token) return
    try {
      const data = await api.listDoctors(token, 'pending')
      if (data && data.counts) {
        setCounts(data.counts)
        setPendingDoctors(data.doctors || [])
      }
    } catch {
      setPendingDoctors([])
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  const handleApprove = async (id) => {
    setBusyId(id)
    try {
      await api.approveDoctor(token, id)
      await load()
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Optional: reason for rejection')
    setBusyId(id)
    try {
      await api.rejectDoctor(token, id, reason || '')
      await load()
    } finally {
      setBusyId(null)
    }
  }

  // Format dynamic notifications from database
  const activityList = notifications.slice(0, 6).map((n) => {
    let badge = 'Update'
    let badgeTone = 'bg-slate-50 text-slate-600 border-slate-200'
    let Icon = Activity
    let iconTone = 'text-slate-600'

    if (n.type === 'doctor_registered') {
      badge = 'Pending'
      badgeTone = 'bg-[#FFFBEB] text-[#D97706] border-[#FEF3C7]'
      Icon = UserPlus
      iconTone = 'text-[#D97706]'
    } else if (n.type === 'doctor_approved') {
      badge = 'Approved'
      badgeTone = 'bg-[#F0FDF4] text-[#059669] border-[#DCFCE7]'
      Icon = CheckCircle2
      iconTone = 'text-[#059669]'
    } else if (n.type === 'doctor_rejected') {
      badge = 'Rejected'
      badgeTone = 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]'
      Icon = XCircle
      iconTone = 'text-[#E11D48]'
    }

    return {
      id: n.id,
      text: n.message || n.title,
      time: timeAgo(n.createdAt),
      badge,
      badgeTone,
      icon: Icon,
      iconTone,
    }
  })

  return (
    <div className="h-full flex flex-col justify-between gap-3 lg:gap-3.5">
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 shrink-0">
        {/* Card 1: PENDING APPROVAL */}
        <Link to="/doctors">
          <motion.div
            whileHover={{ y: -2 }}
            className="group bg-[#FFF8F2] border border-[#FFE7D3] rounded-2xl p-3.5 lg:p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FED7AA]/60 text-[#D97706]">
                  <Clock className="h-3.5 w-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                  PENDING APPROVAL
                </span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-white shadow-xs transition-all">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <p className="font-display text-[32px] lg:text-[36px] font-extrabold text-[#1E293B] leading-none mb-1 tabular-nums">
                {counts.pending}
              </p>
              <p className="text-[11px] lg:text-[11.5px] text-[#64748B] font-medium">Doctors waiting for approval</p>
            </div>
          </motion.div>
        </Link>

        {/* Card 2: APPROVED DOCTORS */}
        <Link to="/doctors">
          <motion.div
            whileHover={{ y: -2 }}
            className="group bg-[#F0FDF4] border border-[#D1F4E6] rounded-2xl p-3.5 lg:p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A7F3D0]/60 text-[#059669]">
                  <Users className="h-3.5 w-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                  APPROVED DOCTORS
                </span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-white shadow-xs transition-all">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <p className="font-display text-[32px] lg:text-[36px] font-extrabold text-[#0F766E] leading-none mb-1 tabular-nums">
                {counts.approved}
              </p>
              <p className="text-[11px] lg:text-[11.5px] text-[#64748B] font-medium">Active and verified doctors</p>
            </div>
          </motion.div>
        </Link>

        {/* Card 3: REJECTED */}
        <Link to="/doctors">
          <motion.div
            whileHover={{ y: -2 }}
            className="group bg-[#FFF1F2] border border-[#FFD6DF] rounded-2xl p-3.5 lg:p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FECDD3]/60 text-[#E11D48]">
                  <XCircle className="h-3.5 w-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                  REJECTED
                </span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-white shadow-xs transition-all">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <p className="font-display text-[32px] lg:text-[36px] font-extrabold text-[#BE123C] leading-none mb-1 tabular-nums">
                {counts.rejected}
              </p>
              <p className="text-[11px] lg:text-[11.5px] text-[#64748B] font-medium">Registrations rejected</p>
            </div>
          </motion.div>
        </Link>

        {/* Card 4: TOTAL REGISTRATIONS */}
        <Link to="/doctors">
          <motion.div
            whileHover={{ y: -2 }}
            className="group bg-[#F0F9FF] border border-[#D6E8FA] rounded-2xl p-3.5 lg:p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BAE6FD]/60 text-[#0284C7]">
                  <UserPlus className="h-3.5 w-3.5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#475569]">
                  TOTAL REGISTRATIONS
                </span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-slate-400 group-hover:text-slate-600 group-hover:bg-white shadow-xs transition-all">
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2.5">
              <p className="font-display text-[32px] lg:text-[36px] font-extrabold text-[#1E293B] leading-none mb-1 tabular-nums">
                {counts.all}
              </p>
              <p className="text-[11px] lg:text-[11.5px] text-[#64748B] font-medium">All doctor registrations</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Main Grid: Pending Approvals (Left) & Recent Activity (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-3 lg:gap-4">
        {/* Left Column: Pending approvals */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between h-full">
          {/* Decorative soft pastel lavender blur at bottom-left */}
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-indigo-50/70 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between relative z-10 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF2FF] text-[#434EE8]">
                <Clock className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div>
                <h2 className="font-display text-[16px] font-bold text-[#1E293B] tracking-tight">
                  Pending approvals
                </h2>
                <p className="text-[11px] text-[#64748B] font-medium">
                  {pendingDoctors.length} doctor{pendingDoctors.length === 1 ? '' : 's'} waiting
                </p>
              </div>
            </div>

            <Link
              to="/doctors"
              className="flex items-center gap-1 text-[11px] font-semibold text-[#434EE8] hover:text-[#363EC4] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-full transition-colors"
            >
              View all doctors <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Pending Doctors List or Empty State */}
          <div className="flex-1 flex flex-col justify-center py-2 relative z-10">
            {pendingDoctors.length > 0 ? (
              <div className="divide-y divide-slate-100 space-y-1 overflow-y-auto max-h-56">
                {pendingDoctors.map((d) => (
                  <div
                    key={d.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{d.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {d.email} {d.clinicName && `· ${d.clinicName}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleApprove(d.id)}
                        disabled={busyId === d.id}
                        className="btn-primary text-xs px-2.5 py-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(d.id)}
                        disabled={busyId === d.id}
                        className="btn-secondary text-xs px-2.5 py-1"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Exact Vector Empty State matching screenshot */
              <div className="flex flex-col items-center justify-center text-center px-4">
                <PendingEmptyStateIllustration />
                <h3 className="font-display text-[15px] font-bold text-[#1E293B] mt-1 mb-0.5">
                  No pending registrations right now.
                </h3>
                <p className="text-[11px] text-[#717A94] max-w-xs leading-relaxed">
                  All caught up! New doctor registrations will appear here when they need your approval.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="xl:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-xs p-4 sm:p-5 flex flex-col justify-between h-full overflow-hidden">
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="text-[#434EE8]">
                  <Activity className="h-4.5 w-4.5" strokeWidth={2.4} />
                </div>
                <h2 className="font-display text-[16px] font-bold text-[#1E293B] tracking-tight">
                  Recent activity
                </h2>
              </div>
              <Link
                to="/notifications"
                className="flex items-center gap-1 text-[11px] font-semibold text-[#434EE8] hover:text-[#363EC4] bg-[#EEF2FF] hover:bg-[#E0E7FF] px-3 py-1.5 rounded-full transition-colors"
              >
                All notifications <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Vertical Timeline or Empty State */}
            {activityList.length > 0 ? (
              <div className="relative flex-1 flex flex-col justify-around py-1.5 pl-1">
                {/* Continuous vertical connecting line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[1.5px] bg-slate-200/80 -z-0" />

                {activityList.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="relative z-10 flex items-center justify-between gap-2.5 py-0.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-white ring-2 ring-white shadow-xs">
                          <Icon className={`h-3.5 w-3.5 ${item.iconTone}`} strokeWidth={2.2} />
                        </div>
                        <div className="min-w-0 leading-tight">
                          <p className="text-[11.5px] font-medium text-[#1E293B] truncate">
                            {item.text}
                          </p>
                          <p className="text-[10px] text-[#94A3B8]">{item.time}</p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-[9.5px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeTone}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                  <Activity className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <p className="text-xs font-semibold text-slate-700">No activity yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px]">
                  Doctor registrations and status updates will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Pet Care Banner Card */}
      <div className="bg-white/95 backdrop-blur rounded-2xl border border-slate-100 shadow-xs px-5 py-2.5 sm:py-3 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Soft background pastel blob */}
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#E0F2FE]/40 via-[#F3E8FF]/30 to-transparent pointer-events-none" />

        {/* Left Text */}
        <div className="relative z-10 max-w-sm">
          <h3 className="font-display text-[15px] sm:text-[16px] font-bold text-[#1E293B] leading-tight">
            Thank you for keeping Zenve Doctors growing!
          </h3>
          <p className="text-[11px] sm:text-[11.5px] text-[#64748B] mt-0.5 font-medium">
            Manage doctor registrations, approvals and platform activity with ease.
          </p>
        </div>

        {/* Right Illustration: Golden Retriever Puppy & Kitten with Cursive Script */}
        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
          {/* Pet Photo */}
          <div className="relative w-36 sm:w-44 h-16 sm:h-20 rounded-xl overflow-hidden shadow-xs flex items-center justify-center bg-gradient-to-b from-white to-slate-50">
            <img
              src="/assets/pets-banner.jpg"
              alt="Golden Retriever puppy and cute kitten"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Cursive script text: Care Connect Grow ♡ */}
          <div className="font-script text-[20px] sm:text-[22px] text-[#4F5B93] leading-none tracking-wide text-right select-none pr-1">
            <p>Care</p>
            <p>Connect</p>
            <p className="flex items-center justify-end gap-1">
              Grow <span className="text-base">♡</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
