import { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  PartyPopper,
  Heart,
  Sparkles,
  Check,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  saveDatePlan,
  getDatePlans,
  checkApiConfigured,
  type DatePlanRecord,
} from '@/lib/mongo';

const ACTIVITIES = [
  'Dinner & Movie 🎬',
  'Coffee & Walk ☕🚶',
  'Picnic in the Park 🧺',
  'Amusement Park 🎢',
  'Stargazing Night ✨🌌',
  'Ice Cream Date 🍦',
  // 'Beach Sunset 🏖️🌅',
  'Cooking Together 👩‍🍳',
  'Museum Visit 🏛️',
  // 'Mini Golf ⛳',
  'Dance Night 💃🕺',
  'Bookstore Browse 📚',
];

interface DatePlan {
  activity: string;
  date: string;
  time: string;
  location: string;
  message: string;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function DatePlanningScreen() {
  const [plan, setPlan] = useState<DatePlan>({
    activity: '',
    date: '',
    time: '',
    location: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [savedPlans, setSavedPlans] = useState<DatePlanRecord[]>([]);
  const [apiEnabled, setApiEnabled] = useState(false);

  const update = (field: keyof DatePlan, value: string) => {
    setPlan((p) => ({ ...p, [field]: value }));
  };

  const isFormValid =
    plan.activity && plan.date && plan.time && plan.location && plan.message.trim();

  useEffect(() => {
    checkApiConfigured().then(setApiEnabled).catch(() => setApiEnabled(false));
  }, []);

  const loadSavedPlans = useCallback(async () => {
    if (!apiEnabled) return;
    try {
      const plans = await getDatePlans();
      setSavedPlans(plans);
    } catch (err) {
      console.error('Failed to load saved plans:', err);
    }
  }, [apiEnabled]);

  useEffect(() => {
    loadSavedPlans();
  }, [loadSavedPlans]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    if (apiEnabled) {
      setSaveState('saving');
      try {
        await saveDatePlan({
          activity: plan.activity,
          date: plan.date,
          time: plan.time,
          location: plan.location,
          message: plan.message.trim(),
        });
        setSaveState('saved');
        await loadSavedPlans();
      } catch (err) {
        console.error('Failed to save date plan:', err);
        setSaveState('error');
      }
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setPlan({ activity: '', date: '', time: '', location: '', message: '' });
    setSubmitted(false);
    setSaveState('idle');
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (timeStr: string) =>
    new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  if (submitted) {
    return (
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="animate-pop-in glass-card w-full max-w-lg rounded-[2rem] px-8 py-10 sm:px-12 sm:py-12">
          <div className="mb-6 flex items-center justify-center gap-3">
            <Check size={32} className="text-green-500" />
            <Heart size={40} fill="#ff4f94" color="#ff4f94" className="animate-heartbeat" />
            <Check size={32} className="text-green-500" />
          </div>

          <h2 className="font-script text-4xl text-center text-[#e83a7e] sm:text-5xl">
            Our Date Plan 🌹
          </h2>

          {/* Save status */}
          {apiEnabled && saveState === 'saving' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#c92a65]/70">
              <Loader2 size={16} className="animate-spin" />
              Saving to database...
            </div>
          )}
          {apiEnabled && saveState === 'saved' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-green-600">
              <Check size={16} />
              Saved! It'll be here when you come back 💾
            </div>
          )}
          {apiEnabled && saveState === 'error' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-red-500">
              <AlertCircle size={16} />
              Couldn't save to database — showing your plan below anyway
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f7] p-4">
              <PartyPopper size={24} className="mt-0.5 shrink-0 text-[#ff4f94]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#c92a65]/60">Activity</p>
                <p className="text-base font-semibold text-[#c92a65]">{plan.activity}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f7] p-4">
              <Calendar size={24} className="mt-0.5 shrink-0 text-[#ff4f94]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#c92a65]/60">Date</p>
                <p className="text-base font-semibold text-[#c92a65]">{formatDate(plan.date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f7] p-4">
              <Clock size={24} className="mt-0.5 shrink-0 text-[#ff4f94]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#c92a65]/60">Time</p>
                <p className="text-base font-semibold text-[#c92a65]">{formatTime(plan.time)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f7] p-4">
              <MapPin size={24} className="mt-0.5 shrink-0 text-[#ff4f94]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#c92a65]/60">Location</p>
                <p className="text-base font-semibold text-[#c92a65]">{plan.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-[#fff5f7] p-4">
              <Sparkles size={24} className="mt-0.5 shrink-0 text-[#ff4f94]" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#c92a65]/60">
                  Personal Message
                </p>
                <p className="text-base font-semibold italic text-[#c92a65]">"{plan.message}"</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="font-script text-3xl text-[#e83a7e]">Can't wait! 🥰 ❤️</p>
          </div>

          <button
            onClick={handleReset}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#ff7aac] bg-white px-6 py-3 text-base font-semibold text-[#c92a65] transition hover:bg-[#fff5f7]"
          >
            <RotateCcw size={18} />
            Plan Another Date
          </button>
        </div>

        {/* Previously saved plans */}
        {apiEnabled && savedPlans.length > 1 && (
          <div className="mt-6 w-full max-w-lg">
            <p className="mb-3 text-center text-sm font-semibold text-[#c92a65]/70">
              Previously planned dates 📝
            </p>
            <div className="space-y-2">
              {savedPlans.slice(1).map((p, i) => (
                <div
                  key={i}
                  className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3"
                >
                  <PartyPopper size={18} className="shrink-0 text-[#ff4f94]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#c92a65]">
                      {p.activity} — {formatDate(p.date)} at {formatTime(p.time)}
                    </p>
                    <p className="truncate text-xs text-[#c92a65]/60">{p.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <Heart size={48} fill="#ff4f94" color="#ff4f94" className="mx-auto animate-heartbeat" />
          <h2 className="font-script mt-2 text-4xl text-[#e83a7e] sm:text-5xl">
            Plan Our Date 📅 💕
          </h2>
          <p className="mt-1 text-sm text-[#c92a65]/70">Fill in the details for our perfect day together</p>
        </div>

        <div className="glass-card rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
          <div className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c92a65]/70">
                <PartyPopper size={16} /> Activity
              </label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITIES.map((a) => (
                  <button
                    key={a}
                    onClick={() => update('activity', a)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      plan.activity === a
                        ? 'bg-gradient-to-r from-[#ff4f94] to-[#e83a7e] text-white shadow-md'
                        : 'border-2 border-[#ffc9db] bg-white text-[#c92a65] hover:border-[#ff7aac]'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c92a65]/70">
                <Calendar size={16} /> Date
              </label>
              <input
                type="date"
                value={plan.date}
                onChange={(e) => update('date', e.target.value)}
                className="date-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c92a65]/70">
                <Clock size={16} /> Time
              </label>
              <input
                type="time"
                value={plan.time}
                onChange={(e) => update('time', e.target.value)}
                className="date-input"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c92a65]/70">
                <MapPin size={16} /> Location
              </label>
              <input
                type="text"
                placeholder="Where should we meet? 📍"
                value={plan.location}
                onChange={(e) => update('location', e.target.value)}
                className="date-input"
                maxLength={100}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#c92a65]/70">
                <Sparkles size={16} /> Personal Message
              </label>
              <textarea
                placeholder="Write something sweet... 💌"
                value={plan.message}
                onChange={(e) => update('message', e.target.value)}
                className="date-input resize-none"
                rows={3}
                maxLength={200}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isFormValid || saveState === 'saving'}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-lg font-bold transition ${
              isFormValid && saveState !== 'saving'
                ? 'bg-gradient-to-r from-[#ff4f94] to-[#e83a7e] text-white shadow-lg hover:shadow-2xl'
                : 'cursor-not-allowed bg-[#ffc9db] text-white/60'
            }`}
          >
            {saveState === 'saving' ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Heart size={20} fill="white" color="white" />
                Confirm Our Date! ❤️
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
