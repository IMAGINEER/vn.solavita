import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Loader2, BadgeCheck, Lightbulb, Zap, Plug, Factory, HelpCircle } from 'lucide-react';
import type { FormData } from '@/lib/form-types';

// ============ PERSON ICONS ============
const PersonIcon = ({ count }: { count: number }) => (
  <div className="flex items-center justify-center gap-0.5">
    {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M12 14c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5z"/>
      </svg>
    ))}
    {count > 5 && <span className="text-sm ml-1">+</span>}
  </div>
);

// ============ DEVICE ICONS ============
const WallboxIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 18L20 20L22 18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 26V32" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HeatPumpIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <rect x="6" y="10" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="20" cy="21" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 21H24M20 17V25" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10V7M30 10V7" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const ACIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <rect x="6" y="12" width="28" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28C10 32 12 34 14 34" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M20 28C20 32 20 34 20 34" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M30 28C30 32 28 34 26 34" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

// ============ FORM DATA ============

const REGIONS = [
  'Lagos',
  'Abuja (FCT)',
  'North Central',
  'North East',
  'North West',
  'South East',
  'South South',
  'South West',
];

const HOUSEHOLD_SIZES = [
  { id: '1', label: '1 person', count: 1 },
  { id: '2', label: '2 people', count: 2 },
  { id: '3', label: '3 people', count: 3 },
  { id: '4', label: '4 people', count: 4 },
  { id: '5+', label: '5+ people', count: 5 },
];

const ELECTRICITY_USAGE = [
  { id: 'low', label: 'Low', description: '< 3,000 kWh/year', icon: Lightbulb },
  { id: 'medium', label: 'Medium', description: '3,000-5,000 kWh/year', icon: Zap },
  { id: 'high', label: 'High', description: '5,000-8,000 kWh/year', icon: Plug },
  { id: 'very-high', label: 'Very high', description: '> 8,000 kWh/year', icon: Factory },
  // Sentinel id for the "I don't know" answer. The server collapses this to
  // NULL on write so /admin/leads can render the row without a Usage line.
  { id: 'unknown', label: 'Not Sure', description: 'Skip and let us recommend', icon: HelpCircle },
];

const DEVICES = [
  { id: 'wallbox', label: 'EV charger / EV', icon: WallboxIcon },
  { id: 'heatpump', label: 'Heat pump', icon: HeatPumpIcon },
  { id: 'ac', label: 'Air conditioning', icon: ACIcon },
];

/* ──────────────────────────────────────────────────────────────────────
   Nigeria Step-3 extensions.

   The original UK form asked for "household + usage + devices" and that
   was enough. Nigeria needs more because a meaningful share of the
   customer's bill is the generator - not the grid. Three new fields
   capture that, all optional, all non-blocking on submit:

   - GENERATOR_FREQUENCY: how often they run a generator today. Drives
     the recommendation tier (frequent use → minimum HOME Standard) and
     feeds the ROI calculation as a baseline assumption for how much of
     the current power bill solar can replace.
   - FUEL_BUDGET_NGN: monthly fuel spend in a NGN bucket. Lets the user
     pick a band instead of typing a precise figure (which most
     households don't know). Drives the generator-fuel saving in ROI.
   - BACKUP_NEEDS: which circuits they want backup for. Heavy items
     (AC, water pump) push battery sizing; lights/fans/fridge are the
     baseline and don't.

   IDs are stable wire values - the My-Plan adapter and the calc both
   read them by id.
   ────────────────────────────────────────────────────────────────────── */

const GENERATOR_FREQUENCY = [
  { id: 'rarely', label: 'Rarely', description: 'A few hours, rarely' },
  { id: 'sometimes', label: 'Sometimes', description: 'A few hours, a few days a week' },
  { id: 'daily', label: 'Daily', description: 'Most days of the week' },
  { id: 'frequently', label: 'Frequently', description: 'Long hours every day' },
]

const FUEL_BUDGET_NGN = [
  { id: 'below-20k', label: 'Below ₦20,000' },
  { id: '20k-50k', label: '₦20,000 – ₦50,000' },
  { id: '50k-100k', label: '₦50,000 – ₦100,000' },
  { id: 'above-100k', label: 'Above ₦100,000' },
  { id: 'unknown', label: 'Not sure' },
]

const LightsIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <path d="M20 6C13 6 8 11 8 18c0 4 2 7 5 9v3a2 2 0 002 2h10a2 2 0 002-2v-3c3-2 5-5 5-9 0-7-5-12-12-12z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 36h10M17 40h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const FridgeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <rect x="11" y="6" width="18" height="28" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="11" y1="14" x2="29" y2="14" stroke="currentColor" strokeWidth="2"/>
    <line x1="15" y1="10" x2="15" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="15" y1="20" x2="15" y2="26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
)
const PumpIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
    <circle cx="14" cy="20" r="8" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 20h12M30 16v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const BACKUP_NEEDS = [
  { id: 'lights', label: 'Lights, fans and TV', icon: LightsIcon },
  { id: 'fridge', label: 'Refrigerator and essential appliances', icon: FridgeIcon },
  { id: 'ac', label: 'Air conditioning', icon: ACIcon },
  { id: 'pump', label: 'Water pump or other heavy loads', icon: PumpIcon },
]

/** Lookup a human label for a single-select id, with a fallback. */
function labelFor(
  id: string | undefined,
  options: ReadonlyArray<{ id: string; label: string }>,
  fallback = 'Not sure',
): string {
  if (!id) return fallback
  if (id === 'unknown') return 'Not sure'
  return options.find((o) => o.id === id)?.label ?? fallback
}

/** Join human labels for a multi-select id list. */
function labelsForIds(
  ids: string[] | undefined,
  options: ReadonlyArray<{ id: string; label: string }>,
): string {
  if (!ids || ids.length === 0) return ''
  return ids
    .map((id) => options.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(', ')
}

// ============ STEP COMPONENT ============
// 4-step form per docs/修改建议.docx. The Compressed Edit-details
// view (hideAddressAndContact) shows only 3 of these as data steps
// plus 1 review — see VISIBLE_TOTAL_STEPS inside the component.
const TOTAL_STEPS = 4

const StepIndicator = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
            i < current
              ? 'bg-[#0F766E] text-white'
              : i === current
              ? 'bg-[#0F766E] text-white ring-4 ring-[#0F766E]/20'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {i < current ? '✓' : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
            i < current ? 'bg-[#0F766E]' : 'bg-gray-200'
          }`}/>
        )}
      </div>
    ))}
  </div>
);

// ============ CARD SELECT ============
interface CardOption {
  id: string;
  label: string;
  icon?: React.ComponentType;
  description?: string;
  emoji?: string;
  count?: number;
}

const CardSelect = ({
  options,
  selected,
  onSelect,
  columns = 4,
}: {
  options: CardOption[];
  selected: string;
  onSelect: (id: string) => void;
  columns?: number;
}) => (
  <div className={`grid grid-cols-2 ${
    columns === 5 ? 'md:grid-cols-5'
      : columns === 4 ? 'md:grid-cols-4'
      : columns === 3 ? 'md:grid-cols-3'
      : 'md:grid-cols-2'
  } gap-2.5`}>
    {options.map((opt) => {
      const isSelected = selected === opt.id;
      const Icon = opt.icon;
      return (
        <motion.button
          key={opt.id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(opt.id)}
          className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          {Icon && <Icon />}
          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
          {opt.count !== undefined && <PersonIcon count={opt.count} />}
          <span className="text-sm font-medium text-center leading-tight">{opt.label}</span>
          {opt.description && <span className="text-[11px] text-gray-400 leading-tight text-center">{opt.description}</span>}
        </motion.button>
      );
    })}
  </div>
);

// ============ MULTI-SELECT CARD ============
const MultiCardSelect = ({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; label: string; icon: React.ComponentType }[];
  selected: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
    {options.map((opt) => {
      const isSelected = selected.includes(opt.id);
      const Icon = opt.icon;
      return (
        <motion.button
          key={opt.id}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onToggle(opt.id)}
          className={`relative p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[80px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          <Icon />
          <span className="text-sm font-medium text-center leading-tight">{opt.label}</span>
        </motion.button>
      );
    })}
  </div>
);

// ============ MAIN FORM COMPONENT ============
const DEFAULT_SUBMIT_URL = '/api/consultation'

