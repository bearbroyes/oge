/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Play, 
  Square, 
  Check, 
  RotateCcw, 
  Download, 
  Volume2, 
  Mic, 
  MicOff, 
  Search, 
  Sparkles, 
  Clock, 
  ArrowLeft, 
  AlertCircle, 
  ThumbsUp, 
  Lightbulb, 
  ChevronRight, 
  Info,
  CheckCircle,
  FileAudio,
  Sliders,
  HelpCircle,
  X,
  Sun,
  Moon,
  Palette
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MONOLOGUES, Monologue } from "./data";

type Phase = "GRID" | "PREPARATION" | "BUFFER" | "RECORDING" | "RESULT";

type Theme = "violet" | "dark" | "light";

const THEME_STYLES: Record<Theme, any> = {
  violet: {
    rootBg: "bg-[#0f172a] text-slate-100",
    rootBgStyle: {
      backgroundImage: "radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.4) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(192, 38, 211, 0.4) 0px, transparent 50%)"
    },
    headerBg: "bg-white/5 border-white/10 backdrop-blur-md",
    headerTitle: "text-white",
    headerSubtitle: "text-slate-400",
    sessionText: "text-slate-400",
    sessionTopic: "text-indigo-300",
    divider: "bg-white/10",
    
    // Grid dashboard
    banner: "bg-white/5 border border-white/10 backdrop-blur-xl",
    bannerTitle: "text-white",
    bannerDesc: "text-slate-300",
    bannerStep: "bg-white/5 border border-white/5 text-slate-300",
    filterConsole: "bg-white/5 border border-white/10 backdrop-blur-md",
    input: "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-[#1e293b] focus:border-indigo-500",
    filterCount: "bg-white/5 border-white/5 text-slate-400 border-white/10",
    themePillLabel: "text-slate-400",
    
    // Pills
    pillActive: "bg-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-500/20",
    pillInactive: "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20",

    // Card
    card: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-100",
    cardTag: "bg-indigo-500/20 text-indigo-300",
    cardFormat: "border border-white/10 bg-white/5 text-slate-400",
    cardTitle: "text-white group-hover:text-indigo-300",
    cardSub: "text-slate-500",
    cardDivider: "border-white/10",
    cardLabel: "text-slate-400",
    cardBulletText: "text-slate-300",
    cardFooter: "border-white/5 text-indigo-400 group-hover:text-indigo-300",

    // Inner workflow Layout
    workflowCard: "bg-white/10 backdrop-blur-2xl border border-white/20 text-slate-100",
    workflowHeading: "text-white",
    workflowSubtitle: "text-slate-400",
    aspectLabel: "text-indigo-300",
    aspectItem: "bg-white/5 border border-white/10 text-white",
    aspectNum: "bg-white/10 text-indigo-300",
    aspectCheckedItem: "bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 font-bold",
    aspectCheckedNum: "bg-indigo-500 text-white",
    aspectUncheckedNum: "bg-white/10 text-slate-400",
    aspectCheckedText: "line-through opacity-60 text-slate-400",

    // Right component side
    timerLabel: "text-[#94a3b8]",
    timerSub: "text-slate-400",
    circularTrack: "stroke-white/5",
    circularIndicator: "stroke-amber-400",
    clockIcon: "text-amber-400",
    clockTime: "text-white",
    clockLabel: "text-slate-400",
    cancelButton: "bg-white/5 hover:bg-white/10 text-slate-300 border-white/15",
    tipsFooter: "text-slate-500 border-t border-white/5",

    // Buffer phase
    bufferLabel: "text-indigo-400",
    bufferHeading: "text-white",
    bufferDesc: "text-slate-400",
    bufferCircle: "bg-indigo-500 border-indigo-400 text-white shadow-indigo-500/25",
    bufferFooter: "text-slate-500",

    // Recording phase
    recordCol: "bg-red-500/5",
    recordLabel: "text-slate-400",
    recordTrackerLabel: "text-indigo-300",
    recordAspectCount: "text-amber-300",
    recordTimerContainer: "bg-white/5 border border-white/20",
    recordTimerLabel: "text-slate-400",
    recordTimerValue: "text-white",
    recordCancelBtn: "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10",
    recordTipsBox: "bg-white/5 border border-white/5 text-slate-400",
    recordTipsHeader: "text-indigo-300",
    recordTipsItalic: "text-slate-400",
    recordStorageFoot: "text-slate-500",

    // Result phase
    resultBanner: "bg-white/5 border border-white/10 backdrop-blur-md",
    resultBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    resultHeading: "text-white",
    resultDesc: "text-slate-300",
    resultAccentWord: "text-indigo-300",
    resultFileCard: "bg-white/5 border border-white/10 text-white",
    resultFileLabel: "text-[9px] text-slate-400",
    resultDivider: "border-white/15",
    resultSectionTitle: "text-white",
    resultPanel: "bg-white/5 border border-white/10 backdrop-blur-md",
    resultInnerLabel: "text-slate-300",
    resultPlayerContainer: "bg-white/5 border border-white/10",
    resultPlayerFoot: "text-slate-500",
    
    // Evaluation parts
    scoreSectionLabel: "text-indigo-300",
    scoreBullet: "text-emerald-400",
    checkedBonusCard: "bg-indigo-500/10 border-indigo-500/20",
    uncheckedBonusCard: "bg-white/5 border-white/10 opacity-70",
    bonusCardTitle: "text-white",
    bonusCardDesc: "text-slate-400",

    // Rubric side card
    rubricCard: "bg-white/5 border border-white/10 backdrop-blur-md",
    rubricTitle: "text-white",
    rubricDesc: "text-slate-400",
    rubricItem: "hover:bg-white/5 border-white/5",
    rubricItemChecked: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    rubricItemUnchecked: "bg-white/5 border-white/10 text-slate-300",
    rubricCheckText: "text-slate-300 font-medium",
    rubricButtonOk: "bg-indigo-500 hover:bg-indigo-600 text-white",
    rubricButtonCancel: "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/15",

    // empty template
    emptyBanner: "bg-white/5 border border-dashed border-white/10",
    emptyTitle: "text-white",
    emptyDesc: "text-slate-400",
  },
  dark: {
    rootBg: "bg-[#090d16] text-slate-200",
    rootBgStyle: {
      backgroundImage: "radial-gradient(at 0% 0%, rgba(30, 41, 59, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.3) 0px, transparent 50%)"
    },
    headerBg: "bg-slate-950/50 border-slate-800 backdrop-blur-md",
    headerTitle: "text-slate-100",
    headerSubtitle: "text-slate-500",
    sessionText: "text-slate-500",
    sessionTopic: "text-indigo-400",
    divider: "bg-slate-800",

    // Grid dashboard
    banner: "bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl",
    bannerTitle: "text-slate-100",
    bannerDesc: "text-slate-400",
    bannerStep: "bg-slate-950/40 border border-slate-900 text-slate-400",
    filterConsole: "bg-slate-900/40 border border-slate-800 backdrop-blur-md",
    input: "bg-slate-950/40 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:bg-[#111827] focus:border-indigo-500",
    filterCount: "bg-slate-950/40 border-slate-900 text-slate-400 border border-slate-800",
    themePillLabel: "text-slate-500",

    // Pills
    pillActive: "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20",
    pillInactive: "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-950/60 hover:border-slate-700",

    // Card
    card: "bg-slate-900/60 border border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 text-slate-200",
    cardTag: "bg-indigo-500/10 text-indigo-400",
    cardFormat: "border border-slate-800/50 bg-slate-950/30 text-slate-400",
    cardTitle: "text-slate-150 group-hover:text-indigo-300",
    cardSub: "text-slate-600",
    cardDivider: "border-slate-800/60",
    cardLabel: "text-slate-500",
    cardBulletText: "text-slate-400",
    cardFooter: "border-slate-800 text-indigo-400 group-hover:text-indigo-300",

    // Inner workflow Layout
    workflowCard: "bg-slate-900/80 backdrop-blur-2xl border border-slate-800 text-slate-200",
    workflowHeading: "text-slate-100",
    workflowSubtitle: "text-slate-500",
    aspectLabel: "text-indigo-400",
    aspectItem: "bg-slate-950/40 border border-slate-800/80 text-slate-200",
    aspectNum: "bg-slate-900 text-indigo-400",
    aspectCheckedItem: "bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 font-bold",
    aspectCheckedNum: "bg-indigo-600 text-white",
    aspectUncheckedNum: "bg-slate-900 text-slate-500",
    aspectCheckedText: "line-through opacity-50 text-slate-500",

    // Right component side
    timerLabel: "text-slate-500",
    timerSub: "text-slate-600",
    circularTrack: "stroke-slate-900/50",
    circularIndicator: "stroke-amber-500",
    clockIcon: "text-amber-500",
    clockTime: "text-slate-100",
    clockLabel: "text-slate-500",
    cancelButton: "bg-slate-950/40 hover:bg-slate-950/60 text-slate-300 border-slate-800",
    tipsFooter: "text-slate-600 border-t border-slate-800/60",

    // Buffer phase
    bufferLabel: "text-indigo-400",
    bufferHeading: "text-slate-100",
    bufferDesc: "text-slate-500",
    bufferCircle: "bg-indigo-600 border-indigo-500 text-white shadow-indigo-600/25",
    bufferFooter: "text-slate-600",

    // Recording phase
    recordCol: "bg-red-500/5",
    recordLabel: "text-slate-500",
    recordTrackerLabel: "text-indigo-400",
    recordAspectCount: "text-amber-400",
    recordTimerContainer: "bg-slate-950/40 border border-slate-800",
    recordTimerLabel: "text-slate-500",
    recordTimerValue: "text-slate-100",
    recordCancelBtn: "bg-slate-950/40 hover:bg-slate-950/60 text-slate-350 border border-slate-800",
    recordTipsBox: "bg-slate-950/40 border border-slate-805 text-slate-400",
    recordTipsHeader: "text-indigo-400",
    recordTipsItalic: "text-slate-500",
    recordStorageFoot: "text-slate-600",

    // Result phase
    resultBanner: "bg-slate-900/40 border border-slate-800 backdrop-blur-md",
    resultBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    resultHeading: "text-slate-100",
    resultDesc: "text-slate-400",
    resultAccentWord: "text-indigo-400",
    resultFileCard: "bg-slate-950/40 border-slate-800 text-slate-200",
    resultFileLabel: "text-[9px] text-slate-550",
    resultDivider: "border-slate-800",
    resultSectionTitle: "text-slate-150",
    resultPanel: "bg-slate-900/40 border border-slate-805 backdrop-blur-md",
    resultInnerLabel: "text-slate-450",
    resultPlayerContainer: "bg-slate-950/40 border border-slate-800",
    resultPlayerFoot: "text-slate-600",
    
    // Evaluation parts
    scoreSectionLabel: "text-indigo-400",
    scoreBullet: "text-emerald-500",
    checkedBonusCard: "bg-indigo-950/20 border-indigo-500/20",
    uncheckedBonusCard: "bg-slate-950/40 border border-slate-800 opacity-60",
    bonusCardTitle: "text-slate-100",
    bonusCardDesc: "text-slate-500",

    // Rubric side card
    rubricCard: "bg-slate-900/40 border border-slate-800 backdrop-blur-md",
    rubricTitle: "text-slate-100",
    rubricDesc: "text-slate-550",
    rubricItem: "hover:bg-slate-950/30 border-slate-900",
    rubricItemChecked: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    rubricItemUnchecked: "bg-slate-950/40 border border-slate-800 text-slate-400",
    rubricCheckText: "text-slate-300 font-medium",
    rubricButtonOk: "bg-indigo-600 hover:bg-indigo-500 text-white",
    rubricButtonCancel: "bg-slate-950/40 hover:bg-slate-950/60 text-slate-400 border border-slate-800",

    // empty template
    emptyBanner: "bg-slate-900/40 border border-dashed border-slate-805",
    emptyTitle: "text-slate-100",
    emptyDesc: "text-slate-550",
  },
  light: {
    rootBg: "bg-[#f8fafc] text-slate-800",
    rootBgStyle: {
      backgroundImage: "radial-gradient(at 0% 0%, rgba(203, 213, 225, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(241, 245, 249, 0.4) 0px, transparent 50%)"
    },
    headerBg: "bg-white/70 border-slate-200/80 backdrop-blur-md shadow-xs",
    headerTitle: "text-slate-900",
    headerSubtitle: "text-slate-550",
    sessionText: "text-slate-500",
    sessionTopic: "text-indigo-600 font-semibold",
    divider: "bg-slate-205",

    // Grid dashboard
    banner: "bg-white border border-slate-200 shadow-xs",
    bannerTitle: "text-slate-900",
    bannerDesc: "text-slate-600",
    bannerStep: "bg-slate-50 border border-slate-100 text-slate-600",
    filterConsole: "bg-white border border-slate-200 shadow-xs",
    input: "bg-slate-50 border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600",
    filterCount: "bg-slate-100 border border-slate-200 text-slate-600",
    themePillLabel: "text-slate-550",

    // Pills
    pillActive: "bg-indigo-600 border-indigo-500 text-white shadow-xs",
    pillInactive: "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-150 hover:border-slate-300",

    // Card
    card: "bg-white border border-slate-200 shadow-xs hover:bg-slate-50/70 hover:border-slate-300 hover:shadow-xs text-slate-800",
    cardTag: "bg-indigo-50 text-indigo-700 font-bold",
    cardFormat: "border border-slate-200 bg-slate-100 text-slate-600",
    cardTitle: "text-slate-900 group-hover:text-indigo-600",
    cardSub: "text-slate-500",
    cardDivider: "border-slate-205",
    cardLabel: "text-slate-500",
    cardBulletText: "text-slate-600",
    cardFooter: "border-slate-100 text-indigo-600 group-hover:text-indigo-700Label",

    // Inner workflow Layout
    workflowCard: "bg-white border border-slate-200 shadow-md text-slate-800",
    workflowHeading: "text-slate-900",
    workflowSubtitle: "text-slate-550",
    aspectLabel: "text-indigo-600",
    aspectItem: "bg-slate-50 border border-slate-200 text-slate-800",
    aspectNum: "bg-slate-150 text-slate-600",
    aspectCheckedItem: "bg-indigo-50 border-indigo-200 text-indigo-800 font-bold",
    aspectCheckedNum: "bg-indigo-600 text-white",
    aspectUncheckedNum: "bg-slate-200 text-slate-500",
    aspectCheckedText: "line-through opacity-40 text-slate-400",

    // Right component side
    timerLabel: "text-slate-550",
    timerSub: "text-slate-500",
    circularTrack: "stroke-slate-100",
    circularIndicator: "stroke-indigo-600",
    clockIcon: "text-indigo-600",
    clockTime: "text-slate-900",
    clockLabel: "text-slate-500",
    cancelButton: "bg-slate-100 hover:bg-slate-150 text-slate-700 border border-slate-200",
    tipsFooter: "text-slate-500 border-t border-slate-205",

    // Buffer phase
    bufferLabel: "text-indigo-650",
    bufferHeading: "text-slate-900",
    bufferDesc: "text-slate-550",
    bufferCircle: "bg-indigo-600 border-indigo-500 text-white shadow-sm",
    bufferFooter: "text-slate-500",

    // Recording phase
    recordCol: "bg-slate-50/50",
    recordLabel: "text-slate-500",
    recordTrackerLabel: "text-indigo-600",
    recordAspectCount: "text-amber-700",
    recordTimerContainer: "bg-slate-50 border border-slate-200",
    recordTimerLabel: "text-slate-500",
    recordTimerValue: "text-slate-900",
    recordCancelBtn: "bg-slate-100 hover:bg-slate-150 text-slate-700 border-slate-200",
    recordTipsBox: "bg-slate-50 border border-slate-200 text-slate-600",
    recordTipsHeader: "text-indigo-600",
    recordTipsItalic: "text-slate-500",
    recordStorageFoot: "text-slate-500",

    // Result phase
    resultBanner: "bg-white border border-slate-200 shadow-xs",
    resultBadge: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    resultHeading: "text-slate-900",
    resultDesc: "text-slate-600",
    resultAccentWord: "text-indigo-600",
    resultFileCard: "bg-slate-50 border border-slate-200 text-slate-800",
    resultFileLabel: "text-[9px] text-slate-500",
    resultDivider: "border-slate-200",
    resultSectionTitle: "text-slate-850",
    resultPanel: "bg-white border border-slate-200 shadow-xs",
    resultInnerLabel: "text-slate-600",
    resultPlayerContainer: "bg-slate-50 border border-slate-200",
    resultPlayerFoot: "text-slate-550",
    
    // Evaluation parts
    scoreSectionLabel: "text-indigo-600",
    scoreBullet: "text-emerald-600",
    checkedBonusCard: "bg-indigo-50 border-indigo-200 text-indigo-900",
    uncheckedBonusCard: "bg-slate-50 border border-slate-200 opacity-60",
    bonusCardTitle: "text-slate-800",
    bonusCardDesc: "text-slate-500",

    // Rubric side card
    rubricCard: "bg-white border border-slate-200 shadow-xs",
    rubricTitle: "text-slate-950",
    rubricDesc: "text-slate-550",
    rubricItem: "hover:bg-slate-50 border-slate-100",
    rubricItemChecked: "bg-emerald-50 text-emerald-800 border-emerald-250",
    rubricItemUnchecked: "bg-slate-50 border border-slate-200 text-slate-700",
    rubricCheckText: "text-slate-800 font-medium",
    rubricButtonOk: "bg-indigo-655 hover:bg-indigo-600 text-white",
    rubricButtonCancel: "bg-slate-100 hover:bg-slate-150 text-slate-700 border-slate-200",

    // empty template
    emptyBanner: "bg-white border border-dashed border-slate-300",
    emptyTitle: "text-slate-900",
    emptyDesc: "text-slate-500",
  }
};

