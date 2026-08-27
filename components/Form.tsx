import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight, Loader2, BadgeCheck } from 'lucide-react';
import type { FormData } from '@/lib/form-types';

// ============ SVG ICONS ============

const HouseDetached = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M40 10L8 35V70H72V35L40 10Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="32" y="45" width="16" height="25" stroke="currentColor" strokeWidth="2"/>
    <rect x="15" y="40" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="53" y="40" width="12" height="12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M40 10L5 37" stroke="currentColor" strokeWidth="2"/>
    <path d="M40 10L75 37" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const HouseSemiDetached = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M20 15L4 32V70H40V32L20 15Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M60 15L40 32V70H76V32L60 15Z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="14" y="45" width="10" height="25" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="54" y="45" width="10" height="25" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="10" y="36" width="8" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="56" y="36" width="8" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="40" y1="32" x2="40" y2="70" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2"/>
  </svg>
);

const HouseTerraced = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="4" y="30" width="24" height="40" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="28" y="30" width="24" height="40" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="52" y="30" width="24" height="40" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M4 30L16 18L28 30" stroke="currentColor" strokeWidth="2"/>
    <path d="M28 30L40 18L52 30" stroke="currentColor" strokeWidth="2"/>
    <path d="M52 30L64 18L76 30" stroke="currentColor" strokeWidth="2"/>
    <rect x="11" y="50" width="8" height="20" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="36" y="50" width="8" height="20" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="60" y="50" width="8" height="20" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const HouseApartment = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="12" y="10" width="56" height="60" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="20" y="18" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="35" y="18" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="50" y="18" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="20" y="32" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="35" y="32" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="50" y="32" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="20" y="46" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="35" y="46" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="50" y="46" width="10" height="8" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="33" y="58" width="14" height="12" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const RoofGable = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M10 50L40 20L70 50" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="10" y="50" width="60" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M15 50L40 25L65 50" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>
    {/* Solar panels on roof */}
    <rect x="20" y="32" width="8" height="5" stroke="currentColor" strokeWidth="1" transform="rotate(-33 24 34.5)" opacity="0.6"/>
    <rect x="30" y="27" width="8" height="5" stroke="currentColor" strokeWidth="1" transform="rotate(-33 34 29.5)" opacity="0.6"/>
  </svg>
);

const RoofFlat = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <rect x="10" y="35" width="60" height="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="10" y="40" width="60" height="30" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Solar panels on flat roof */}
    <path d="M20 35L20 30L30 30L30 35" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M35 35L35 30L45 30L45 35" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    <path d="M50 35L50 30L60 30L60 35" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
  </svg>
);

const RoofHip = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M25 35L40 20L55 35" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 50L25 35L55 35L70 50" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="50" width="60" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="25" y1="35" x2="10" y2="50" stroke="currentColor" strokeWidth="2"/>
    <line x1="55" y1="35" x2="70" y2="50" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const RoofPent = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
    <path d="M10 50L10 30L70 42L70 50" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="10" y="50" width="60" height="20" stroke="currentColor" strokeWidth="2" fill="none"/>
    {/* Solar panel indication */}
    <rect x="18" y="34" width="12" height="6" stroke="currentColor" strokeWidth="1" transform="rotate(-10 24 37)" opacity="0.6"/>
    <rect x="38" y="37" width="12" height="6" stroke="currentColor" strokeWidth="1" transform="rotate(-10 44 40)" opacity="0.6"/>
  </svg>
);

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
  'England – South East',
  'England – South West',
  'England – London',
  'England – East',
  'England – East Midlands',
  'England – West Midlands',
  'England – Yorkshire & the Humber',
  'England – North West',
  'England – North East',
  'Wales',
  'Scotland',
  'Northern Ireland',
];

const HOUSE_TYPES = [
  { id: 'detached', label: 'Detached house', icon: HouseDetached },
  { id: 'semi-detached', label: 'Semi-detached', icon: HouseSemiDetached },
  { id: 'terraced', label: 'Terraced house', icon: HouseTerraced },
  { id: 'apartment', label: 'Flat / Apartment', icon: HouseApartment },
];

const ROOF_TYPES = [
  { id: 'gable', label: 'Pitched (gable)', icon: RoofGable },
  { id: 'hip', label: 'Hipped', icon: RoofHip },
  { id: 'flat', label: 'Flat roof', icon: RoofFlat },
  { id: 'pent', label: 'Mono-pitched', icon: RoofPent },
];