const Form: React.FC<{
  onClose?: () => void
  initialData?: Partial<FormData>
  /**
   * When true, the form renders only Steps 0/1/2 (region, house/roof
   * type, household/usage/devices) - Steps 3 (Address) and 4 (Contact
   * Info) are skipped entirely. The Submit button shows on the last
   * visible step instead of on Step 4. The StepIndicator is recomputed
   * so it shows 3 dots, not 5.
   *
   * Used by /my-plan "Edit details" - those steps carry PII which we
   * deliberately don't prefill from the DB. The user can still submit
   * the form; if they want to update address/contact, they re-enter
   * those fields from scratch on the homepage later (the homepage form
   * still has all 5 steps).
   */
  hideAddressAndContact?: boolean
  /**
   * Override the submit endpoint. Default `/api/consultation` (full
   * register-or-update with all 5 steps). For /my-plan's Edit-details
   * modal we use `/api/consultation/update`, which only accepts the
   * 6 Steps-0/1/2 fields and identifies the row by `plan_token`.
   */
  submitEndpoint?: string
  /**
   * Build the request body. Default sends the full FormData (all 14
   * fields) so the existing /api/consultation contract is unchanged.
   * Override for endpoints that expect a slimmer payload.
   */
  submitPayload?: (formData: FormData) => unknown
  /** Visible label on the final Submit button. Default 'Submit'. */
  submitButtonLabel?: string
  /**
   * Fires after a successful submit, before the inline success screen.
   * The /my-plan host uses this to `window.location.reload()` so the
   * page re-fetches the row with the freshly-updated values.
   */
  onSubmitSuccess?: () => void
}> = ({
  onClose,
  initialData,
  hideAddressAndContact = false,
  submitEndpoint = DEFAULT_SUBMIT_URL,
  submitPayload,
  submitButtonLabel = 'Submit',
  onSubmitSuccess,
}) => {
  // Compressed Edit-details view (hideAddressAndContact = true): the
  // public form's Step 0 (solutionType — already chosen at
  // registration) and Step 3 (contact info — PII, never surfaced) are
  // hidden. 2 data steps + 1 review step = 3 visible steps. The
  // render block below remaps the `step` index 0/1/2 to public form
  // steps 1/2/review so the form reuses the same step-content
  // components.
  const VISIBLE_TOTAL_STEPS = hideAddressAndContact ? 3 : TOTAL_STEPS
  const VISIBLE_LAST_STEP = VISIBLE_TOTAL_STEPS - 1
  const [step, setStep] = useState(0);
  // Defensive clamp: if the prop flips after mount (it doesn't in
  // practice - the modal is unmounted between opens), pull step back
  // into the visible range so we don't render an empty screen.
  useEffect(() => {
    setStep((s) => (s > VISIBLE_LAST_STEP ? VISIBLE_LAST_STEP : s))
  }, [VISIBLE_LAST_STEP])
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitError, setSubmitError] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // optional
    const phoneRegex = /^[+]?[\d\s-()]{7,}$/;
    return phoneRegex.test(phone);
  };

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // 4-step form per docs/修改建议.docx. The Compressed Edit-details
    // view (hideAddressAndContact) reuses the same step array but
    // skips Step 0 (solutionType) and Step 3 (contact) — see
    // VISIBLE_TOTAL_STEPS / VISIBLE_LAST_STEP at the top of the
    // component. The check below is shared.
    switch (step) {
      case 0:
        // Step 1 — solutionType
        if (!formData.solutionType)
          newErrors.solutionType =
            'Please choose what kind of solutions you are interested in.'
        break;
      case 1:
        // Step 2 — city + propertyType
        if (!formData.city)
          newErrors.city = 'Please enter the city your property is in.'
        if (!formData.propertyType)
          newErrors.propertyType = 'Please select a property type.'
        break;
      case 2:
        // Step 3 — householdSize required; generator + fuel optional
        if (!formData.householdSize)
          newErrors.householdSize = 'Please select your household size.'
        break;
      case 3:
        // Step 4 — contact info
        if (!formData.salutation) newErrors.salutation = 'Please choose a salutation.'
        if (!formData.firstName) newErrors.firstName = 'Please enter your first name.'
        if (!formData.lastName) newErrors.lastName = 'Please enter your last name.'
        if (!formData.email) {
          newErrors.email = 'Please enter your email address.'
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address.'
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid Nigerian phone number.'
        }
        break;
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearErrors = () => {
    setErrors({});
  };
  const [formData, setFormData] = useState<FormData>(() => {
    // Lazy init so initialData is only consumed once on mount. Defaults
    // mirror FormData; missing fields fall back to the empty default so
    // a partial prefill (e.g. only city + householdSize) still leaves the
    // other fields blank instead of `undefined`.
    const defaults: FormData = {
      // Step 1
      solutionType: '',
      // Step 2
      city: '',
      propertyType: '',
      // Step 3 — householdSize required; the two NG optional fields
      // default to 'unknown' (sentinel) so the form's "Not sure" path
      // is one click away.
      householdSize: '',
      generatorFrequency: 'unknown',
      fuelBudgetNgn: 'unknown',
      // Step 4
      salutation: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    };
    return initialData ? { ...defaults, ...initialData } : defaults;
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = (): boolean => {
    // Compressed (hideAddressAndContact) view: 3 visible steps - 0
    // and 1 are data entry (skipping the Step-0 solutionType and the
    // Step-3 contact step the public form carries), 2 is the Review
    // step. The Review step is always proceed-able; data correctness
    // was validated on the previous steps.
    if (hideAddressAndContact && step === 2) return true
    switch (step) {
      case 0: return !!formData.solutionType;
      case 1: return !!formData.city && !!formData.propertyType;
      case 2: return !!formData.householdSize;
      case 3:
        return (
          !!formData.salutation &&
          !!formData.firstName &&
          !!formData.lastName &&
          !!formData.email
        );
      default: return false
    }
  }

  const handleBackToHome = () => {
    // Modal context → close the modal; inline context → scroll to top.
    if (onClose) {
      onClose();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    // Default payload = full FormData (used by the homepage flow's
    // /api/consultation). When the host supplies a `submitPayload`
    // builder, we use that instead - /my-plan does this to send a
    // slim 5-field body (Step 2 + Step 3, no PII) to
    // /api/consultation/update.
    const body = submitPayload
      ? submitPayload(formData)
      : {
          // Step 1
          solutionType: formData.solutionType,
          // Step 2
          city: formData.city,
          propertyType: formData.propertyType,
          // Step 3
          householdSize: formData.householdSize,
          // NG optional fields. 'unknown' sentinels map to NULL on the
          // server so admin can render an "unspecified" state without
          // exposing the raw 'unknown' string.
          generatorFrequency: formData.generatorFrequency,
          fuelBudgetNgn: formData.fuelBudgetNgn,
          // Step 4 — contact
          salutation: formData.salutation,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        };

    try {
      const res = await fetch(submitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        if (data.alreadyRegistered) setAlreadyRegistered(true);
        // Notify host (e.g. /my-plan page reloads to refetch the row).
        onSubmitSuccess?.();
        // Success screen renders inline. The "Close" button on the success
        // screen calls onClose() (via handleBackToHome), which closes the
        // modal - matches DE site's "show prompt first, then close" flow.
      } else {
        setSubmitError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction > 0 ? -100 : 100, opacity: 0 }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    if (validateStep()) {
      clearErrors();
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  return (
    <section id="form">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl"/>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0F766E]/3 rounded-full blur-3xl"/>
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-[30px]">
        {/* Form Card */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.01 }}
          transition={{ delay: 0.1 }}
          className="p-6 md:p-10"
        >
          <form
            name="solar-lead"
            method="POST"
            onSubmit={(e) => {
              // Form-level submit (e.g. Enter key inside an input) is
              // intercepted: only allow it from the Review step. Other
              // steps must use the Continue button to advance - the
              // Review step's Confirm button is its own `type="button"`
              // handler below, not a form submit.
              if (step !== VISIBLE_LAST_STEP) {
                e.preventDefault()
                e.stopPropagation()
                return
              }
              void handleSubmit(e)
            }}
          >
            <StepIndicator current={step} total={VISIBLE_TOTAL_STEPS} />

            <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Success Screen */}
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
                  >
                    <Check className="w-10 h-10 text-green-500" strokeWidth={2} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Thank you for your enquiry!
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm">
                    We'll be in touch within 24 hours with your bespoke solar proposal.
                  </p>
                  {alreadyRegistered && (
                    <div className="mb-6 max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      This email address is already registered with us. Your details have been
                      updated. If you haven't heard back yet, please contact our customer service team.
                    </div>
                  )}
                  <button
                    onClick={handleBackToHome}
                    className="px-6 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0B5C56] transition-colors"
                  >
                    {onClose ? 'Close' : 'Back to homepage'}
                  </button>
                </div>
              ) : (
                <>
                  {/* ─── 4-step form per docs/修改建议.docx ──────────────────
                     In the compressed Edit-details view (hideAddressAndContact),
                     Step 0 (solutionType - already chosen at registration)
                     and Step 3 (contact - PII) are hidden. The render block
                     below uses `step` as the visible-step counter (0..N-1)
                     and remaps internally to the matching public-form
                     content. The compressed view's last visible step is a
                     Review summary, NOT the public form's contact step. */}

                  {/* Step 0 (public only): solutionType */}
                  {!hideAddressAndContact && step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          What kind of solutions are you interested in?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Pick the option that best describes your project.
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: 'home', label: 'Home Solar solutions' },
                            { id: 'business', label: 'Business Solar solutions' },
                            { id: 'exploring', label: "I'm not sure / Just exploring" },
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                updateField('solutionType', opt.id as 'home' | 'business' | 'exploring')
                                clearErrors()
                              }}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                formData.solutionType === opt.id
                                  ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                                  : 'border-gray-200 text-gray-700 hover:border-[#0F766E]/40'
                              }`}
                            >
                              <span className="font-medium">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.solutionType && (
                          <p className="text-red-500 text-xs mt-2">{errors.solutionType}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 1 (public + compressed step 0): city + propertyType */}
                  {((!hideAddressAndContact && step === 1) || (hideAddressAndContact && step === 0)) && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Which city is your property in?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Pick the closest city. We'll use this to estimate solar
                          yield and route your enquiry to the right team.
                        </p>
                        <select
                          value={formData.city}
                          onChange={e => { updateField('city', e.target.value); clearErrors() }}
                          className={`w-full px-4 py-3 border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all appearance-none bg-white`}
                        >
                          <option value="">Please select...</option>
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Which property type best describes your home or business?
                        </label>
                        <div className="grid grid-cols-1 gap-3">
                          {[
                            { id: 'detached-semi', label: 'Detached / Duplex' },
                            { id: 'terraced-apt', label: 'Terraced / Apartment' },
                            { id: 'commercial', label: 'Commercial / Shop' },
                            { id: 'others', label: 'Others' },
                          ].map(opt => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                updateField('propertyType', opt.id)
                                clearErrors()
                              }}
                              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                formData.propertyType === opt.id
                                  ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                                  : 'border-gray-200 text-gray-700 hover:border-[#0F766E]/40'
                              }`}
                            >
                              <span className="font-medium">{opt.label}</span>
                            </button>
                          ))}
                        </div>
                        {errors.propertyType && (
                          <p className="text-red-500 text-xs mt-2">{errors.propertyType}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2 (public + compressed step 1): household + generator + fuel */}
                  {((!hideAddressAndContact && step === 2) || (hideAddressAndContact && step === 1)) && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          How many people live in your household? <span className="text-red-500">*</span>
                        </label>
                        <CardSelect
                          options={HOUSEHOLD_SIZES as CardOption[]}
                          selected={formData.householdSize}
                          onSelect={id => { updateField('householdSize', id); clearErrors() }}
                          columns={5}
                        />
                        {errors.householdSize && <p className="text-red-500 text-xs mt-2">{errors.householdSize}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          How often do you use a generator?
                          <span className="font-normal text-gray-400 ml-2 text-xs">(optional)</span>
                        </label>
                        <CardSelect
                          options={GENERATOR_FREQUENCY as CardOption[]}
                          selected={formData.generatorFrequency ?? 'unknown'}
                          onSelect={id => updateField('generatorFrequency', id)}
                          columns={4}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          How much do you spend on generator fuel each month?
                          <span className="font-normal text-gray-400 ml-2 text-xs">(optional)</span>
                        </label>
                        <CardSelect
                          options={FUEL_BUDGET_NGN as CardOption[]}
                          selected={formData.fuelBudgetNgn ?? 'unknown'}
                          onSelect={id => updateField('fuelBudgetNgn', id)}
                          columns={5}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 (compressed only): Review + Confirm. Shown at the
                       end of the Edit-details flow as the final visible step.
                       Reads back solutionType (seeded via initialData) +
                       city + propertyType + household + generator + fuel. */}
                  {hideAddressAndContact && step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Review your changes
                        </h3>
                        <p className="text-sm text-gray-500">
                          Confirm the consultation details you want to apply to your plan.
                        </p>
                      </div>

                      <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">Solution</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {formData.solutionType === 'home'
                              ? 'Home Solar solutions'
                              : formData.solutionType === 'business'
                                ? 'Business Solar solutions'
                                : formData.solutionType === 'exploring'
                                  ? "I'm not sure / Just exploring"
                                  : '-'}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">City</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {formData.city || '-'}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">Property type</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {formData.propertyType || '-'}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">Household</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {formData.householdSize || '-'}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">Generator use</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {labelFor(formData.generatorFrequency, GENERATOR_FREQUENCY, 'Not specified')}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <dt className="text-sm text-gray-500">Monthly fuel budget</dt>
                          <dd className="text-sm font-medium text-gray-800">
                            {labelFor(formData.fuelBudgetNgn, FUEL_BUDGET_NGN, 'Not specified')}
                          </dd>
                        </div>
                      </dl>

                      <p className="text-xs text-gray-400 leading-relaxed">
                        By confirming, your plan will be re-calculated using these
                        details. Contact information is unchanged.
                      </p>
                    </div>
                  )}

                  {/* Step 3 (public only): Contact Info. PII — never rendered in
                       the Edit-details compressed view. */}
                  {!hideAddressAndContact && step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          How can we reach you?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          We'll send your personalised quote by email.
                        </p>
                      </div>

                      {/* Salutation */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-2">Salutation</label>
                        <div className="flex gap-3">
                          {['Mr', 'Mrs', 'Ms', 'Mx', 'Other'].map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => { updateField('salutation', s); clearErrors(); }}
                              className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                                formData.salutation === s
                                  ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E]'
                                  : errors.salutation ? 'border-red-500' : 'border-gray-200 text-gray-600 hover:border-[#0F766E]/40'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {errors.salutation && <p className="text-red-500 text-xs mt-1">{errors.salutation}</p>}
                      </div>

                      {/* Name */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">First name</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => { updateField('firstName', e.target.value); clearErrors(); }}
                            placeholder="Alex"
                            className={`w-full px-4 py-3 border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Last name</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => { updateField('lastName', e.target.value); clearErrors(); }}
                            placeholder="Smith"
                            className={`w-full px-4 py-3 border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      {/* Email + Phone */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => { updateField('email', e.target.value); clearErrors(); }}
                          placeholder="alex.smith@example.com"
                          className={`w-full px-4 py-3 border-2 ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          Phone <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => { updateField('phone', e.target.value); clearErrors(); }}
                          placeholder="+234 800 000 0000"
                          className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Privacy */}
                      <p className="text-xs text-gray-400 leading-relaxed">
                        By submitting, you agree to our{' '}
                        <a href="/privacy/" className="text-[#0F766E] underline">Privacy Policy</a>.
                        Your data is used solely to prepare your quote.
                      </p>

                      {submitError && (
                        <p className="text-red-500 text-sm text-center">{submitError}</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>

            {/* Navigation Buttons - hidden after a successful submit so the
                user can't trigger a duplicate POST. The success screen
                renders its own Close / Back to homepage button.

                Sticky to the bottom of the form (inside the AnimatePresence's
                parent form, not the page) so Continue is always within reach
                even when the Step 2 fields push the button off-screen on
                shorter viewports. A semi-opaque white background + border-top
                keep the sticky bar visually separated from the form fields
                above. */}
            {!isSubmitted && (
          <div className="sticky bottom-0 -mx-6 sm:-mx-10 mt-10 pt-4 pb-2 px-6 sm:px-10 bg-white/95 backdrop-blur-sm border-t border-gray-100 flex justify-between items-center">
            {step > 0 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < VISIBLE_LAST_STEP ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-[#0F766E] text-white hover:bg-[#0B5C56] shadow-lg shadow-[#0F766E]/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  // Explicit button-click handler - bound directly to the
                  // Review step's button only. We avoid `type="submit"`
                  // because that routes through <form onSubmit>, which
                  // would also fire on Enter keypress in any input above.
                  e.preventDefault()
                  void handleSubmit(
                    e as unknown as React.FormEvent<HTMLFormElement>,
                  )
                }}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  canProceed() && !isSubmitting
                    ? 'bg-[#0F766E] text-white hover:bg-[#0B5C56] shadow-lg shadow-[#0F766E]/25'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {submitButtonLabel}
                    <BadgeCheck className="w-5 h-5" strokeWidth={2} />
                  </>
                )}
              </button>
            )}
          </div>
            )}
          </form>
        </motion.div>

        {/* Trust badges below form */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            100% no obligation
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            Nigeria Data Protection Regulation compliant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
            </span>
            Reply within 24 hours
          </span>
        </div>
      </div>
    </section>
  );
};

export default Form;