export default function App() {
  // Theme state settings (violet, dark, light)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("speakmaster_theme");
    return (saved === "light" || saved === "dark" || saved === "violet") ? saved as Theme : "violet";
  });

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem("speakmaster_theme", theme);
  }, [theme]);

  const ST = THEME_STYLES[theme];

  // State variables for active monologue and workflow phases
  const [activeMonologue, setActiveMonologue] = useState<Monologue | null>(null);
  const [phase, setPhase] = useState<Phase>("GRID");
  
  // High-fidelity countdown timers
  const [prepTimeLeft, setPrepTimeLeft] = useState(90);
  const [bufferTimeLeft, setBufferTimeLeft] = useState(5);
  const [recordingSeconds, setRecordingSeconds] = useState(120);

  // Microphone and audio recording engines
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  // Filter / query states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<string | null>(null);

  // Live points tracking during verbal presentation (students can tap to cross out)
  const [checkedPoints, setCheckedPoints] = useState<Record<number, boolean>>({});

  // Media streams and recorders references
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Self assessment score sheet
  const [rubricAnswers, setRubricAnswers] = useState({
    coveredAllPoints: false,
    fluencyFillerWords: false,
    introOutroClear: false,
    underGrammarLimit: false,
    timeOk: false
  });

  // Calculate unique list of themes
  const themes = useMemo(() => {
    const list = MONOLOGUES.map((m) => m.theme.trim().toLowerCase());
    return Array.from(new Set(list)).sort();
  }, []);

  // Filtered lists of monologues
  const filteredMonologues = useMemo(() => {
    return MONOLOGUES.filter((m) => {
      const matchesSearch = 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.points.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesTheme = selectedThemeFilter 
        ? m.theme.trim().toLowerCase() === selectedThemeFilter.toLowerCase()
        : true;

      return matchesSearch && matchesTheme;
    });
  }, [searchQuery, selectedThemeFilter]);

  // Request browser permission query on startup
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
        setMicPermission(result.state);
        result.onchange = () => {
          setMicPermission(result.state);
        };
      } else {
        setMicPermission("prompt");
      }
    } catch {
      setMicPermission("prompt");
    }
  };

  const requestMicAccess = async (): Promise<boolean> => {
    try {
      setMicPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      console.warn("Microphone access denied:", err);
      setMicPermission("denied");
      setMicPermissionError(err.message || "Failed to access microphone. Please check system settings.");
      return false;
    }
  };

  // Preparation phase (90s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phase === "PREPARATION") {
      interval = setInterval(() => {
        setPrepTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            setPhase("BUFFER");
            setBufferTimeLeft(5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  // Buffer state countdown (5s)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phase === "BUFFER") {
      interval = setInterval(() => {
        setBufferTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  // Active verbal practice recording countdown (120s ceiling)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (phase === "RECORDING") {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            stopRecordingAndTransition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // WebRecorder controller
  const startRecording = async () => {
    try {
      setMicPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Safe fallback format checks
      let selectedMimeType = "audio/webm";
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        if (MediaRecorder.isTypeSupported("audio/ogg")) {
          selectedMimeType = "audio/ogg";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          selectedMimeType = "audio/mp4";
        } else {
          selectedMimeType = "";
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: selectedMimeType || "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingBlob(audioBlob);
        
        // Auto trigger file download during the workflow
        if (activeMonologue) {
          triggerDownload(audioBlob, activeMonologue.id);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(120);
      setCheckedPoints({});
      setPhase("RECORDING");
    } catch (err: any) {
      console.error("Audio recording engine failed:", err);
      setMicPermission("denied");
      setPhase("GRID");
      setMicPermissionError("Unable to activate mic inside your container. Please approve browser media authorizations.");
    }
  };

  const stopRecordingAndTransition = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    
    // Clear rubrics with estimated defaults
    setRubricAnswers({
      coveredAllPoints: Object.values(checkedPoints).filter(Boolean).length === activeMonologue?.points.length,
      fluencyFillerWords: false,
      introOutroClear: false,
      underGrammarLimit: false,
      timeOk: recordingSeconds > 0 && recordingSeconds < 110 // did they speak at least 10s-120s?
    });

    setPhase("RESULT");
  };

  const triggerDownload = (blob: Blob, id: number) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `Monologue_${id.toString().padStart(2, "0")}.mp3`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const startPrepWorkflow = async (monologue: Monologue) => {
    let hasAccess = micPermission === "granted";
    if (!hasAccess) {
      hasAccess = await requestMicAccess();
    }
    setActiveMonologue(monologue);
    setPrepTimeLeft(90);
    setPhase("PREPARATION");
  };

  const handleFinishPrepEarly = () => {
    setPhase("BUFFER");
    setBufferTimeLeft(5);
  };

  const handleBackToDashboard = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setActiveMonologue(null);
    setAudioUrl(null);
    setRecordingBlob(null);
    setPhase("GRID");
  };

  const handleRetrySameTopic = () => {
    setAudioUrl(null);
    setRecordingBlob(null);
    if (activeMonologue) {
      setPrepTimeLeft(90);
      setPhase("PREPARATION");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Standard exam templates
  const estimatedIntro = `I am going to give a talk about '${activeMonologue?.theme || "the topic"}'.`;
  const estimatedOutro = `That is all I wanted to say. Thank you for listening.`;

  return (
    <div 
      id="app_root" 
      className={`min-h-screen ${ST.rootBg} font-sans antialiased flex flex-col selection:bg-indigo-500/30 selection:text-white transition-colors duration-300`}
      style={ST.rootBgStyle}
    >
      
      {/* 🚀 Header: Frosted Glass Panel */}
      <header id="app_header" className={`h-20 flex items-center justify-between px-6 sm:px-10 border-b z-30 sticky top-0 transition-all duration-300 ${ST.headerBg}`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={handleBackToDashboard}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>
          <div>
            <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${ST.headerTitle}`}>
              SpeakMaster<span className="text-indigo-400 font-normal">Pro</span>
            </h1>
            <p className={`hidden xs:block text-[9px] ${ST.headerSubtitle} font-bold uppercase tracking-wider`}>Exam Monologue rehearsal deck</p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Beautiful Segmented Theme Control */}
          <div id="theme_switcher_group" className={`flex items-center gap-1 p-1 rounded-xl transition-all duration-300 border ${theme === 'light' ? 'bg-slate-100 border-slate-205' : 'bg-white/5 border-white/10'}`}>
            <button
              id="theme_btn_violet"
              title="Фиолетовая тема"
              onClick={() => setTheme("violet")}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                theme === "violet"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-indigo-400"
              }`}
            >
              <Palette className="h-3.5 w-3.5" />
            </button>
            <button
              id="theme_btn_dark"
              title="Темная тема"
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              id="theme_btn_light"
              title="Светлая тема"
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80"
                  : "text-slate-400 hover:text-slate-800"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="hidden md:flex flex-col items-end">
            <span className={`text-[10px] uppercase tracking-widest ${ST.sessionText} font-semibold`}>Active Session</span>
            <span className={`text-xs ${ST.sessionTopic}`}>English Speaking Practice</span>
          </div>
          <div className={`hidden md:block h-8 w-[1px] ${ST.divider}`}></div>
          
          {/* Audio permissions dynamic bar */}
          {micPermission === "granted" ? (
            <div className={`flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full`}>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-semibold">Mic Connected</span>
            </div>
          ) : (
            <button 
              id="header_mic_auth"
              onClick={requestMicAccess}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full hover:bg-amber-500/30 transition-all text-xs font-bold cursor-pointer"
            >
              <MicOff className="h-3.5 w-3.5" />
              <span>Allow Microphone</span>
            </button>
          )}
        </div>
      </header>

      {/* 📋 Main workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center z-10">
        
        <AnimatePresence mode="wait">
          
          {/* ======================================================= */}
          {/* PHASE 1: PRESTIGE SELECTION GRID (FROSTED GLASS CARD SET) */}
          {/* ======================================================= */}
          {phase === "GRID" && (
            <motion.div
              key="theme-grid-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
              id="dashboard_grid_container"
            >
              
              {/* Premium Frosted Header Banner */}
              <div id="frosted_hero_banner" className={`relative overflow-hidden rounded-[32px] p-8 sm:p-10 shadow-xl transition-all duration-300 ${ST.banner}`}>
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-fuchsia-500/15 blur-3xl rounded-full"></div>
                
                <div className="relative z-10 max-w-4xl space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 border text-indigo-300 text-xs font-semibold rounded-full ${ST.bannerStep}`}>
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>State Exam Preparation Module</span>
                  </div>
                  
                  <h2 className={`text-3xl sm:text-5xl font-black tracking-tight leading-none ${ST.bannerTitle}`}>
                    Select a Speech Topic
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed max-w-3xl ${ST.bannerDesc}`}>
                    Prepare your thoughts in <span className="text-indigo-400 font-bold">90 seconds</span>, then record a monologue up to <span className="text-fuchsia-400 font-bold">2 minutes</span> addressing all prompt criteria. Play back your voice, self-assess using the rubric, and download standard audio files instantly.
                  </p>

                  {/* Flow overview steps in glass columns */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                    <div className={`${ST.bannerStep} rounded-2xl p-4 text-center border`}>
                      <span className="block font-mono text-xl font-bold text-indigo-400">01</span>
                      <span className="text-[11px] font-semibold">Choose Topic</span>
                    </div>
                    <div className={`${ST.bannerStep} rounded-2xl p-4 text-center border`}>
                      <span className="block font-mono text-xl font-bold text-indigo-400">90s</span>
                      <span className="text-[11px] font-semibold">Prepare Notes</span>
                    </div>
                    <div className={`${ST.bannerStep} rounded-2xl p-4 text-center border`}>
                      <span className="block font-mono text-xl font-bold text-indigo-400">05s</span>
                      <span className="text-[11px] font-semibold">Get Ready</span>
                    </div>
                    <div className={`${ST.bannerStep} rounded-2xl p-4 text-center border`}>
                      <span className="block font-mono text-xl font-bold text-indigo-400">120s</span>
                      <span className="text-[11px] font-semibold">Record & MP3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warnings and messages */}
              {micPermissionError && (
                <div id="mic_alert_banner" className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Microphone Authorization Requested:</span> {micPermissionError} Run permission diagnostics by clicking "Allow Microphone" in the navigation bar.
                  </div>
                </div>
              )}

              {/* Premium Frosted Filter Console */}
              <div id="frosted_filter_console" className={`backdrop-blur-md rounded-2xl p-6 shadow-xl space-y-4 transition-all duration-300 ${ST.filterConsole}`}>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                    <input
                      id="search_prompt_input"
                      type="text"
                      placeholder="Search title, themes, or exact points (e.g., 'travelling', 'friends')..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${ST.input} rounded-xl pl-10 pr-4 py-3 text-sm outline-hidden transition-all font-medium border`}
                    />
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs font-semibold ${ST.filterCount} px-4 py-2 rounded-xl self-start md:self-auto border`}>
                    <Sliders className="h-4 w-4 text-indigo-500" />
                    <span>Selected: {filteredMonologues.length} card templates</span>
                  </div>
                </div>

                {/* Theme Pills Row */}
                <div className="space-y-2">
                  <div className={`text-[10px] sm:text-xs font-bold ${ST.themePillLabel} uppercase tracking-wider`}>Exam Study Themes:</div>
                  <div id="theme_badge_pills" className="flex flex-wrap gap-2">
                    <button
                      id="theme_pill_all"
                      onClick={() => setSelectedThemeFilter(null)}
                      className={`text-xs px-4 py-2 rounded-xl border transition-all font-semibold cursor-pointer ${
                        selectedThemeFilter === null
                          ? ST.pillActive
                          : ST.pillInactive
                      }`}
                    >
                      All Issues
                    </button>
                    {themes.map((tName) => (
                      <button
                        key={tName}
                        id={`theme_pill_${tName.replace(/\s+/g, '_')}`}
                        onClick={() => setSelectedThemeFilter(tName)}
                        className={`text-xs px-4 py-2 rounded-xl border transition-all font-semibold capitalize cursor-pointer ${
                          selectedThemeFilter === tName
                            ? ST.pillActive
                            : ST.pillInactive
                        }`}
                      >
                        {tName}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Frosted Grid Items */}
              <div id="frosted_cards_grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMonologues.map((item) => (
                  <motion.div
                    whileHover={{ y: -5, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    key={item.id}
                    id={`monologue_tile_${item.id}`}
                    onClick={() => startPrepWorkflow(item)}
                    className={`group ${ST.card} rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all cursor-pointer relative overflow-hidden`}
                  >
                    
                    {/* Glowing highlight point inside card */}
                    <div className={`absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl ${ST.accentGlow} to-transparent pointer-events-none rounded-tr-2xl`}></div>

                    <div className="space-y-5">
                      
                      {/* Header elements */}
                      <div className="flex items-center justify-between">
                        <span className={`font-mono text-[10px] font-bold ${ST.cardTag} px-2.5 py-1 rounded-md uppercase tracking-wider`}>
                          CARD {item.id.toString().padStart(2, "0")}
                        </span>
                        <div className={`p-1 px-2 border rounded-full text-[9px] uppercase font-bold tracking-wider ${ST.cardFormat}`}>
                          OGE Format
                        </div>
                      </div>

                      {/* Theme text */}
                      <div className="space-y-1">
                        <h4 className={`text-lg font-bold group-hover:text-indigo-500 transition-colors capitalize tracking-tight line-clamp-1 ${ST.cardTitle}`}>
                          {item.id === 1 || item.id === 11 || item.id === 17 || item.id === 24 ? `your school (${item.id})` : item.theme}
                        </h4>
                        <p className={`text-[10px] font-mono tracking-wider ${ST.cardSub}`}>{item.title}</p>
                      </div>

                      {/* Display limited points to keep cards neat */}
                      <div className={`border-t pt-4 space-y-2 ${ST.cardDivider}`}>
                        <span className={`text-[9px] font-bold uppercase tracking-widest block ${ST.cardLabel}`}>Core rubrics ({item.points.length}):</span>
                        <ul className="space-y-1.5">
                          {item.points.slice(0, 2).map((pt, ptIdx) => (
                            <li key={ptIdx} className={`text-xs flex items-start gap-1.5 ${ST.cardBulletText}`}>
                              <span className="text-indigo-500 select-none font-bold mt-0.5">•</span>
                              <span className="line-clamp-1 capitalize">{pt.replace(";", "").replace(".", "")}</span>
                            </li>
                          ))}
                          {item.points.length > 2 && (
                            <li className={`text-[10px] font-medium italic pl-3 ${ST.cardSub}`}>
                              + {item.points.length - 2} additional study criteria
                            </li>
                          )}
                        </ul>
                      </div>

                    </div>

                    <div className={`mt-6 pt-3 border-t flex items-center justify-between text-xs font-bold transition-colors ${ST.cardFooter} ${ST.cardDivider}`}>
                      <span>Begin Speaking Test</span>
                      <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>

                  </motion.div>
                ))}
              </div>

              {/* No results placeholder */}
              {filteredMonologues.length === 0 && (
                <div id="search_empty_view" className={`text-center py-20 border border-dashed rounded-2xl ${ST.emptyBanner}`}>
                  <div className="inline-flex h-12 w-12 rounded-full bg-slate-500/10 items-center justify-center text-slate-400 mb-4 border border-slate-500/10">
                    <Search className="h-5 w-5 text-indigo-505" />
                  </div>
                  <h3 className={`text-lg font-bold ${ST.emptyTitle}`}>No Monologues found</h3>
                  <p className={`text-sm mt-1 max-w-sm mx-auto ${ST.emptyDesc}`}>We couldn't find matching monologue speaking templates. Try searching with alternative terms or clear filters.</p>
                  <button
                    id="grid_reset_pills_btn"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedThemeFilter(null);
                    }}
                    className="mt-6 inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md transition-all cursor-pointer"
                  >
                    <span>Reset All Filters</span>
                  </button>
                </div>
              )}

            </motion.div>
          )}

          {/* ======================================================= */}
          {/* PHASE 2: FROSTED WORKFLOW - PREPARATION (90 SECONDS CAP) */}
          {/* ======================================================= */}
          {phase === "PREPARATION" && activeMonologue && (
            <motion.div
              key="prep-panel-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className={`max-w-4xl mx-auto w-full border rounded-[32px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${ST.workflowCard}`}
              id="prep_card_layout"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                
                {/* Information Column */}
                <div className={`md:col-span-7 p-6 sm:p-12 border-b md:border-b-0 md:border-r space-y-8 ${ST.cardDivider}`}>
                  
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      Preparation phase
                    </span>
                    <h2 className={`text-xl font-bold tracking-tight uppercase ${ST.workflowHeading}`}>
                      Card Selection {activeMonologue.id}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className={`text-2xl sm:text-3xl font-black capitalize leading-tight ${ST.workflowHeading}`}>
                        Theme: {activeMonologue.theme}
                      </h3>
                      <p className={`text-xs sm:text-sm leading-relaxed ${ST.workflowSubtitle}`}>
                        You have exactly 90 seconds to study the task outline and plan your monologue presentation. Draft a mental map of your transitions. Do not start speaking yet.
                      </p>
                    </div>

                    {/* Criteria checklist cards */}
                    <div className="space-y-3">
                      <span className={`text-[10px] uppercase font-extrabold tracking-wider ${ST.aspectLabel}`}>Include the following aspects in your talk:</span>
                      <ul id="prep_aspect_list" className="space-y-3">
                        {activeMonologue.points.map((pt, ptIdx) => (
                          <li key={ptIdx} className={`flex items-start gap-4 font-medium p-4 rounded-2xl border capitalize ${ST.aspectItem}`}>
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${ST.aspectNum}`}>
                              {ptIdx + 1}
                            </span>
                            <span className="text-sm pt-0.5 leading-snug">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Preparation Timer Clock Column */}
                <div className={`md:col-span-5 flex flex-col items-center justify-center p-8 sm:p-12 ${ST.recordCol}`}>
                  <div className="text-center space-y-2 mb-8">
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${ST.timerLabel}`}>Preparation Timer</span>
                    <p className={`text-xs text-center max-w-xs ${ST.timerSub}`}>Study clock. Ticker will automatically navigate to speech rehearsal buffer upon completion.</p>
                  </div>

                  {/* Glass Circular Preparation clock element */}
                  <div className="relative flex items-center justify-center mb-8" id="preparation_circle_visual">
                    {/* Ring graphics */}
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle cx="96" cy="96" r="88" className={`${ST.circularTrack} fill-none`} strokeWidth="6" />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        className={`${ST.circularIndicator} fill-none transition-all duration-1000`} 
                        strokeWidth="6" 
                        strokeDasharray="552"
                        strokeDashoffset={(552 - (552 * prepTimeLeft) / 90).toString()}
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <Clock className={`h-5 w-5 mb-1 ${ST.clockIcon}`} />
                      <span className={`text-4xl font-mono font-black tracking-tighter ${ST.clockTime}`}>
                        {formatTime(prepTimeLeft)}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${ST.clockLabel}`}>
                        rehearsal count
                      </span>
                    </div>
                  </div>

                  {/* Buttons controls */}
                  <div className="w-full space-y-3">
                    <button
                      id="finish_prep_early_trigger"
                      onClick={handleFinishPrepEarly}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-amber-500/10 active:scale-95 cursor-pointer"
                    >
                      <Play className="h-4.5 w-4.5 fill-white" />
                      <span>Start Monologue Early</span>
                    </button>

                    <button
                      id="card_prep_abort_btn"
                      onClick={handleBackToDashboard}
                      className={`w-full py-3.5 rounded-2xl font-semibold text-xs transition-all border cursor-pointer ${ST.cancelButton}`}
                    >
                      Cancel practice & exit
                    </button>
                  </div>

                  {/* Self tips advice footer */}
                  <div className={`mt-8 pt-6 w-full text-center ${ST.tipsFooter}`}>
                    <p className={`text-[10px] leading-relaxed uppercase tracking-wider ${ST.timerSub}`}>
                      💡 Connect thoughts using <span className="text-amber-500">"Moreover"</span>, <span className="text-amber-500 font-bold">"On the other hand"</span>, & <span className="text-amber-500 font-bold">"To sum up..."</span>
                    </p>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================= */}
          {/* PHASE 3: GET READY COUNTDOWN BUFFER                      */}
          {/* ======================================================= */}
          {phase === "BUFFER" && (
            <motion.div
              key="buffer-clock-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`max-w-md mx-auto w-full p-10 text-center space-y-8 shadow-2xl border rounded-[36px] relative overflow-hidden transition-all duration-300 ${ST.workflowCard}`}
              id="get_ready_modal"
            >
              
              <div className="absolute top-0 right-0 h-20 w-20 bg-indigo-505/10 blur-2xl rounded-full"></div>

              <div className="space-y-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest ${ST.bufferLabel}`}>Buffer state</span>
                <h3 className={`text-2xl font-black ${ST.bufferHeading}`}>Get Ready to Speak</h3>
                <p className={`text-xs max-w-xs mx-auto ${ST.bufferDesc}`}>Rehearsal recorder will immediately boot when clock ticks down. Breathe deeply.</p>
              </div>

              {/* Ticker digit block */}
              <div className={`h-32 w-32 mx-auto rounded-full flex items-center justify-center text-white relative overflow-hidden border ${ST.bufferCircle}`}>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={bufferTimeLeft}
                    initial={{ y: 25, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -25, opacity: 0, scale: 0.7 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="font-mono text-5xl font-black tracking-tighter text-white"
                  >
                    {bufferTimeLeft}
                  </motion.span>
                </AnimatePresence>
              </div>

              <span className="text-[10px] text-slate-500 italic block">
                * Recording will begin automatically. Speak clearly and audibly.
              </span>

            </motion.div>
          )}

          {/* ======================================================= */}
          {/* PHASE 4: RECORDING WORKSPACE - ACTIVE VERBAL SPEAKING   */}
          {/* ======================================================= */}
          {phase === "RECORDING" && activeMonologue && (
            <motion.div
              key="recording-panel-container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`max-w-4xl mx-auto w-full border rounded-[32px] sm:rounded-[40px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${ST.workflowCard}`}
              id="active_recording_canvas"
            >
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                
                {/* Checklist column */}
                <div className={`md:col-span-7 p-6 sm:p-12 border-b md:border-b-0 md:border-r space-y-8 ${ST.cardDivider}`}>
                  
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider animate-pulse inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping"></span>
                      <span>Live Speech Rehearsal</span>
                    </span>
                    <h2 className={`text-xl font-bold tracking-tight uppercase ${ST.workflowHeading}`}>
                      Card Selection {activeMonologue.id}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className={`text-2xl sm:text-3xl font-black capitalize leading-tight ${ST.workflowHeading}`}>
                        Theme: {activeMonologue.theme}
                      </h3>
                      <p className={`text-xs sm:text-sm ${ST.workflowSubtitle}`}>
                        You have up to 2 minutes of recording limit. Check aspects in the box as you cover them vocally to assess coverage!
                      </p>
                    </div>

                    {/* Interactive Points Checklist */}
                    <div className="space-y-3">
                      <div className={`flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider ${ST.aspectLabel}`}>
                        <span>Aspects Coverage Tracker:</span>
                        <span className="text-amber-500 font-mono">
                          {Object.values(checkedPoints).filter(Boolean).length} / {activeMonologue.points.length} aspects verified
                        </span>
                      </div>

                      <ul id="active_record_interactive_list" className="space-y-3">
                        {activeMonologue.points.map((pt, ptIdx) => {
                          const hasBeenDiscussed = !!checkedPoints[ptIdx];
                          return (
                            <li 
                              key={ptIdx} 
                              onClick={() => setCheckedPoints(prev => ({ ...prev, [ptIdx]: !prev[ptIdx] }))}
                              className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer select-none transition-all capitalize ${
                                hasBeenDiscussed 
                                  ? ST.aspectActive 
                                  : ST.aspectInactive
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                                hasBeenDiscussed ? ST.aspectActiveBadge : ST.aspectInactiveBadge
                              }`}>
                                {hasBeenDiscussed ? <Check className="h-3.5 w-3.5" /> : (ptIdx + 1)}
                              </div>
                              <span className={`text-sm pt-0.5 leading-snug ${hasBeenDiscussed ? "line-through opacity-50" : ""}`}>
                                {pt}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                  </div>

                </div>

                {/* Recording Progress Timer Clock Column */}
                <div className={`md:col-span-5 flex flex-col items-center justify-center p-8 sm:p-12 ${ST.recordCol}`}>
                  
                  {/* Glowing, pulsing recording graphics container */}
                  <div className="relative flex items-center justify-center mb-8 pointer-events-none select-none" id="recording_progress_elements">
                    <div className="absolute w-48 h-48 rounded-full border-4 border-red-500/10 animate-ping pointer-events-none"></div>
                    <div className="absolute w-40 h-40 rounded-full border-2 border-red-500/20 pointer-events-none"></div>

                    <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border shadow-inner pointer-events-none ${ST.circularTrack}`}>
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${ST.clockLabel}`}>limit remaining</span>
                      
                      <span className={`text-3xl font-mono font-bold tracking-tighter mt-1 ${ST.clockTime}`}>
                        {formatTime(recordingSeconds)}
                      </span>

                      {/* Animated mini live visual equalizer */}
                      <div className="mt-2.5 flex gap-1 items-end h-4">
                        <div className="w-1 h-2 bg-red-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-3.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-1 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-1 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Core Action Call To Action */}
                  <div className="w-full space-y-3 relative z-30">
                    <button
                      id="recording_stop_download_btn"
                      onClick={stopRecordingAndTransition}
                      className="w-full py-5 bg-red-650 hover:bg-red-500 active:bg-red-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all duration-150 shadow-xl shadow-red-650/30 active:scale-98 cursor-pointer relative z-40 select-none border border-red-450/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                      </svg>
                      <span>Stop &amp; Download Speech</span>
                    </button>

                    <button
                      id="recording_cancel_attempt_btn"
                      onClick={handleBackToDashboard}
                      className={`w-full py-3 rounded-2xl font-semibold text-xs transition-all border cursor-pointer ${ST.cancelButton}`}
                    >
                      Cancel Attempt & Back
                    </button>
                  </div>

                  {/* Tips box */}
                  <div className={`mt-8 border rounded-2xl p-4 w-full text-center text-[10px] leading-relaxed space-y-1 ${ST.aspectItem}`}>
                    <span className={`font-extrabold uppercase block text-center ${ST.aspectLabel}`}>Standard Outline Tips:</span>
                    <p className="opacity-80 italic">"I am going to give a talk..."</p>
                    <p className="opacity-80 italic">"That is all I wanted to say. Thank you."</p>
                  </div>

                  <div className="mt-6 text-center">
                    <p className={`text-[10px] px-2 leading-relaxed ${ST.clockLabel}`}>
                      Storage: <span className="text-indigo-400 font-semibold">Saving & Download MP3 Audio</span>
                    </p>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

          {/* ======================================================= */}
          {/* PHASE 5: RESULT / SELF ASSESSMENT & PLAYBACK SCREEN      */}
          {/* ======================================================= */}
          {phase === "RESULT" && activeMonologue && (
            <motion.div
              key="results-panel-container"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto w-full space-y-8"
              id="speech_results_workspace"
            >
              
              {/* Premium Frosted Header block */}
              <div id="results_achievement_banner" className={`backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border transition-all duration-300 ${ST.banner}`}>
                <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-indigo-500/5 blur-3xl rounded-full"></div>
                
                <div className="space-y-3 relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-300 text-xs font-bold py-1 px-3 rounded-full border border-emerald-500/20">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Practice Exercise Finalized</span>
                  </div>
                  
                  <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-none capitalize ${ST.bannerTitle}`}>
                    Monologue Completed!
                  </h2>
                  <p className={`text-sm leading-relaxed ${ST.bannerDesc}`}>
                    Good job! Your speaking recording for <span className="text-indigo-400 font-bold capitalize">"{activeMonologue.theme}"</span> was generated and requested for immediate download. Use the audio console below to listen back for errors.
                  </p>
                </div>

                <div className={`flex flex-col shrink-0 space-y-2 p-5 rounded-2xl min-w-48 text-center md:text-left z-20 border ${ST.bannerStep}`}>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Generated Speech File:</span>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <FileAudio className="h-4 w-4 text-indigo-400" />
                    <span className="font-mono text-xs font-bold capitalize">
                      Monologue_{activeMonologue.id}.mp3
                    </span>
                  </div>
                  {recordingBlob && (
                    <button
                      id="redownload_file_btn"
                      onClick={() => triggerDownload(recordingBlob, activeMonologue.id)}
                      className="mt-3 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-505 text-white text-[11px] font-bold rounded-lg transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download File Again</span>
                    </button>
                  )}
                </div>

              </div>

              {/* Layout splits into Self Scorecard and Media Player */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* 1. Interactive Audio player Console */}
                <div className={`backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border transition-all duration-300 ${ST.workflowCard}`}>
                  <div className={`flex items-center gap-2 border-b pb-4 ${ST.cardDivider}`}>
                    <Volume2 className="h-5 w-5 text-indigo-400" />
                    <h3 className={`font-bold text-base ${ST.workflowHeading}`}>Listen &amp; Evaluate</h3>
                  </div>

                  {audioUrl ? (
                    <div id="html_voice_player_box" className="space-y-4">
                      <p className={`text-xs ${ST.workflowSubtitle}`}>Play back your response to check your pronunciation, word choice, and natural delivery flow:</p>
                      
                      <div className={`p-4 rounded-2xl border flex flex-col gap-3 ${ST.aspectItem}`}>
                        <audio 
                          id="audit_audio_audio"
                          src={audioUrl} 
                          controls 
                          className="w-full h-10 accent-indigo-550"
                        />
                        <span className="text-[10px] text-slate-500 text-center font-mono">HTML5 Audio Playback Engine</span>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-8 text-center border border-dashed rounded-2xl text-xs leading-relaxed space-y-2 ${ST.emptyBanner}`}>
                      <MicOff className="h-8 w-8 text-slate-500 mx-auto" />
                      <p className="font-bold">Play Back Offline</p>
                      <p className="opacity-80">Your browser didn't produce an export URL. The monologue was downloaded directly to your downloads cache.</p>
                    </div>
                  )}

                  <div className={`rounded-2xl p-5 border text-xs space-y-3 ${ST.aspectItem}`}>
                    <h4 className="font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                      <Lightbulb className="h-4 w-4 text-indigo-400" />
                      <span>Exam speaking guidelines:</span>
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-1 text-[11px] leading-relaxed">
                        <span className="text-indigo-455 font-bold">•</span>
                        <span>Your monologue should be continuous (no long breaks longer than 3 seconds).</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] leading-relaxed">
                        <span className="text-indigo-455 font-bold">•</span>
                        <span>Keep sentences grammatically simple to minimize syntax or tense mismatch.</span>
                      </li>
                      <li className="flex items-start gap-2 text-[11px] leading-relaxed">
                        <span className="text-indigo-455 font-bold">•</span>
                        <span>Aim to construct 10 to 12 total phrases of conversational English.</span>
                      </li>
                    </ul>
                  </div>

                </div>

                {/* 2. Self Rubrics and Score card */}
                <div className={`backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border transition-all duration-300 ${ST.workflowCard}`}>
                  
                  <div className={`flex items-center justify-between border-b pb-4 ${ST.cardDivider}`}>
                    <h3 className={`font-bold text-base ${ST.workflowHeading}`}>State Speaking Rubric Audit</h3>
                    <span className="text-xs text-slate-400 font-mono">Teacher Rubric</span>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${ST.workflowSubtitle}`}>
                    Check your performance objectively. Grade your recorded MP3 audio according to the official state assessment criteria below:
                  </p>

                  <div id="self_assessment_scorecard_rubrics" className="space-y-3">
                    
                    {/* Item 01 */}
                    <div 
                      onClick={() => setRubricAnswers(prev => ({ ...prev, coveredAllPoints: !prev.coveredAllPoints }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                        rubricAnswers.coveredAllPoints 
                          ? ST.aspectActive 
                          : ST.aspectInactive
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                        rubricAnswers.coveredAllPoints ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-slate-500/40"
                      }`}>
                        {rubricAnswers.coveredAllPoints && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${ST.workflowHeading}`}>1. Content Completeness (Aspects Covered)</span>
                        <span className={`text-[11px] block leading-normal ${ST.workflowSubtitle}`}>
                          Did you fully address all 4 aspects outlined in the card? (Missing a point risks a deduction).
                        </span>
                      </div>
                    </div>

                    {/* Item 02 */}
                    <div 
                      onClick={() => setRubricAnswers(prev => ({ ...prev, fluencyFillerWords: !prev.fluencyFillerWords }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                        rubricAnswers.fluencyFillerWords 
                          ? ST.aspectActive 
                          : ST.aspectInactive
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                        rubricAnswers.fluencyFillerWords ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-slate-500/40"
                      }`}>
                        {rubricAnswers.fluencyFillerWords && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${ST.workflowHeading}`}>2. Speech Coherence &amp; Linkers</span>
                        <span className={`text-[11px] block leading-normal ${ST.workflowSubtitle}`}>
                          Used proper text coherence links such as 'moreover', 'as for', 'finally' with correct pauses.
                        </span>
                      </div>
                    </div>

                    {/* Item 03 */}
                    <div 
                      onClick={() => setRubricAnswers(prev => ({ ...prev, introOutroClear: !prev.introOutroClear }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                        rubricAnswers.introOutroClear 
                          ? ST.aspectActive 
                          : ST.aspectInactive
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                        rubricAnswers.introOutroClear ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-slate-500/40"
                      }`}>
                        {rubricAnswers.introOutroClear && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${ST.workflowHeading}`}>3. Structured Introduction &amp; Outro</span>
                        <span className={`text-[11px] block leading-normal ${ST.workflowSubtitle}`}>
                          Initiated with an introduction ("I am giving a talk...") and concluded with: "{estimatedOutro}".
                        </span>
                      </div>
                    </div>

                    {/* Item 04 */}
                    <div 
                      onClick={() => setRubricAnswers(prev => ({ ...prev, underGrammarLimit: !prev.underGrammarLimit }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                        rubricAnswers.underGrammarLimit 
                          ? ST.aspectActive 
                          : ST.aspectInactive
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                        rubricAnswers.underGrammarLimit ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-slate-500/40"
                      }`}>
                        {rubricAnswers.underGrammarLimit && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${ST.workflowHeading}`}>4. Grammar, Lexis, &amp; Pronunciation Range</span>
                        <span className={`text-[11px] block leading-normal ${ST.workflowSubtitle}`}>
                          Contained less than or equal to 3 phonetic vocabulary or basic grammar mistakes during pacing.
                        </span>
                      </div>
                    </div>

                    {/* Item 05 */}
                    <div 
                      onClick={() => setRubricAnswers(prev => ({ ...prev, timeOk: !prev.timeOk }))}
                      className={`p-4 rounded-xl border cursor-pointer select-none transition-all flex items-start gap-3.5 ${
                        rubricAnswers.timeOk 
                          ? ST.aspectActive 
                          : ST.aspectInactive
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all mt-0.5 ${
                        rubricAnswers.timeOk ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-slate-500/40"
                      }`}>
                        {rubricAnswers.timeOk && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-sm font-bold block ${ST.workflowHeading}`}>5. Time Management Safety Limits</span>
                        <span className={`text-[11px] block leading-normal ${ST.workflowSubtitle}`}>
                          Response was spoken under the 2-minute limit ceiling without trailing sentence interruptions.
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Flow controls */}
                  <div className={`flex flex-col sm:flex-row items-center gap-3 pt-4 border-t ${ST.cardDivider}`}>
                    <button
                      id="retry_same_topic_action"
                      onClick={handleRetrySameTopic}
                      className={`w-full sm:w-auto px-6 py-4 border rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer flex-1 ${ST.retryButton}`}
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Retry Dialogue Practice</span>
                    </button>
                    
                    <button
                      id="finish_back_to_selection_action"
                      onClick={handleBackToDashboard}
                      className="w-full sm:w-auto px-6 py-4 bg-indigo-600 hover:bg-indigo-550 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer flex-1"
                    >
                      <span>Choose Different Topic</span>
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>

                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 📋 Footer */}
      <footer className={`h-14 flex items-center justify-center px-4 sm:px-10 border-t text-[9px] uppercase tracking-widest text-center mt-8 transition-colors duration-300 ${ST.footer}`}>
        <div>
          <span>Designed for Exam Preparation &bull; Frosted Glass Studio Design &bull; © 2026</span>
          <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-[8px] font-mono whitespace-nowrap">Production Release 2.4.0</span>
        </div>
      </footer>

    </div>
  );
}