const HOUSEHOLD_SIZES = [
  { id: '1', label: '1 person', count: 1 },
  { id: '2', label: '2 people', count: 2 },
  { id: '3', label: '3 people', count: 3 },
  { id: '4', label: '4 people', count: 4 },
  { id: '5+', label: '5+ people', count: 5 },
];

const ELECTRICITY_USAGE = [
  { id: 'low', label: 'Low', description: '< 3,000 kWh/year', emoji: '💡' },
  { id: 'medium', label: 'Medium', description: '3,000–5,000 kWh/year', emoji: '⚡' },
  { id: 'high', label: 'High', description: '5,000–8,000 kWh/year', emoji: '🔌' },
  { id: 'very-high', label: 'Very high', description: '> 8,000 kWh/year', emoji: '🏭' },
];

const DEVICES = [
  { id: 'wallbox', label: 'EV charger / EV', icon: WallboxIcon },
  { id: 'heatpump', label: 'Heat pump', icon: HeatPumpIcon },
  { id: 'ac', label: 'Air conditioning', icon: ACIcon },
];

// ============ STEP COMPONENT ============
const TOTAL_STEPS = 5;

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
  <div className={`grid grid-cols-2 ${columns >= 4 ? 'md:grid-cols-4' : columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3`}>
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
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[120px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          {Icon && <Icon />}
          {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
          {opt.count !== undefined && <PersonIcon count={opt.count} />}
          <span className="text-sm font-medium text-center leading-tight">{opt.label}</span>
          {opt.description && <span className="text-xs text-gray-400">{opt.description}</span>}
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
  <div className="grid grid-cols-3 gap-3">
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
          className={`relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 min-h-[100px] ${
            isSelected
              ? 'border-[#0F766E] bg-[#0F766E]/5 text-[#0F766E] shadow-md'
              : 'border-gray-200 bg-white hover:border-[#0F766E]/40 hover:bg-gray-50 text-gray-600'
          }`}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-[#0F766E] rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
          <Icon />
          <span className="text-sm font-medium text-center">{opt.label}</span>
        </motion.button>
      );
    })}
  </div>
);

// ============ MAIN FORM COMPONENT ============
const CONSULTATION_API_URL = '/api/consultation'

