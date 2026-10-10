import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContact } from '../../services/api';
import styles from './Contact.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Availability config ──────────────────────────────────────────
const AVAILABILITY = {
  available: true,
  label: 'Available for Select Projects',
  hoverLabel: 'Available for Collaboration',
};

// ─── Contact info (left column) ──────────────────────────────────
const CONTACT_INFO = [
  {
    id: 'email',
    label: 'EMAIL',
    value: 'chinmaywadhwa01@gmail.com',
    href: 'mailto:chinmaywadhwa01@gmail.com',
    action: 'copy',
    cursorText: 'COPY',
    accent: 'lavender',
    iconPath: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id: 'phone',
    label: 'PHONE',
    value: '+91 8290087742',
    href: 'tel:+918290087742',
    action: 'call',
    cursorText: 'CALL',
    accent: 'sage',
    iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  },
  {
    id: 'location',
    label: 'LOCATION',
    value: 'Jaipur, Rajasthan, India',
    href: '#',
    action: 'none',
    cursorText: 'LOCATION',
    accent: 'peach',
    iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

// ─── SVG Paper Plane ──────────────────────────────────────────────
const PaperPlaneIcon = ({ className = '', size = 18 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ─── Drawing Checkmark SVG (Requirement 7) ────────────────────────
const StageCheckmark = ({ isComplete, color = '#4D6E52', size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={styles.stageCheckmarkSvg}
    aria-hidden="true"
  >
    <path
      d="M3.2 8.2L6.4 11.4L12.8 4.6"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${styles.checkmarkPath} ${isComplete ? styles.checkmarkPathDrawn : ''}`}
    />
  </svg>
);

// ─── Validation Helpers ───────────────────────────────────────────
function validateField(name, value) {
  const trimmed = (value || '').trim();
  if (!trimmed) {
    if (name === 'name') return 'NAME REQUIRED';
    if (name === 'email') return 'EMAIL REQUIRED';
    if (name === 'message') return 'MESSAGE REQUIRED';
  }
  if (name === 'name' && trimmed.length < 2) {
    return 'MINIMUM 2 CHARACTERS';
  }
  if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return 'INVALID EMAIL FORMAT';
  }
  if (name === 'message' && trimmed.length < 10) {
    return 'MINIMUM 10 CHARACTERS';
  }
  return '';
}

// ─── Web Audio API Sound Synthesizer ─────────────────────────────
let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Gentle transmission launch sound (soft rising acoustic pulse)
 */
function playLaunchSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + 0.45);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.35);

    osc.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.46);
  } catch (err) {
    // Autoplay restrictions or audio error
  }
}

/**
 * Warm harmonic success chime (C5-E5-G5-C6 soft bell chord on delivery)
 */
function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chord = [
      { freq: 523.25, delay: 0.00, gain: 0.07, duration: 0.9 }, // C5
      { freq: 659.25, delay: 0.07, gain: 0.06, duration: 1.1 }, // E5
      { freq: 783.99, delay: 0.14, gain: 0.05, duration: 1.3 }, // G5
      { freq: 1046.50, delay: 0.22, gain: 0.04, duration: 1.5 }, // C6
    ];

    chord.forEach(({ freq, delay, gain, duration }) => {
      const startTime = now + delay;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      noteGain.gain.setValueAtTime(0.0001, startTime);
      noteGain.gain.linearRampToValueAtTime(gain, startTime + 0.025);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(noteGain);
      noteGain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch (err) {
    // Graceful fallback
  }
}

/**
 * Subtle preview sound when clicking the paper plane directly
 */
function playPreviewSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  } catch (err) {
    // Graceful fallback
  }
}

// ─── Main Transmission Contact Component ──────────────────────────
const Contact = () => {
  // Form input data
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState('');
  
  // Phase state machine: 'idle' | 'preparing' | 'transmitting' | 'flying' | 'success' | 'error'
  const [formPhase, setFormPhase] = useState('idle');
  const [easterEggStatus, setEasterEggStatus] = useState('');
  const [copyState, setCopyState] = useState('idle');

  // DOM Refs for GSAP & Physics
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const availRef = useRef(null);
  const formWrapperRef = useRef(null);
  const cardRef = useRef(null);
  const btnRef = useRef(null);
  const planeIconRef = useRef(null);
  const btnLabelRef = useRef(null);

  // Flight animation refs
  const flightPlaneRef = useRef(null);
  const particlesRef = useRef([]);
  const successCircleRef = useRef(null);
  const successTickRef = useRef(null);

  // Accessible input element refs
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

  // Environment flags
  const isTouchDevice = useRef(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // ── Validation flags ────────────────────────────────────────────
  const isNameValid = useMemo(() => {
    return formData.name.trim().length >= 2;
  }, [formData.name]);

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  }, [formData.email]);

  const isMessageValid = useMemo(() => {
    return formData.message.trim().length >= 10;
  }, [formData.message]);

  const isAllValid = isNameValid && isEmailValid && isMessageValid;

  // ── Live Mission Telemetry Status Text (Requirements 1, 3, 4, 5, 16) ──
  const liveStatusText = useMemo(() => {
    if (easterEggStatus) return easterEggStatus;
    if (formPhase === 'preparing') return 'PREPARING...';
    if (formPhase === 'transmitting') return 'TRANSMITTING...';
    if (formPhase === 'flying') return 'TRANSMITTING...';
    if (formPhase === 'success') return 'MESSAGE DELIVERED ✓';
    if (formPhase === 'error') return 'TRANSMISSION FAILED';

    if (isAllValid) return 'TRANSMISSION READY';

    if (focused === 'name') {
      return isNameValid ? 'NAME VERIFIED ✓' : 'IDENTIFY YOURSELF';
    }
    if (focused === 'email') {
      return isEmailValid ? 'CHANNEL READY ✓' : 'ESTABLISHING CHANNEL';
    }
    if (focused === 'message') {
      return isMessageValid ? 'SIGNAL COMPOSED ✓' : 'WHAT ARE WE BUILDING?';
    }

    if (isNameValid && isEmailValid) return 'SIGNAL COMPOSED ○';
    if (isNameValid) return 'CHANNEL PENDING ○';
    return 'READY TO CONNECT';
  }, [easterEggStatus, formPhase, isAllValid, focused, isNameValid, isEmailValid, isMessageValid]);

  // ── Section Entrance Animation (ScrollTrigger) ──────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (prefersReducedMotion.current) {
      [eyebrowRef, titleRef, subtitleRef, availRef].forEach(r => {
        if (r.current) r.current.style.opacity = 1;
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Eyebrow
      gsap.fromTo(eyebrowRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 80%', once: true } }
      );

      // Title words staggered reveal
      const words = titleRef.current?.querySelectorAll(`.${styles.titleWord}`);
      if (words?.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 32, clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)' },
          { opacity: 1, y: 0, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            duration: 0.75, stagger: 0.065, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true }, delay: 0.15 }
        );
      }

      // Subtitle
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true }, delay: 0.5 }
      );

      // Availability indicator
      if (availRef.current) {
        gsap.fromTo(availRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.5)',
            scrollTrigger: { trigger: section, start: 'top 75%', once: true }, delay: 0.65 }
        );
      }

      // Transmission Card entrance
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 72%', once: true }, delay: 0.3 }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // ── Form Parallax (Requirement 20 - max 2px) ───────────────────
  const handleContainerMouseMove = useCallback((e) => {
    if (isTouchDevice.current || !cardRef.current || !formWrapperRef.current) return;
    const rect = formWrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    const px = Math.max(-2, Math.min(2, x * 2));
    const py = Math.max(-2, Math.min(2, y * 2));

    gsap.to(cardRef.current, {
      x: px,
      y: py,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  const handleContainerMouseLeave = useCallback(() => {
    if (isTouchDevice.current || !cardRef.current) return;
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }, []);

  // ── Button Magnetism Physics (Requirements 10 & 19 - max 4-6px) ──
  const handleBtnMouseMove = useCallback((e) => {
    if (isTouchDevice.current || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const bx = Math.max(-5, Math.min(5, dx * 0.22));
    const by = Math.max(-5, Math.min(5, dy * 0.22));
    gsap.to(btnRef.current, { x: bx, y: by, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });

    if (planeIconRef.current) {
      const px = Math.max(-8, Math.min(8, dx * 0.38 + 3));
      const py = Math.max(-8, Math.min(8, dy * 0.38 - 2));
      gsap.to(planeIconRef.current, { x: px, y: py, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
    }

    if (btnLabelRef.current) {
      const tx = Math.max(-2, Math.min(2, dx * 0.08));
      const ty = Math.max(-2, Math.min(2, dy * 0.08));
      gsap.to(btnLabelRef.current, { x: tx, y: ty, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
    }
  }, []);

  const handleBtnMouseLeave = useCallback(() => {
    if (isTouchDevice.current) return;
    if (btnRef.current) {
      gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }
    if (planeIconRef.current) {
      gsap.to(planeIconRef.current, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }
    if (btnLabelRef.current) {
      gsap.to(btnLabelRef.current, { x: 0, y: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    }
  }, []);

  // ── Hidden Micro-Interaction on Paper Plane (Requirement 17) ─────
  const handlePlaneMicroInteraction = useCallback((e) => {
    e.stopPropagation();
    if (isAllValid && formPhase === 'idle') {
      handleSubmit(e);
      return;
    }

    playPreviewSound();

    if (planeIconRef.current) {
      gsap.killTweensOf(planeIconRef.current);
      gsap.to(planeIconRef.current, {
        x: 14,
        y: -10,
        rotation: -20,
        duration: 0.22,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(planeIconRef.current, { x: 0, y: 0, rotation: 0, duration: 0.2 });
        }
      });
    }

    setEasterEggStatus('ENGINES PRIMED · COMPLETE STAGES TO LAUNCH');
    const timer = setTimeout(() => {
      setEasterEggStatus('');
    }, 2400);
    return () => clearTimeout(timer);
  }, [isAllValid, formPhase]);

  // ── Input Event Handlers ────────────────────────────────────────
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  }, [touched]);

  const handleInputFocus = useCallback((fieldName) => {
    setFocused(fieldName);
  }, []);

  const handleInputBlur = useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    setFieldErrors(prev => ({ ...prev, [fieldName]: validateField(fieldName, formData[fieldName]) }));
    setFocused('');
  }, [formData]);

  // ── Keyboard Navigation (Requirement 6) ────────────────────────
  const handleKeyDownName = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isNameValid) {
        setTouched(prev => ({ ...prev, name: true }));
        setFieldErrors(prev => ({ ...prev, name: validateField('name', formData.name) }));
      }
      emailInputRef.current?.focus();
    }
  }, [isNameValid, formData.name]);

  const handleKeyDownEmail = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isEmailValid) {
        setTouched(prev => ({ ...prev, email: true }));
        setFieldErrors(prev => ({ ...prev, email: validateField('email', formData.email) }));
      }
      messageInputRef.current?.focus();
    }
  }, [isEmailValid, formData.email]);

  const handleKeyDownMessage = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [isAllValid, formData]);

  // ── Copy email helper ───────────────────────────────────────────
  const handleEmailCopy = useCallback(async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText('chinmaywadhwa01@gmail.com');
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch {
      window.location.href = 'mailto:chinmaywadhwa01@gmail.com';
    }
  }, []);

  // ── Success Celebration Animation (Requirement 15) ─────────────
  const triggerSuccessCelebration = useCallback(() => {
    // Play warm harmonic success chime
    playSuccessSound();

    // 1. Draw SVG checkmark
    if (successCircleRef.current && successTickRef.current) {
      gsap.fromTo(successCircleRef.current,
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      );
      gsap.fromTo(successTickRef.current,
        { strokeDashoffset: 60 },
        { strokeDashoffset: 0, duration: 0.45, ease: 'power3.out', delay: 0.5 }
      );
    }

    // 2. Pastel particles & tiny lines burst
    const dots = particlesRef.current.filter(Boolean);
    if (!dots.length) return;

    dots.forEach((dot, i) => {
      const angle = (i / dots.length) * Math.PI * 2 + (Math.random() * 0.2 - 0.1);
      const dist = 38 + Math.random() * 32;
      const targetX = Math.cos(angle) * dist;
      const targetY = Math.sin(angle) * dist;

      gsap.fromTo(dot,
        { opacity: 0, scale: 0, x: 0, y: 0 },
        {
          opacity: 1,
          scale: 1,
          x: targetX,
          y: targetY,
          duration: 0.45,
          ease: 'back.out(2)',
          delay: i * 0.025,
        }
      );
      gsap.to(dot, {
        opacity: 0,
        scale: 0.2,
        duration: 0.4,
        ease: 'power2.in',
        delay: 0.55 + i * 0.02,
      });
    });
  }, []);

  // ── Paper Plane Game Flight Sequence (Requirement 13) ───────────
  const launchPaperPlaneFlight = useCallback(() => {
    if (prefersReducedMotion.current) {
      setFormPhase('success');
      setTimeout(() => triggerSuccessCelebration(), 100);
      return;
    }

    const planeEl = flightPlaneRef.current;
    const cardEl = cardRef.current;
    const btnEl = btnRef.current;

    if (!planeEl || !cardEl || !btnEl) {
      setFormPhase('success');
      setTimeout(() => triggerSuccessCelebration(), 100);
      return;
    }

    setFormPhase('flying');

    const cardRect = cardEl.getBoundingClientRect();
    const btnRect = btnEl.getBoundingClientRect();

    const startX = btnRect.left - cardRect.left + 35;
    const startY = btnRect.top - cardRect.top + 16;
    const midX = cardRect.width * 0.55;
    const midY = cardRect.height * 0.4;
    const endX = cardRect.width * 0.82;
    const endY = 60;

    gsap.set(planeEl, {
      x: startX,
      y: startY,
      rotation: -10,
      scale: 1,
      opacity: 1,
      display: 'block',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(planeEl, { display: 'none' });
        setFormPhase('success');
        setTimeout(() => triggerSuccessCelebration(), 50);
      },
    });

    // Animate curved flight path across container
    tl.to(planeEl, {
      duration: 0.75,
      ease: 'power2.inOut',
      keyframes: [
        { x: startX + 50, y: startY - 40, rotation: -25, scale: 1.05, duration: 0.25 },
        { x: midX, y: midY, rotation: -38, scale: 0.95, duration: 0.25 },
        { x: endX, y: endY, rotation: -48, scale: 0.6, opacity: 0, duration: 0.25 },
      ],
    });
  }, [triggerSuccessCelebration]);

  // ── Form Submission Handler (Requirements 11, 12) ───────────────
  const handleSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (formPhase === 'preparing' || formPhase === 'transmitting' || formPhase === 'flying') return;

    // Validate all fields
    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const msgErr = validateField('message', formData.message);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      message: msgErr,
    };
    setTouched({ name: true, email: true, message: true });
    setFieldErrors(newErrors);

    // If validation fails, activate first invalid stage smoothly (Requirement 11)
    if (nameErr) {
      nameInputRef.current?.focus();
      return;
    }
    if (emailErr) {
      emailInputRef.current?.focus();
      return;
    }
    if (msgErr) {
      messageInputRef.current?.focus();
      return;
    }

    // Play subtle launch sound
    playLaunchSound();

    // Progression: LAUNCH TRANSMISSION -> PREPARING... -> TRANSMITTING...
    setFormPhase('preparing');

    // Immediate real API call (no artificial delay - Requirement 12)
    const apiPromise = submitContact(formData);

    setTimeout(() => {
      setFormPhase('transmitting');
    }, 220);

    const result = await apiPromise;

    if (result && result.success) {
      try {
        sessionStorage.setItem('contact_submitted', 'true');
      } catch (e) {
        // Ignore private browsing storage quota issues
      }
      launchPaperPlaneFlight();
    } else {
      setFormPhase('error');
    }
  }, [formData, formPhase, launchPaperPlaneFlight]);

  // ── Reset Form (Requirement 23 - SEND ANOTHER) ───────────────────
  const handleReset = useCallback(() => {
    setFormData({ name: '', email: '', message: '' });
    setFieldErrors({});
    setTouched({});
    setFormPhase('idle');
    setEasterEggStatus('');
  }, []);

  const titleWords = ["Let's", 'Start', 'a', 'Conversation'];

  return (
    <section id="contact" ref={sectionRef} className={styles.contact}>
      <div className={styles.container}>

        {/* ─── SECTION HEADER ──────────────────────────────── */}
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrowRow}>
            <div ref={eyebrowRef} className={styles.eyebrow}>
              <span className={styles.eyebrowNum}>(05)</span>
              <span>INQUIRIES &amp; COLLABORATION</span>
            </div>

            {/* Availability indicator */}
            {AVAILABILITY.available && (
              <div
                ref={availRef}
                className={styles.availabilityPill}
                title={AVAILABILITY.hoverLabel}
                aria-label={AVAILABILITY.label}
              >
                <span className={styles.availDot} />
                <span className={styles.availText}>{AVAILABILITY.label}</span>
              </div>
            )}
          </div>

          <h2 ref={titleRef} className={styles.title} aria-label="Let's Start a Conversation">
            {titleWords.map((word, i) => (
              <span key={i} className={styles.titleWord}>{word}</span>
            ))}
          </h2>

          <p ref={subtitleRef} className={styles.subtitle}>
            Have an engineering role, contract project, or technical question?
            Send a message directly.
          </p>
        </div>

        {/* ─── TWO-COLUMN CONTENT GRID ─────────────────────── */}
        <div className={styles.content}>

          {/* ── Left Column: Direct Communication ─────────── */}
          <div className={styles.contactInfo}>
            <div className={styles.infoLead}>
              <h3 className={styles.infoLeadTitle}>Direct Communication</h3>
              <p className={styles.infoLeadText}>
                I reply promptly to software engineering inquiries, contract discussions, and technical collaborations.
              </p>
            </div>

            <div className={styles.infoList}>
              {CONTACT_INFO.map((info) => {
                const isEmail = info.id === 'email';
                const isPhone = info.id === 'phone';
                const isLoc = info.id === 'location';

                const handleClick = isEmail ? handleEmailCopy : undefined;
                const TagName = info.action === 'none' ? 'div' : 'a';

                return (
                  <TagName
                    key={info.id}
                    className={`${styles.contactRow} ${styles[`row_${info.accent}`]}`}
                    href={info.action !== 'none' ? info.href : undefined}
                    onClick={isEmail ? handleClick : undefined}
                    role={isEmail ? 'button' : undefined}
                    tabIndex={0}
                    data-cursor="hover"
                    data-cursor-text={info.cursorText}
                    aria-label={`${info.label}: ${info.value}${isEmail ? ' — click to copy' : ''}`}
                    onKeyDown={isEmail ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleEmailCopy(e); } : undefined}
                  >
                    <div className={`${styles.rowIcon} ${styles[`icon_${info.accent}`]}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d={info.iconPath} stroke="currentColor" strokeWidth="1.8"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {isLoc && <span className={styles.locationPulse} />}
                    </div>

                    <div className={styles.rowContent}>
                      <span className={styles.rowLabel}>{info.label}</span>
                      <span className={styles.rowValue}>
                        {isEmail && copyState === 'copied' ? '✓ Copied to clipboard' : info.value}
                      </span>
                    </div>

                    {!isLoc && (
                      <span className={styles.rowArrow} aria-hidden="true">↗</span>
                    )}
                  </TagName>
                );
              })}
            </div>
          </div>

          {/* ── Right Column: Interactive Transmission Terminal ── */}
          <div
            ref={formWrapperRef}
            className={styles.formWrapper}
            onMouseMove={handleContainerMouseMove}
            onMouseLeave={handleContainerMouseLeave}
          >
            {/* Flying paper plane (only shown during launch animation) */}
            <div ref={flightPlaneRef} className={styles.flightActivePlane} style={{ display: 'none' }} aria-hidden="true">
              <PaperPlaneIcon size={24} />
            </div>

            {/* Main Terminal Card Container with Framer Motion Layout Morph (Requirement 14) */}
            <motion.div
              layout
              ref={cardRef}
              className={styles.transmissionCard}
              data-cursor={formPhase === 'success' ? 'hover' : undefined}
              data-cursor-text={formPhase === 'success' ? 'DELIVERED' : undefined}
            >
              {/* Terminal Header: Status Line + Progression (Requirements 1, 2) */}
              <div className={styles.terminalHeader}>
                <div className={styles.telemetryBar}>
                  <div className={styles.systemStatus}>
                    <span className={styles.statusBlinkDot} />
                    <span className={styles.systemOnlineText}>SYSTEM ONLINE</span>
                  </div>

                  <div className={styles.liveMissionStatus}>
                    <span className={styles.missionStatusLabel}>STATUS //</span>
                    <span className={styles.missionStatusVal}>{liveStatusText}</span>
                  </div>
                </div>

                <div className={styles.missionTitleBlock}>
                  <h3 className={styles.missionTitle}>START A TRANSMISSION</h3>
                  <p className={styles.missionSubtext}>
                    "Tell me what you're building, and let's see where it goes."
                  </p>
                </div>

                {/* Stages Progression Row: 01 ●, 02 ○, 03 ○ (Requirement 2) */}
                <div className={styles.stageProgressionRow} aria-label="Transmission stages">
                  <div className={`${styles.stagePill} ${isNameValid ? styles.stagePillComplete : focused === 'name' ? styles.stagePillActive : ''}`}>
                    <span className={styles.stageNum}>01</span>
                    <span className={styles.stageDot}>
                      {isNameValid ? <StageCheckmark isComplete={true} color="#4D6E52" size={11} /> : focused === 'name' ? '●' : '○'}
                    </span>
                    <span className={styles.stageName}>NAME</span>
                  </div>

                  <span className={styles.stageConnectorLine} />

                  <div className={`${styles.stagePill} ${isEmailValid ? styles.stagePillComplete : focused === 'email' ? styles.stagePillActive : ''}`}>
                    <span className={styles.stageNum}>02</span>
                    <span className={styles.stageDot}>
                      {isEmailValid ? <StageCheckmark isComplete={true} color="#5E4E7A" size={11} /> : focused === 'email' ? '●' : '○'}
                    </span>
                    <span className={styles.stageName}>EMAIL</span>
                  </div>

                  <span className={styles.stageConnectorLine} />

                  <div className={`${styles.stagePill} ${isMessageValid ? styles.stagePillComplete : focused === 'message' ? styles.stagePillActive : ''}`}>
                    <span className={styles.stageNum}>03</span>
                    <span className={styles.stageDot}>
                      {isMessageValid ? <StageCheckmark isComplete={true} color="#A85A42" size={11} /> : focused === 'message' ? '●' : '○'}
                    </span>
                    <span className={styles.stageName}>MESSAGE</span>
                  </div>
                </div>
              </div>

              {/* AnimatePresence for Container Morphing (Requirement 14) */}
              <AnimatePresence mode="wait">
                {formPhase === 'success' ? (
                  /* ─── SUCCESS STATE (Requirements 14, 15) ───────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className={styles.successState}
                  >
                    {/* Radial pastel celebration particles (Requirement 15) */}
                    <div className={styles.particlesRing} aria-hidden="true">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <span
                          key={i}
                          ref={el => (particlesRef.current[i] = el)}
                          className={`${styles.particle} ${styles[`particle_${['sage', 'lavender', 'peach', 'butter'][i % 4]}`]}`}
                        />
                      ))}
                    </div>

                    {/* Animated Checkmark SVG (Requirement 14) */}
                    <div className={styles.successCheckWrapper}>
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none" className={styles.successCheckSvg} aria-hidden="true">
                        <circle
                          ref={successCircleRef}
                          cx="26"
                          cy="26"
                          r="24"
                          stroke="#78947D"
                          strokeWidth="2"
                          className={styles.successCheckCircle}
                        />
                        <path
                          ref={successTickRef}
                          d="M16 27L23 34L37 19"
                          stroke="#4D6E52"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={styles.successCheckTick}
                        />
                      </svg>
                    </div>

                    <h4 className={styles.successTitle}>TRANSMISSION COMPLETE</h4>
                    <p className={styles.successBody}>
                      Your message has entered the system. I'll review your project details and follow up promptly.
                    </p>

                    <div className={styles.statusDeliveredBadge}>
                      <span className={styles.statusDeliveredDot} />
                      <span>STATUS: DELIVERED</span>
                    </div>

                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={handleReset}
                      data-cursor="hover"
                      data-cursor-text="RESET"
                    >
                      <span>SEND ANOTHER</span>
                      <span className={styles.resetBtnArrow} aria-hidden="true">↺</span>
                    </button>
                  </motion.div>
                ) : formPhase === 'error' ? (
                  /* ─── ERROR STATE (Requirement 22) ─────────────────── */
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className={styles.errorState}
                  >
                    <div className={styles.errorBadge}>
                      <span>CONNECTION INTERRUPTED</span>
                    </div>
                    <h4 className={styles.errorHeading}>TRANSMISSION FAILED</h4>
                    <p className={styles.errorBody}>
                      Something interrupted the connection. Your entered parameters are preserved.
                    </p>
                    <button
                      type="button"
                      className={styles.retryBtn}
                      onClick={() => setFormPhase('idle')}
                      data-cursor="hover"
                      data-cursor-text="RETRY"
                    >
                      <span>TRY AGAIN</span>
                      <span aria-hidden="true">↗</span>
                    </button>
                  </motion.div>
                ) : (
                  /* ─── ACTIVE TRANSMISSION FORM (Requirements 2–12) ─── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.formLayout}
                    aria-label="Transmission contact form"
                  >
                    {/* Connecting Vertical SVG Route (Requirement 9) */}
                    <div className={styles.routeColumn} aria-hidden="true">
                      {/* Node 01: Name */}
                      <div className={`${styles.routeNode} ${isNameValid ? styles.routeNodeComplete : focused === 'name' ? styles.routeNodeActive : ''}`}>
                        <span className={styles.routeNodeDot} />
                      </div>

                      {/* SVG connecting track */}
                      <svg className={styles.routeSvg} viewBox="0 0 4 300" preserveAspectRatio="none">
                        <line x1="2" y1="0" x2="2" y2="300" className={styles.routeTrack} />
                        {/* Segment 1: Name to Email */}
                        <line
                          x1="2" y1="0" x2="2" y2="100"
                          className={styles.routeFill}
                          stroke="#A8BFAE"
                          strokeDasharray="100"
                          strokeDashoffset={isNameValid ? 0 : 100}
                        />
                        {/* Segment 2: Email to Message */}
                        <line
                          x1="2" y1="100" x2="2" y2="200"
                          className={styles.routeFill}
                          stroke="#B9AED6"
                          strokeDasharray="100"
                          strokeDashoffset={isEmailValid ? 0 : 100}
                        />
                        {/* Segment 3: Message to Launch */}
                        <line
                          x1="2" y1="200" x2="2" y2="300"
                          className={styles.routeFill}
                          stroke="#E5B7A5"
                          strokeDasharray="100"
                          strokeDashoffset={isMessageValid ? 0 : 100}
                        />
                      </svg>

                      {/* Node 02: Email */}
                      <div className={`${styles.routeNode} ${isEmailValid ? styles.routeNodeComplete : focused === 'email' ? styles.routeNodeActive : ''}`}>
                        <span className={styles.routeNodeDot} />
                      </div>

                      {/* Node 03: Message */}
                      <div className={`${styles.routeNode} ${isMessageValid ? styles.routeNodeComplete : focused === 'message' ? styles.routeNodeActive : ''}`}>
                        <span className={styles.routeNodeDot} />
                      </div>

                      {/* Node 04: Launch Button */}
                      <div className={`${styles.routeNode} ${isAllValid ? styles.routeNodeComplete : ''}`}>
                        <span className={styles.routeNodeDot} />
                      </div>
                    </div>

                    {/* Fields List */}
                    <div className={styles.fieldsContainer}>
                      {/* ── STAGE 01: NAME ───────────────────────── */}
                      <div
                        className={`
                          ${styles.fieldGroup}
                          ${styles.fieldSage}
                          ${focused === 'name' ? styles.fieldFocused : ''}
                          ${isNameValid ? styles.fieldValid : ''}
                          ${touched.name && fieldErrors.name ? styles.fieldError : ''}
                        `}
                      >
                        <div className={styles.fieldHeader}>
                          <label htmlFor="transmission-name" className={styles.fieldLabel}>
                            <span className={styles.fieldStagePrefix}>STAGE 01</span>
                            <span>NAME</span>
                            <StageCheckmark isComplete={isNameValid} color="#4D6E52" />
                          </label>

                          <span className={`${styles.fieldStateIndicator} ${styles.fieldStateIndicator_sage}`}>
                            {isNameValid ? 'NAME VERIFIED ✓' : focused === 'name' ? 'IDENTIFY YOURSELF' : ''}
                          </span>
                        </div>

                        <div className={styles.inputUnderlineWrapper}>
                          <input
                            ref={nameInputRef}
                            id="transmission-name"
                            name="name"
                            type="text"
                            className={styles.input}
                            value={formData.name}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus('name')}
                            onBlur={() => handleInputBlur('name')}
                            onKeyDown={handleKeyDownName}
                            placeholder="Identify yourself / your company"
                            autoComplete="name"
                            data-cursor="hover"
                            data-cursor-text={isNameValid ? 'READY' : 'TYPE'}
                            aria-invalid={Boolean(touched.name && fieldErrors.name)}
                            aria-describedby={touched.name && fieldErrors.name ? 'name-err' : undefined}
                          />
                          <div className={styles.focusBar} />
                        </div>

                        {touched.name && fieldErrors.name && (
                          <span id="name-err" className={styles.fieldErrorMsg} role="alert">
                            {fieldErrors.name}
                          </span>
                        )}
                      </div>

                      {/* ── STAGE 02: EMAIL ──────────────────────── */}
                      <div
                        className={`
                          ${styles.fieldGroup}
                          ${styles.fieldLavender}
                          ${focused === 'email' ? styles.fieldFocused : ''}
                          ${isEmailValid ? styles.fieldValid : ''}
                          ${touched.email && fieldErrors.email ? styles.fieldError : ''}
                        `}
                      >
                        <div className={styles.fieldHeader}>
                          <label htmlFor="transmission-email" className={styles.fieldLabel}>
                            <span className={styles.fieldStagePrefix}>STAGE 02</span>
                            <span>EMAIL</span>
                            <StageCheckmark isComplete={isEmailValid} color="#5E4E7A" />
                          </label>

                          <span className={`${styles.fieldStateIndicator} ${styles.fieldStateIndicator_lavender}`}>
                            {isEmailValid ? 'CHANNEL READY ✓' : focused === 'email' ? 'ESTABLISHING CHANNEL' : ''}
                          </span>
                        </div>

                        <div className={styles.inputUnderlineWrapper}>
                          <input
                            ref={emailInputRef}
                            id="transmission-email"
                            name="email"
                            type="email"
                            className={styles.input}
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus('email')}
                            onBlur={() => handleInputBlur('email')}
                            onKeyDown={handleKeyDownEmail}
                            placeholder="channel@domain.com"
                            autoComplete="email"
                            data-cursor="hover"
                            data-cursor-text={isEmailValid ? 'READY' : 'TYPE'}
                            aria-invalid={Boolean(touched.email && fieldErrors.email)}
                            aria-describedby={touched.email && fieldErrors.email ? 'email-err' : undefined}
                          />
                          <div className={styles.focusBar} />
                        </div>

                        {touched.email && fieldErrors.email && (
                          <span id="email-err" className={styles.fieldErrorMsg} role="alert">
                            {fieldErrors.email}
                          </span>
                        )}
                      </div>

                      {/* ── STAGE 03: MESSAGE ────────────────────── */}
                      <div
                        className={`
                          ${styles.fieldGroup}
                          ${styles.fieldPeach}
                          ${focused === 'message' ? styles.fieldFocused : ''}
                          ${isMessageValid ? styles.fieldValid : ''}
                          ${touched.message && fieldErrors.message ? styles.fieldError : ''}
                        `}
                      >
                        <div className={styles.fieldHeader}>
                          <label htmlFor="transmission-message" className={styles.fieldLabel}>
                            <span className={styles.fieldStagePrefix}>STAGE 03</span>
                            <span>MESSAGE</span>
                            <StageCheckmark isComplete={isMessageValid} color="#A85A42" />
                          </label>

                          <span className={`${styles.fieldStateIndicator} ${styles.fieldStateIndicator_peach}`}>
                            {isMessageValid ? 'SIGNAL COMPOSED ✓' : focused === 'message' ? 'WHAT ARE WE BUILDING?' : ''}
                          </span>
                        </div>

                        <div className={styles.inputUnderlineWrapper}>
                          <textarea
                            ref={messageInputRef}
                            id="transmission-message"
                            name="message"
                            rows={4}
                            className={styles.textarea}
                            value={formData.message}
                            onChange={handleInputChange}
                            onFocus={() => handleInputFocus('message')}
                            onBlur={() => handleInputBlur('message')}
                            onKeyDown={handleKeyDownMessage}
                            placeholder="Tell me about the problem, vision, stack, or timeline…"
                            data-cursor="hover"
                            data-cursor-text={isMessageValid ? 'READY' : 'TYPE'}
                            aria-invalid={Boolean(touched.message && fieldErrors.message)}
                            aria-describedby={touched.message && fieldErrors.message ? 'msg-err' : undefined}
                          />
                          <div className={styles.focusBar} />
                        </div>

                        <div className={styles.messageFooter}>
                          <span className={styles.signalTag}>MESSAGE SIGNAL</span>
                          <span className={`${styles.charCounter} ${formData.message.length > 900 ? styles.charCounterWarn : ''}`}>
                            {formData.message.length} / 1000
                          </span>
                        </div>

                        {touched.message && fieldErrors.message && (
                          <span id="msg-err" className={styles.fieldErrorMsg} role="alert">
                            {fieldErrors.message}
                          </span>
                        )}
                      </div>

                      {/* ── SUBMIT AREA (Requirements 10, 11, 12, 17, 19) ── */}
                      <div className={styles.submitArea}>
                        <div className={styles.magneticBtnWrapper}>
                          <button
                            ref={btnRef}
                            type="submit"
                            disabled={formPhase === 'preparing' || formPhase === 'transmitting'}
                            className={styles.submitBtn}
                            onMouseMove={handleBtnMouseMove}
                            onMouseLeave={handleBtnMouseLeave}
                            data-cursor="cta"
                            data-cursor-text="LAUNCH"
                            aria-label={
                              formPhase === 'preparing'
                                ? 'Preparing transmission…'
                                : formPhase === 'transmitting'
                                ? 'Transmitting message…'
                                : 'Launch Transmission'
                            }
                          >
                            <span ref={btnLabelRef} className={styles.submitBtnLabel}>
                              {formPhase === 'preparing'
                                ? 'PREPARING...'
                                : formPhase === 'transmitting'
                                ? 'TRANSMITTING...'
                                : 'LAUNCH TRANSMISSION ↗'}
                            </span>

                            {/* Paper Plane Icon with Hidden Micro-Interaction (Requirement 17) */}
                            <span
                              ref={planeIconRef}
                              className={styles.planeIconWrapper}
                              onClick={handlePlaneMicroInteraction}
                              data-cursor="hover"
                              data-cursor-text="SEND"
                              title="Engines ready"
                            >
                              <PaperPlaneIcon size={18} className={styles.planeIcon} />
                            </span>
                          </button>
                        </div>

                        {isAllValid && formPhase === 'idle' && (
                          <span className={styles.readyHint}>
                            <StageCheckmark isComplete={true} color="#4D6E52" size={12} />
                            <span>TRANSMISSION READY</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