const Form: React.FC<{ onSuccess?: () => void; onClose?: () => void }> = ({ onSuccess, onClose }) => {
  const [step, setStep] = useState(0);
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

    switch (step) {
      case 0:
        if (!formData.region) newErrors.region = 'Please select your region.';
        if (!formData.houseType) newErrors.houseType = 'Please select a property type.';
        break;
      case 1:
        if (!formData.roofType) newErrors.roofType = 'Please select a roof type.';
        break;
      case 2:
        if (!formData.householdSize) newErrors.householdSize = 'Please select your household size.';
        if (!formData.electricityUsage) newErrors.electricityUsage = 'Please estimate your annual electricity consumption.';
        break;
      case 3:
        if (!formData.street) newErrors.street = 'Please enter your street.';
        if (!formData.postalCode) newErrors.postalCode = 'Please enter your postcode.';
        if (!formData.city) newErrors.city = 'Please enter your town or city.';
        break;
      case 4:
        if (!formData.salutation) newErrors.salutation = 'Please choose a salutation.';
        if (!formData.firstName) newErrors.firstName = 'Please enter your first name.';
        if (!formData.lastName) newErrors.lastName = 'Please enter your last name.';
        if (!formData.email) {
          newErrors.email = 'Please enter your email address.';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Please enter a valid UK phone number.';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };
  const [formData, setFormData] = useState<FormData>({
    region: '',
    houseType: '',
    roofType: '',
    householdSize: '',
    electricityUsage: '',
    devices: [],
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    salutation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDevice = (deviceId: string) => {
    setFormData(prev => ({
      ...prev,
      devices: prev.devices.includes(deviceId)
        ? prev.devices.filter(d => d !== deviceId)
        : [...prev.devices, deviceId]
    }));
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!formData.region && !!formData.houseType;
      case 1: return !!formData.roofType;
      case 2: return !!formData.householdSize && !!formData.electricityUsage;
      case 3: return !!formData.street && !!formData.postalCode && !!formData.city;
      case 4: return !!formData.salutation && !!formData.firstName && !!formData.lastName && !!formData.email;
      default: return false;
    }
  };

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

    try {
      const res = await fetch(CONSULTATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          salutation: formData.salutation,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          houseNumber: formData.houseNumber,
          postalCode: formData.postalCode,
          city: formData.city,
          region: formData.region,
          houseType: formData.houseType,
          roofType: formData.roofType,
          householdSize: formData.householdSize,
          electricityUsage: formData.electricityUsage,
          devices: formData.devices,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        if (data.alreadyRegistered) setAlreadyRegistered(true);
        // Modal context: signal success so the host can close / navigate.
        // Outside of a modal this is a no-op (handler is undefined).
        onSuccess?.();
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
            onSubmit={handleSubmit}
          >
            <StepIndicator current={step} total={TOTAL_STEPS} />

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
                  {/* Step 0: Region + House Type */}
                  {step === 0 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Where is your home located?
                        </label>
                        <select
                          value={formData.region}
                          onChange={e => { updateField('region', e.target.value); clearErrors(); }}
                          className={`w-full px-4 py-3 border-2 ${errors.region ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all appearance-none bg-white`}
                        >
                          <option value="">Please select…</option>
                          {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Which property type best describes your home?
                        </label>
                        <CardSelect
                          options={HOUSE_TYPES as CardOption[]}
                          selected={formData.houseType}
                          onSelect={id => { updateField('houseType', id); clearErrors(); }}
                        />
                        {errors.houseType && <p className="text-red-500 text-xs mt-1">{errors.houseType}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 1: Roof Type */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          What type of roof does your home have?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          Pick the shape that most closely matches your roof.
                        </p>
                        <CardSelect
                          options={ROOF_TYPES as CardOption[]}
                          selected={formData.roofType}
                          onSelect={id => { updateField('roofType', id); clearErrors(); }}
                        />
                        {errors.roofType && <p className="text-red-500 text-xs mt-2">{errors.roofType}</p>}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Household + Electricity */}
                  {step === 2 && (
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          How many people live in your household?
                        </label>
                        <CardSelect
                          options={HOUSEHOLD_SIZES as CardOption[]}
                          selected={formData.householdSize}
                          onSelect={id => { updateField('householdSize', id); clearErrors(); }}
                          columns={5}
                        />
                        {errors.householdSize && <p className="text-red-500 text-xs mt-2">{errors.householdSize}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          How would you estimate your annual electricity use?
                        </label>
                        <CardSelect
                          options={ELECTRICITY_USAGE as CardOption[]}
                          selected={formData.electricityUsage}
                          onSelect={id => { updateField('electricityUsage', id); clearErrors(); }}
                        />
                        {errors.electricityUsage && <p className="text-red-500 text-xs mt-2">{errors.electricityUsage}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-3">
                          Do you already have any of these devices?
                          <span className="font-normal text-gray-400 ml-2">(optional, multi-select)</span>
                        </label>
                        <MultiCardSelect
                          options={DEVICES}
                          selected={formData.devices}
                          onToggle={toggleDevice}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Where should the system be installed?
                        </label>
                        <p className="text-sm text-gray-400 mb-4">
                          We need your address for an accurate satellite-based roof analysis.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Street</label>
                          <input
                            type="text"
                            value={formData.street}
                            onChange={e => { updateField('street', e.target.value); clearErrors(); }}
                            placeholder="e.g. High Street"
                            className={`w-full px-4 py-3 border-2 ${errors.street ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">House No.</label>
                          <input
                            type="text"
                            value={formData.houseNumber}
                            onChange={e => updateField('houseNumber', e.target.value)}
                            placeholder="12a"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Postcode</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={e => { updateField('postalCode', e.target.value); clearErrors(); }}
                            placeholder="SW1 1AA"
                            maxLength={8}
                            className={`w-full px-4 py-3 border-2 ${errors.postalCode ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">Town / City</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={e => { updateField('city', e.target.value); clearErrors(); }}
                            placeholder="London"
                            className={`w-full px-4 py-3 border-2 ${errors.city ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                          />
                          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Info */}
                  {step === 4 && (
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
                          placeholder="alex.smith@example.co.uk"
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
                          placeholder="+44 7700 900000"
                          className={`w-full px-4 py-3 border-2 ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl text-gray-700 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                      </div>

                      {/* Privacy */}
                      <p className="text-xs text-gray-400 leading-relaxed">
                        By submitting, you agree to our{' '}
                        <a href="/privacy" className="text-[#0F766E] underline">Privacy Policy</a>.
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

            {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
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

            {step < TOTAL_STEPS - 1 ? (
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
                type="submit"
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
                    Sending…
                  </>
                ) : (
                  <>
                    Request quote
                    <BadgeCheck className="w-5 h-5" strokeWidth={2} />
                  </>
                )}
              </button>
            )}
          </div>
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
            UK GDPR compliant
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