import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  CalendarClock,
  ChevronRight,
  PhoneCall,
  Sparkles,
  Download,
  Plus,
  LayoutDashboard,
  UserPlus,
  Calendar,
  BookOpen,
  UserCog,
  BarChart3,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  X,
  Save,
  MessageSquare,
  ShieldCheck,
  LogIn,
  LogOut,
  Building2,
  Send,
  Award,
  Search,
  Lock,
  User,
  KeyRound,
  Check,
  Settings,
  Filter,
  GraduationCap,
  Layers,
  IndianRupee,
  ArrowRight
} from 'lucide-react';

// ==========================================
// 1. TYPES & DATA MODELS
// ==========================================

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'In Progress'
  | 'Follow-up'
  | 'Admitted'
  | 'Not Interested';

export type UserRole = 'admin' | 'staff' | 'public';

export type CourseCategory = 'Diploma' | 'B.Tech' | 'Pharmacy' | 'Degree Courses';

export const COURSE_CATEGORIES: CourseCategory[] = [
  'Diploma',
  'B.Tech',
  'Pharmacy',
  'Degree Courses'
];

export interface CommunicationLog {
  id: string;
  enquiryId: string;
  type: 'Phone Call' | 'WhatsApp' | 'Email' | 'Campus Visit' | 'Virtual Meeting';
  notes: string;
  outcome: string;
  nextFollowUpDate?: string;
  counselorName: string;
  timestamp: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string;
  name: string;
  phone: string;
  email: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';
  city?: string;
  state?: string;
  guardian?: string;
  guardianPhone?: string;
  course: string;
  qualification?: string;
  passingYear?: number | string;
  source?: string;
  status: EnquiryStatus;
  counsellor?: string;
  counsellorId?: string;
  followUp?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  communications?: CommunicationLog[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  category: CourseCategory;
  duration: string;
  fees: number;
  eligibility: string;
  totalSeats: number;
  enrolledSeats: number;
  isActive: boolean;
  department: string;
}

export interface Staff {
  id: string;
  staffId: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  role: 'staff';
  designation: string;
  department: string;
  isActive: boolean;
  canViewAllEnquiries?: boolean;
}

export interface AdminCredentials {
  adminId: string;
  password: string;
  name: string;
}

export interface AuthUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
}

// ==========================================
// 2. CONFIGURATION & COMPREHENSIVE SEED DATA
// ==========================================

const ENQUIRIES_KEY = 'adies_admission_enquiries_v9';
const COURSES_KEY = 'adies_courses_v9';
const STAFF_KEY = 'adies_staff_v9';
const ADMIN_CREDS_KEY = 'adies_admin_creds_v9';
const AUTH_KEY = 'adies_auth_user_v9';

export const STATUS_LIST: EnquiryStatus[] = [
  'New',
  'Contacted',
  'In Progress',
  'Follow-up',
  'Admitted',
  'Not Interested'
];

export const STATUS_CONFIG: Record<
  EnquiryStatus,
  { label: string; bg: string; text: string; border: string; hex: string }
> = {
  New: { label: 'New', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', hex: '#6366f1' },
  Contacted: { label: 'Contacted', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', hex: '#d97706' },
  'In Progress': { label: 'In Progress', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', hex: '#9333ea' },
  'Follow-up': { label: 'Follow-up', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', hex: '#ea580c' },
  Admitted: { label: 'Admitted', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#059669' },
  'Not Interested': { label: 'Not Interested', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', hex: '#e11d48' }
};

const DEFAULT_ADMIN: AdminCredentials = {
  adminId: 'krishna',
  password: 'apple123',
  name: 'Krishna (Administrator)'
};

const INITIAL_STAFF: Staff[] = [
  {
    id: 's-priya',
    staffId: 'priya101',
    password: 'staff123',
    name: 'Dr. Priya Mehta',
    email: 'priya.mehta@college.edu',
    phone: '9845012345',
    role: 'staff',
    designation: 'Senior Admission Counselor',
    department: 'School of Computing Admissions',
    isActive: true,
    canViewAllEnquiries: true
  },
  {
    id: 's-rahul',
    staffId: 'rahul102',
    password: 'staff123',
    name: 'Rahul Verma',
    email: 'rahul.verma@college.edu',
    phone: '9890054321',
    role: 'staff',
    designation: 'Academic Counselor',
    department: 'School of Engineering Admissions',
    isActive: true,
    canViewAllEnquiries: false
  },
  {
    id: 's-sunita',
    staffId: 'sunita103',
    password: 'staff123',
    name: 'Sunita Rao',
    email: 'sunita.rao@college.edu',
    phone: '9923067890',
    role: 'staff',
    designation: 'Student Intake Coordinator',
    department: 'Admissions & Outreach',
    isActive: true,
    canViewAllEnquiries: false
  }
];

// All courses required across Diploma, B.Tech, Pharmacy, and Degree Courses
const INITIAL_COURSES: Course[] = [
  // 1. Diploma Programs
  {
    id: 'dip-ce',
    code: 'DIP-CE',
    name: 'Diploma in Computer Engineering',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 55000,
    eligibility: '10th / SSC with Mathematics and Science (min 50% aggregate)',
    totalSeats: 60,
    enrolledSeats: 45,
    isActive: true,
    department: 'Polytechnic Engineering'
  },
  {
    id: 'dip-civil',
    code: 'DIP-CIVIL',
    name: 'Diploma in Civil Engineering',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 50000,
    eligibility: '10th / SSC with min 45% aggregate',
    totalSeats: 60,
    enrolledSeats: 30,
    isActive: true,
    department: 'Polytechnic Engineering'
  },
  {
    id: 'dip-mech',
    code: 'DIP-MECH',
    name: 'Diploma in Mechanical Engineering',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 50000,
    eligibility: '10th / SSC with min 45% aggregate',
    totalSeats: 60,
    enrolledSeats: 32,
    isActive: true,
    department: 'Polytechnic Engineering'
  },
  {
    id: 'dip-ee',
    code: 'DIP-EE',
    name: 'Diploma in Electrical Engineering',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 50000,
    eligibility: '10th / SSC with min 45% aggregate',
    totalSeats: 60,
    enrolledSeats: 28,
    isActive: true,
    department: 'Polytechnic Engineering'
  },
  {
    id: 'dip-aiml',
    code: 'DIP-AIML',
    name: 'Diploma in AI & ML',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 60000,
    eligibility: '10th / SSC with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 48,
    isActive: true,
    department: 'Polytechnic Computing'
  },
  {
    id: 'dip-ds',
    code: 'DIP-DS',
    name: 'Diploma in Data Science',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 60000,
    eligibility: '10th / SSC with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 42,
    isActive: true,
    department: 'Polytechnic Computing'
  },
  {
    id: 'dip-it',
    code: 'DIP-IT',
    name: 'Diploma in Information Technology',
    category: 'Diploma',
    duration: '3 Years (6 Semesters)',
    fees: 55000,
    eligibility: '10th / SSC with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 40,
    isActive: true,
    department: 'Polytechnic Computing'
  },
  {
    id: 'dip-dpharm',
    code: 'D-PHARM-DIP',
    name: 'D.Pharm (Diploma in Pharmacy)',
    category: 'Diploma',
    duration: '2 Years (Annual System)',
    fees: 65000,
    eligibility: '10+2 with Physics, Chemistry and Biology/Math (min 50% aggregate)',
    totalSeats: 60,
    enrolledSeats: 52,
    isActive: true,
    department: 'School of Pharmacy'
  },

  // 2. B.Tech Programs
  {
    id: 'bt-cse',
    code: 'BTECH-CSE',
    name: 'B.Tech - Computer Science & Engineering (CSE)',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 195000,
    eligibility: '10+2 with Physics, Mathematics & Chemistry/CS with min 65% aggregate',
    totalSeats: 120,
    enrolledSeats: 112,
    isActive: true,
    department: 'School of Computing'
  },
  {
    id: 'bt-aiml',
    code: 'BTECH-AIML',
    name: 'B.Tech - AI & ML',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 185000,
    eligibility: '10+2 with Physics, Mathematics & Chem/CS with min 60% aggregate',
    totalSeats: 60,
    enrolledSeats: 54,
    isActive: true,
    department: 'School of Computing'
  },
  {
    id: 'bt-ds',
    code: 'BTECH-DS',
    name: 'B.Tech - Data Science',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 180000,
    eligibility: '10+2 with Physics, Mathematics & Chem/CS with min 60% aggregate',
    totalSeats: 60,
    enrolledSeats: 48,
    isActive: true,
    department: 'School of Computing'
  },
  {
    id: 'bt-it',
    code: 'BTECH-IT',
    name: 'B.Tech - Information Technology (IT)',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 175000,
    eligibility: '10+2 with PCM with min 55% aggregate',
    totalSeats: 60,
    enrolledSeats: 50,
    isActive: true,
    department: 'School of Computing'
  },
  {
    id: 'bt-ece',
    code: 'BTECH-ECE',
    name: 'B.Tech - Electronics & Communication (ECE)',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 155000,
    eligibility: '10+2 with PCM with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 42,
    isActive: true,
    department: 'School of Engineering'
  },
  {
    id: 'bt-eee',
    code: 'BTECH-EEE',
    name: 'B.Tech - Electrical & Electronics Engineering (EEE)',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 150000,
    eligibility: '10+2 with PCM with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 36,
    isActive: true,
    department: 'School of Engineering'
  },
  {
    id: 'bt-mech',
    code: 'BTECH-MECH',
    name: 'B.Tech - Mechanical Engineering',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 140000,
    eligibility: '10+2 with PCM with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 34,
    isActive: true,
    department: 'School of Engineering'
  },
  {
    id: 'bt-civil',
    code: 'BTECH-CIVIL',
    name: 'B.Tech - Civil Engineering',
    category: 'B.Tech',
    duration: '4 Years (8 Semesters)',
    fees: 135000,
    eligibility: '10+2 with PCM with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 28,
    isActive: true,
    department: 'School of Engineering'
  },

  // 3. Pharmacy Programs
  {
    id: 'ph-dpharm',
    code: 'PHARM-DIP',
    name: 'D.Pharm',
    category: 'Pharmacy',
    duration: '2 Years (Annual System)',
    fees: 65000,
    eligibility: '10+2 with Physics, Chemistry and Biology/Maths (min 50% aggregate)',
    totalSeats: 60,
    enrolledSeats: 56,
    isActive: true,
    department: 'Faculty of Pharmaceutical Sciences'
  },
  {
    id: 'ph-bpharm',
    code: 'B-PHARM',
    name: 'B.Pharm',
    category: 'Pharmacy',
    duration: '4 Years (8 Semesters)',
    fees: 120000,
    eligibility: '10+2 with English, Physics, Chemistry and Biology/Maths (min 50%)',
    totalSeats: 100,
    enrolledSeats: 88,
    isActive: true,
    department: 'Faculty of Pharmaceutical Sciences'
  },
  {
    id: 'ph-pharmd',
    code: 'PHARM-D',
    name: 'Pharm.D',
    category: 'Pharmacy',
    duration: '6 Years (Doctor of Pharmacy)',
    fees: 210000,
    eligibility: '10+2 with Physics and Chemistry along with Math/Biology (min 60%)',
    totalSeats: 30,
    enrolledSeats: 26,
    isActive: true,
    department: 'Faculty of Pharmaceutical Sciences'
  },
  {
    id: 'ph-mpharm',
    code: 'M-PHARM',
    name: 'M.Pharm',
    category: 'Pharmacy',
    duration: '2 Years (4 Semesters)',
    fees: 140000,
    eligibility: 'B.Pharm degree from PCI recognized institution with min 55% aggregate',
    totalSeats: 30,
    enrolledSeats: 22,
    isActive: true,
    department: 'Faculty of Pharmaceutical Sciences'
  },

  // 4. Degree Courses
  {
    id: 'deg-bsc',
    code: 'DEG-BSC',
    name: 'B.Sc.',
    category: 'Degree Courses',
    duration: '3 Years (6 Semesters)',
    fees: 45000,
    eligibility: '10+2 in Science stream with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 48,
    isActive: true,
    department: 'Faculty of Sciences'
  },
  {
    id: 'deg-bcom',
    code: 'DEG-BCOM',
    name: 'B.Com.',
    category: 'Degree Courses',
    duration: '3 Years (6 Semesters)',
    fees: 40000,
    eligibility: '10+2 in any stream (Commerce preferred) with min 45% aggregate',
    totalSeats: 80,
    enrolledSeats: 65,
    isActive: true,
    department: 'Faculty of Commerce'
  },
  {
    id: 'deg-bba',
    code: 'DEG-BBA',
    name: 'BBA',
    category: 'Degree Courses',
    duration: '3 Years (6 Semesters)',
    fees: 75000,
    eligibility: '10+2 in any stream with min 50% aggregate',
    totalSeats: 60,
    enrolledSeats: 52,
    isActive: true,
    department: 'School of Management'
  },
  {
    id: 'deg-bca',
    code: 'DEG-BCA',
    name: 'BCA',
    category: 'Degree Courses',
    duration: '3 Years (6 Semesters)',
    fees: 85000,
    eligibility: '10+2 with Mathematics or Computer Applications with min 50%',
    totalSeats: 60,
    enrolledSeats: 55,
    isActive: true,
    department: 'School of Computing'
  },
  {
    id: 'deg-ba',
    code: 'DEG-BA',
    name: 'BA',
    category: 'Degree Courses',
    duration: '3 Years (6 Semesters)',
    fees: 35000,
    eligibility: '10+2 in any stream with min 45% aggregate',
    totalSeats: 60,
    enrolledSeats: 38,
    isActive: true,
    department: 'Faculty of Arts & Humanities'
  },
  {
    id: 'deg-bpharm',
    code: 'DEG-BPHARM',
    name: 'B.Pharm',
    category: 'Degree Courses',
    duration: '4 Years (8 Semesters)',
    fees: 120000,
    eligibility: '10+2 with Physics, Chemistry and Biology/Maths with min 50%',
    totalSeats: 60,
    enrolledSeats: 49,
    isActive: true,
    department: 'Faculty of Pharmaceutical Sciences'
  }
];

const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    enquiryNumber: 'ENQ-2026-001',
    name: 'Aarav Sharma',
    phone: '9876543210',
    email: 'aarav.sharma@gmail.com',
    dob: '2008-04-12',
    gender: 'Male',
    city: 'Mumbai',
    state: 'Maharashtra',
    guardian: 'Manoj Sharma',
    guardianPhone: '9876543211',
    course: 'B.Tech - Computer Science & Engineering (CSE)',
    qualification: 'Intermediate',
    passingYear: 2026,
    source: 'Website',
    status: 'Admitted',
    counsellor: 'Dr. Priya Mehta',
    counsellorId: 's-priya',
    followUp: '2026-10-10',
    notes: 'Secured 89% in 12th entrance. Fee deposit verified, admitted to Batch A.',
    createdAt: '2026-09-28T10:30:00Z',
    updatedAt: '2026-10-10T14:20:00Z',
    communications: [
      {
        id: 'comm-1',
        enquiryId: 'enq-1',
        type: 'Phone Call',
        notes: 'Introductory counseling, explained lab facilities and placement track record.',
        outcome: 'Student was very enthusiastic about CSE program.',
        counselorName: 'Dr. Priya Mehta',
        timestamp: '2026-09-29T11:00:00Z'
      }
    ]
  },
  {
    id: 'enq-2',
    enquiryNumber: 'ENQ-2026-002',
    name: 'Sneha Patel',
    phone: '9823456781',
    email: 'sneha.patel@outlook.com',
    dob: '2008-08-20',
    gender: 'Female',
    city: 'Pune',
    state: 'Maharashtra',
    guardian: 'Ramesh Patel',
    guardianPhone: '9823456782',
    course: 'B.Tech - AI & ML',
    qualification: 'Intermediate',
    passingYear: 2026,
    source: 'Social Media',
    status: 'In Progress',
    counsellor: 'Dr. Priya Mehta',
    counsellorId: 's-priya',
    followUp: '2026-10-16',
    notes: 'Interested in AI specializations and robotics club. Requested syllabus brochure.',
    createdAt: '2026-10-02T09:15:00Z',
    updatedAt: '2026-10-12T16:00:00Z',
    communications: []
  },
  {
    id: 'enq-3',
    enquiryNumber: 'ENQ-2026-003',
    name: 'Rohan Verma',
    phone: '9988771122',
    email: 'rohan.verma99@gmail.com',
    dob: '2007-11-05',
    gender: 'Male',
    city: 'Nagpur',
    state: 'Maharashtra',
    guardian: 'Sunil Verma',
    guardianPhone: '9988771123',
    course: 'Diploma in Information Technology',
    qualification: '10th / SSC',
    passingYear: 2026,
    source: 'Walk-in',
    status: 'Follow-up',
    counsellor: 'Rahul Verma',
    counsellorId: 's-rahul',
    followUp: '2026-10-14',
    notes: '10th pass student seeking direct admission to polytechnic IT diploma.',
    createdAt: '2026-10-04T11:45:00Z',
    updatedAt: '2026-10-09T12:00:00Z',
    communications: []
  },
  {
    id: 'enq-4',
    enquiryNumber: 'ENQ-2026-004',
    name: 'Ananya Gupta',
    phone: '9765432190',
    email: 'ananya.g@yahoo.com',
    dob: '2008-01-18',
    gender: 'Female',
    city: 'Bangalore',
    state: 'Karnataka',
    course: 'B.Pharm',
    qualification: 'Intermediate',
    passingYear: 2026,
    source: 'Website',
    status: 'New',
    counsellor: '',
    followUp: '2026-10-18',
    notes: 'Submitted online enquiry form via portal. Interested in pharmacy labs and scholarship.',
    createdAt: '2026-10-15T14:10:00Z',
    updatedAt: '2026-10-15T14:10:00Z',
    communications: []
  }
];

// ==========================================
// 3. VALIDATION & ALGORITHMS
// ==========================================

export function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

/**
 * Detailed Email Validation providing actionable feedback for Gmail & standard domains
 */
export function validateEmailDetailed(email: string, isRequired = true): { isValid: boolean; error?: string } {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    if (isRequired) {
      return { isValid: false, error: 'Email address is required (e.g. yourname@gmail.com).' };
    }
    return { isValid: true };
  }
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: 'Invalid email: Cannot contain spaces.' };
  }
  if (!trimmed.includes('@')) {
    return { isValid: false, error: 'Invalid email: Missing "@" symbol (e.g. name@gmail.com).' };
  }
  const parts = trimmed.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { isValid: false, error: 'Invalid email structure: Please enter username@domain.com.' };
  }
  const [local, domain] = parts;
  if (local.length < 1) {
    return { isValid: false, error: 'Invalid email: Username before "@" is missing.' };
  }
  if (!domain.includes('.')) {
    if (domain.toLowerCase() === 'gmail') {
      return { isValid: false, error: 'Incomplete Gmail address: Did you mean @gmail.com?' };
    }
    return { isValid: false, error: 'Incomplete email domain: Missing extension like .com, .edu, or .in' };
  }
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return { isValid: false, error: 'Invalid email domain: Extension must have at least 2 letters (e.g. .com).' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid email address characters. Please enter a valid email.' };
  }
  return { isValid: true };
}

export function validatePhoneDetailed(phone: string): { isValid: boolean; error?: string } {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Mobile phone number is required.' };
  }
  if (/[a-zA-Z]/.test(trimmed)) {
    return { isValid: false, error: 'Invalid phone number: Cannot contain letters.' };
  }
  const digits = normalizePhone(trimmed);
  if (digits.length < 10) {
    return { isValid: false, error: `Invalid phone number: Must be at least 10 digits (currently ${digits.length} digits).` };
  }
  if (digits.length > 15) {
    return { isValid: false, error: `Invalid phone number: Exceeds 15 digits (currently ${digits.length} digits).` };
  }
  return { isValid: true };
}

export function validateNameDetailed(name: string): { isValid: boolean; error?: string } {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Student full name is required.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Invalid name: Must be at least 2 characters.' };
  }
  if (/^[0-9]+$/.test(trimmed)) {
    return { isValid: false, error: 'Invalid name: Name cannot consist of numbers only.' };
  }
  return { isValid: true };
}

export function validateCityDetailed(city: string): { isValid: boolean; error?: string } {
  const trimmed = (city || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'City is required for admission correspondence.' };
  }
  return { isValid: true };
}

export function validateCourseDetailed(course: string): { isValid: boolean; error?: string } {
  if (!course || !course.trim()) {
    return { isValid: false, error: 'Please select a preferred course/degree program.' };
  }
  return { isValid: true };
}

export function findDuplicateEnquiry(
  enquiries: Enquiry[],
  phone: string,
  email: string,
  excludeId?: string
): Enquiry | null {
  const normPhone = normalizePhone(phone);
  const normEmail = (email || '').trim().toLowerCase();

  return (
    enquiries.find(e => {
      if (excludeId && e.id === excludeId) return false;
      const targetPhone = normalizePhone(e.phone);
      const targetEmail = (e.email || '').trim().toLowerCase();

      let phoneMatches = false;
      if (normPhone.length >= 7 && targetPhone.length >= 7) {
        if (normPhone === targetPhone) {
          phoneMatches = true;
        } else if (normPhone.length >= 10 && targetPhone.length >= 10) {
          phoneMatches = normPhone.slice(-10) === targetPhone.slice(-10);
        }
      }

      const emailMatches = Boolean(
        normEmail && normEmail.length > 3 && targetEmail && targetEmail === normEmail
      );

      return phoneMatches || emailMatches;
    }) || null
  );
}

function calculateConversionRate(enquiries: Enquiry[]): number {
  if (!enquiries || enquiries.length === 0) return 0;
  const admitted = enquiries.filter(e => e.status === 'Admitted').length;
  return Math.round((admitted / enquiries.length) * 100);
}

function getFollowUpStatus(
  followUpDate?: string,
  enquiryStatus?: EnquiryStatus,
  referenceDateStr?: string
): 'overdue' | 'today' | 'upcoming' | 'completed' | 'none' {
  if (enquiryStatus === 'Admitted' || enquiryStatus === 'Not Interested') {
    return 'completed';
  }
  if (!followUpDate) return 'none';

  const ref = referenceDateStr || new Date().toISOString().slice(0, 10);
  const target = followUpDate.slice(0, 10);

  if (target < ref) return 'overdue';
  if (target === ref) return 'today';
  return 'upcoming';
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function generateEnquiryNumber(enquiries: Enquiry[]): string {
  const currentYear = new Date().getFullYear();
  const nextNum = enquiries.length + 1;
  return `ENQ-${currentYear}-${String(nextNum).padStart(3, '0')}`;
}

function exportEnquiriesToCSV(enquiries: Enquiry[], filename = 'adiES_enquiries.csv'): void {
  const headers = [
    'Enquiry No',
    'Student Name',
    'Phone',
    'Email',
    'City',
    'Course Interested',
    'Status',
    'Assigned Counselor',
    'Next Follow-Up',
    'Created At',
    'Notes'
  ];

  const escapeCSV = (val: unknown): string => {
    let str = String(val ?? '');
    if (/^[=+\-@]/.test(str)) str = `'` + str;
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = enquiries.map(e => [
    e.enquiryNumber,
    e.name,
    e.phone,
    e.email,
    e.city || '',
    e.course,
    e.status,
    e.counsellor || 'Unassigned',
    e.followUp || '',
    e.createdAt ? e.createdAt.slice(0, 10) : '',
    e.notes || ''
  ]);

  const csvContent = [headers, ...rows].map(row => row.map(escapeCSV).join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 4. MAIN APPLICATION COMPONENT
// ==========================================

export default function App() {
  const [adminCreds, setAdminCreds] = useState<AdminCredentials>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_CREDS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN;
    } catch {
      return DEFAULT_ADMIN;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ENQUIRIES;
    } catch {
      return INITIAL_ENQUIRIES;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(COURSES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    try {
      const saved = localStorage.getItem(STAFF_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Default active user is 'public' so Student Form loads first!
  const [currentUser, setCurrentUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      id: 'guest',
      userId: 'guest',
      name: 'Prospective Student',
      email: '',
      role: 'public',
      designation: 'Applicant'
    };
  });

  const [activeTab, setActiveTab] = useState<string>('publicForm');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | null>(null);
  const [preselectedCourse, setPreselectedCourse] = useState<string>('');

  // Deletion modals with in-app confirmation
  const [deletingEnquiry, setDeletingEnquiry] = useState<Enquiry | null>(null);

  // Login modals (Admin or Staff)
  const [loginRoleModal, setLoginRoleModal] = useState<'admin' | 'staff' | null>(null);

  // Admin security settings modal
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(adminCreds));
    } catch {}
  }, [adminCreds]);

  useEffect(() => {
    try {
      localStorage.setItem(ENQUIRIES_KEY, JSON.stringify(enquiries));
    } catch {}
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
    } catch {}
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
    } catch {}
  }, [staff]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
    } catch {}
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogout = () => {
    const publicUser: AuthUser = {
      id: 'guest',
      userId: 'guest',
      name: 'Prospective Student',
      email: '',
      role: 'public',
      designation: 'Applicant'
    };
    setCurrentUser(publicUser);
    setActiveTab('publicForm');
    showToast('Signed out. Student Enquiry Form active.');
  };

  const handleSaveEnquiry = (enquiryData: Partial<Enquiry>) => {
    if (editingEnquiry) {
      setEnquiries(prev =>
        prev.map(e =>
          e.id === editingEnquiry.id
            ? ({ ...e, ...enquiryData, updatedAt: new Date().toISOString() } as Enquiry)
            : e
        )
      );
      setEditingEnquiry(null);
      setActiveTab('enquiriesList');
      showToast('Enquiry updated successfully!');
    } else {
      const num = generateEnquiryNumber(enquiries);
      const newEnq: Enquiry = {
        id: generateId(),
        enquiryNumber: num,
        name: enquiryData.name || '',
        phone: enquiryData.phone || '',
        email: enquiryData.email || '',
        dob: enquiryData.dob,
        gender: enquiryData.gender,
        city: enquiryData.city,
        state: enquiryData.state,
        guardian: enquiryData.guardian,
        guardianPhone: enquiryData.guardianPhone,
        course: enquiryData.course || (courses[0]?.name || 'General'),
        qualification: enquiryData.qualification,
        passingYear: enquiryData.passingYear,
        source: enquiryData.source || 'Website',
        status: enquiryData.status || 'New',
        counsellor: enquiryData.counsellor || '',
        counsellorId: enquiryData.counsellorId,
        followUp: enquiryData.followUp,
        notes: enquiryData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        communications: []
      };
      setEnquiries(prev => [newEnq, ...prev]);
      if (currentUser.role !== 'public') {
        setActiveTab('enquiriesList');
      }
      showToast(`Enquiry ${num} registered successfully!`);
    }
  };

  const executeDeleteEnquiry = (enquiryToDelete: Enquiry) => {
    setEnquiries(prev => prev.filter(e => e.id !== enquiryToDelete.id));
    if (selectedEnquiry && selectedEnquiry.id === enquiryToDelete.id) {
      setSelectedEnquiry(null);
    }
    setDeletingEnquiry(null);
    showToast(`Enquiry ${enquiryToDelete.enquiryNumber} (${enquiryToDelete.name}) has been deleted successfully!`);
  };

  const handleUpdateStatus = (id: string, newStatus: EnquiryStatus) => {
    setEnquiries(prev =>
      prev.map(e => (e.id === id ? { ...e, status: newStatus, updatedAt: new Date().toISOString() } : e))
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(prev => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Status updated to ${newStatus}`);
  };

  const handleUpdateCounselor = (id: string, counselorName: string, counselorId?: string) => {
    setEnquiries(prev =>
      prev.map(e =>
        e.id === id
          ? { ...e, counsellor: counselorName, counsellorId: counselorId, updatedAt: new Date().toISOString() }
          : e
      )
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry(prev => (prev ? { ...prev, counsellor: counselorName, counsellorId: counselorId } : null));
    }
    showToast(`Assigned to ${counselorName || 'Open Pool'}`);
  };

  const handleAddCommunication = (id: string, log: CommunicationLog, nextFollowUp?: string) => {
    setEnquiries(prev =>
      prev.map(e => {
        if (e.id === id) {
          const comms = e.communications || [];
          return {
            ...e,
            followUp: nextFollowUp !== undefined ? nextFollowUp : e.followUp,
            status: e.status === 'New' ? ('In Progress' as EnquiryStatus) : e.status,
            updatedAt: new Date().toISOString(),
            communications: [log, ...comms]
          };
        }
        return e;
      })
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      const comms = selectedEnquiry.communications || [];
      setSelectedEnquiry({
        ...selectedEnquiry,
        followUp: nextFollowUp !== undefined ? nextFollowUp : selectedEnquiry.followUp,
        status: selectedEnquiry.status === 'New' ? 'In Progress' : selectedEnquiry.status,
        communications: [log, ...comms]
      });
    }
    showToast('Communication note recorded.');
  };

  // Staff Management (Admin Only)
  const handleSaveStaff = (staffMember: Staff) => {
    setStaff(prev => {
      const exists = prev.some(s => s.id === staffMember.id);
      return exists ? prev.map(s => (s.id === staffMember.id ? staffMember : s)) : [...prev, staffMember];
    });
    showToast(`Staff account for ${staffMember.name} (ID: ${staffMember.staffId}) saved.`);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
    showToast('Staff account removed successfully.');
  };

  // Course Management (Edit Fees, Details, Add, Delete)
  const handleSaveCourse = (course: Course) => {
    setCourses(prev => {
      const exists = prev.some(c => c.id === course.id);
      return exists ? prev.map(c => (c.id === course.id ? course : c)) : [course, ...prev];
    });
    showToast(`Course "${course.name}" updated successfully with fee Rs. ${course.fees.toLocaleString('en-IN')}.`);
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    showToast('Course removed successfully.');
  };

  // Switch to student enquiry form with selected course
  const handleSelectCourseForEnquiry = (courseName: string) => {
    setPreselectedCourse(courseName);
    if (currentUser.role === 'public') {
      setActiveTab('publicForm');
    } else {
      setEditingEnquiry(null);
      setActiveTab('enquiryForm');
    }
  };

  const visibleEnquiries = useMemo(() => {
    if (currentUser.role === 'staff') {
      const currentStaffRecord = staff.find(s => s.name === currentUser.name || s.staffId === currentUser.userId);
      if (currentStaffRecord?.canViewAllEnquiries) {
        return enquiries;
      }
      return enquiries.filter(e => e.counsellor === currentUser.name || !e.counsellor);
    }
    return enquiries;
  }, [enquiries, currentUser, staff]);

  const overdueCount = enquiries.filter(
    e => getFollowUpStatus(e.followUp, e.status) === 'overdue'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl text-xs font-semibold text-white shadow-xl transition-all ${
            toast.type === 'error'
              ? 'bg-rose-600'
              : toast.type === 'info'
              ? 'bg-slate-800'
              : 'bg-emerald-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* HEADER: LOGO "Adi" + Left Corner Admin & Staff Buttons */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* LEFT CORNER: Logo "Adi" + Admin and Staff buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                if (currentUser.role === 'public') {
                  setActiveTab('publicForm');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm shadow-sm tracking-tight">
                Adi
              </div>
              <div className="hidden xs:block">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                  adiES
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  Admissions System
                </span>
              </div>
            </button>

            {/* Left Corner: Admin & Staff Login Buttons */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-slate-200">
              {currentUser.role === 'public' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setLoginRoleModal('admin')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                    title="Sign in with Admin ID (krishna) & Password (apple123)"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRoleModal('staff')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition shadow-2xs cursor-pointer active:scale-95"
                    title="Sign in with Staff credentials created by Admin"
                  >
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('publicForm')}
                    className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'publicForm'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Student Form</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      currentUser.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5" />
                    )}
                    <span>{currentUser.name}</span>
                  </span>

                  {currentUser.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setIsAdminSettingsOpen(true)}
                      title="Edit Admin ID and Password"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {currentUser.role !== 'public' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEnquiry(null);
                    setActiveTab('enquiryForm');
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Student Enquiry</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab('courses')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explore All Courses & Fees</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {currentUser.role === 'public' ? 'Prospective Student' : 'Management Portal'}
              </p>
              <nav className="space-y-1">
                {currentUser.role === 'public' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('publicForm')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'publicForm'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span>Student Admission Form</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'courses'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>Courses & Fees</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {courses.length}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'dashboard'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingEnquiry(null);
                        setActiveTab('enquiryForm');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'enquiryForm'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <UserPlus className="w-4 h-4" />
                        <span>Add Enquiry</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiriesList')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'enquiriesList'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span>Enquiry Records</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {visibleEnquiries.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('followUps')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'followUps'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CalendarClock className="w-4 h-4" />
                        <span>Follow-up Workspace</span>
                      </div>
                      {overdueCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {overdueCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('courses')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'courses'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-slate-500" />
                        <span>Courses & Fees</span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                        {courses.length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('reports')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'reports'
                          ? 'bg-indigo-50 text-indigo-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BarChart3 className="w-4 h-4" />
                        <span>Reports & Stats</span>
                      </div>
                    </button>
                  </>
                )}
              </nav>
            </div>

            {/* Admin only section: Staff & Settings */}
            {currentUser.role === 'admin' && (
              <div>
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Admin Administration
                </p>
                <nav className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('staff')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === 'staff'
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <UserCog className="w-4 h-4 text-indigo-600" />
                      <span>Staff Accounts ({staff.length})</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdminSettingsOpen(true)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4 text-slate-500" />
                    <span>Admin Password Edit</span>
                  </button>
                </nav>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="font-bold text-slate-700 flex items-center gap-1.5 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              adiES Campus Engine
            </div>
            <div className="text-[10px] text-slate-400">Secure Database Connected</div>
          </div>
        </aside>

        {/* MAIN BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* TAB 1: PUBLIC STUDENT FORM (DEFAULT) */}
          {activeTab === 'publicForm' && (
            <PublicFormInner
              courses={courses}
              allEnquiries={enquiries}
              onSubmit={handleSaveEnquiry}
              onOpenLogin={role => setLoginRoleModal(role)}
              preselectedCourse={preselectedCourse}
            />
          )}

          {/* TAB 2: DASHBOARD (ADMIN & STAFF) */}
          {activeTab === 'dashboard' && currentUser.role !== 'public' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Admissions Portal Active</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                    Welcome, {currentUser.name}
                  </h1>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {currentUser.role === 'admin'
                      ? 'Full administrator dashboard. Manage enquiries, editable courses & fees, staff accounts, and track metrics.'
                      : 'Staff Counselor Workspace. Manage your assigned enquiries and follow-ups.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportEnquiriesToCSV(enquiries)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEnquiry(null);
                      setActiveTab('enquiryForm');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Enquiry</span>
                  </button>
                </div>
              </div>

              {/* Follow-up Alert */}
              {overdueCount > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-900 text-xs">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="font-bold text-amber-950 text-sm">Overdue Follow-up Alert</p>
                      <p className="text-amber-800">
                        There are <strong className="text-rose-700">{overdueCount} student follow-ups</strong> requiring counselor contact.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('followUps')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs cursor-pointer"
                  >
                    Open Workspace
                  </button>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase text-slate-500">Total Enquiries</span>
                  <div className="text-3xl font-extrabold text-slate-900 mt-2">{visibleEnquiries.length}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Prospective students recorded</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase text-slate-500">Active In Pipeline</span>
                  <div className="text-3xl font-extrabold text-amber-700 mt-2">
                    {visibleEnquiries.filter(e => e.status !== 'Admitted' && e.status !== 'Not Interested').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">In contact & follow-up</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase text-slate-500">Admitted Students</span>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-2">
                    {visibleEnquiries.filter(e => e.status === 'Admitted').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Confirmed enrolled</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-semibold uppercase text-slate-500">Conversion Rate</span>
                  <div className="text-3xl font-extrabold text-indigo-700 mt-2">
                    {calculateConversionRate(visibleEnquiries)}%
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Overall conversion ratio</p>
                </div>
              </div>

              {/* Status Breakdown & Conversion */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-bold text-slate-900">Enquiries by Status</h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiriesList')}
                      className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      View All Records →
                    </button>
                  </div>
                  {STATUS_LIST.map(st => {
                    const count = visibleEnquiries.filter(e => e.status === st).length;
                    const pct = visibleEnquiries.length > 0 ? Math.round((count / visibleEnquiries.length) * 100) : 0;
                    const cfg = STATUS_CONFIG[st];
                    return (
                      <div key={st} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700">{st}</span>
                          <span className="text-slate-500 font-semibold">
                            {count} ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: cfg.hex }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Admission Target</h2>
                    <div className="my-6 text-center">
                      <div className="text-5xl font-black text-indigo-700">
                        {calculateConversionRate(visibleEnquiries)}%
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Current Admissions Conversion</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('followUps')}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    View Follow-up Calls
                  </button>
                </div>
              </div>

              {/* ENQUIRY RECORDS SECTION DIRECTLY IN ADMIN DASHBOARD */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>Enquiry Records Section</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage prospective student records directly from your dashboard. Admin can edit or delete rows.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiriesList')}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      Open Full Records Table
                    </button>
                  </div>
                </div>

                <EnquiriesListInner
                  enquiries={visibleEnquiries}
                  courses={courses}
                  staff={staff}
                  onOpenNewEnquiry={() => {
                    setEditingEnquiry(null);
                    setActiveTab('enquiryForm');
                  }}
                  onEditEnquiry={enq => {
                    setEditingEnquiry(enq);
                    setActiveTab('enquiryForm');
                  }}
                  onRequestDeleteEnquiry={enq => setDeletingEnquiry(enq)}
                  onSelectEnquiry={enq => setSelectedEnquiry(enq)}
                  onExportCSV={() => exportEnquiriesToCSV(visibleEnquiries)}
                  userRole={currentUser.role}
                  isEmbedded={true}
                />
              </div>
            </div>
          )}

          {/* TAB 3: ENQUIRY CAPTURE / EDIT FORM */}
          {activeTab === 'enquiryForm' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">
                    {editingEnquiry ? `Edit Enquiry: ${editingEnquiry.enquiryNumber}` : 'Add Student Enquiry'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Capture academic background, contact details, duplicate checks, and counselor notes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab(currentUser.role === 'public' ? 'publicForm' : 'enquiriesList')}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <EnquiryFormInner
                initialData={editingEnquiry}
                courses={courses}
                staff={staff}
                allEnquiries={enquiries}
                onSave={handleSaveEnquiry}
                onCancel={() => setActiveTab(currentUser.role === 'public' ? 'publicForm' : 'enquiriesList')}
                preselectedCourse={preselectedCourse}
              />
            </div>
          )}

          {/* TAB 4: ALL ENQUIRIES LIST (DEDICATED FULL VIEW WITH CONFIRMED DELETE) */}
          {activeTab === 'enquiriesList' && currentUser.role !== 'public' && (
            <div className="space-y-4">
              <EnquiriesListInner
                enquiries={visibleEnquiries}
                courses={courses}
                staff={staff}
                onOpenNewEnquiry={() => {
                  setEditingEnquiry(null);
                  setActiveTab('enquiryForm');
                }}
                onEditEnquiry={enq => {
                  setEditingEnquiry(enq);
                  setActiveTab('enquiryForm');
                }}
                onRequestDeleteEnquiry={enq => setDeletingEnquiry(enq)}
                onSelectEnquiry={enq => setSelectedEnquiry(enq)}
                onExportCSV={() => exportEnquiriesToCSV(visibleEnquiries)}
                userRole={currentUser.role}
              />
            </div>
          )}

          {/* TAB 5: FOLLOW-UP WORKSPACE */}
          {activeTab === 'followUps' && currentUser.role !== 'public' && (
            <FollowUpsInner
              enquiries={visibleEnquiries}
              onSelectEnquiry={enq => setSelectedEnquiry(enq)}
              onUpdateStatus={handleUpdateStatus}
            />
          )}

          {/* TAB 6: COURSES & FEES (FOR BOTH STUDENTS AND ADMIN, WITH FILTERS, EDITABLE FEES & CONFIRMED DELETE) */}
          {activeTab === 'courses' && (
            <CoursesInner
              courses={courses}
              onSaveCourse={handleSaveCourse}
              onDeleteCourse={handleDeleteCourse}
              userRole={currentUser.role}
              onSelectCourseForEnquiry={handleSelectCourseForEnquiry}
            />
          )}

          {/* TAB 7: STAFF ACCOUNTS MANAGEMENT (ADMIN ONLY, WITH CUSTOM IN-APP REMOVAL CONFIRMATION) */}
          {activeTab === 'staff' && currentUser.role === 'admin' && (
            <StaffManagementInner
              staff={staff}
              enquiries={enquiries}
              onSaveStaff={handleSaveStaff}
              onDeleteStaff={handleDeleteStaff}
            />
          )}

          {/* TAB 8: REPORTS */}
          {activeTab === 'reports' && currentUser.role !== 'public' && (
            <ReportsInner
              enquiries={visibleEnquiries}
              courses={courses}
              staff={staff}
            />
          )}
        </main>
      </div>

      {/* STUDENT DETAIL & COMMUNICATION LOG MODAL */}
      {selectedEnquiry && (
        <EnquiryModalInner
          enquiry={selectedEnquiry}
          staff={staff}
          onClose={() => setSelectedEnquiry(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdateCounselor={handleUpdateCounselor}
          onAddCommunication={handleAddCommunication}
          currentUserName={currentUser.name}
        />
      )}

      {/* CONFIRM DELETE MODAL WITH EXACT MESSAGE: "Do you really want to delete it?" */}
      {deletingEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Enquiry Record</h3>
                <p className="text-[11px] text-slate-500">Record #{deletingEnquiry.enquiryNumber}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              <p className="font-extrabold text-sm text-rose-900">
                Do you really want to delete it?
              </p>
              <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-rose-200/60">
                <div>
                  <span className="font-semibold text-slate-900">Student:</span> {deletingEnquiry.name}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Course:</span> {deletingEnquiry.course}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Contact:</span> {deletingEnquiry.phone} {deletingEnquiry.email ? `• ${deletingEnquiry.email}` : ''}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Current Status:</span> {deletingEnquiry.status}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingEnquiry(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                No, Keep Record
              </button>
              <button
                type="button"
                onClick={() => executeDeleteEnquiry(deletingEnquiry)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete It</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL (ADMIN ID: krishna & PASSWORD: apple123 OR STAFF CREATED BY ADMIN) */}
      {loginRoleModal && (
        <LoginModalInner
          role={loginRoleModal}
          adminCreds={adminCreds}
          staffList={staff}
          onClose={() => setLoginRoleModal(null)}
          onLogin={user => {
            setCurrentUser(user);
            setLoginRoleModal(null);
            setActiveTab('dashboard');
            showToast(`Welcome, ${user.name}! Logged in as ${user.role.toUpperCase()}`);
          }}
        />
      )}

      {/* ADMIN CREDENTIALS & SECURITY SETTINGS MODAL */}
      {isAdminSettingsOpen && (
        <AdminSecurityModal
          adminCreds={adminCreds}
          onClose={() => setIsAdminSettingsOpen(false)}
          onSave={newCreds => {
            setAdminCreds(newCreds);
            if (currentUser.role === 'admin') {
              setCurrentUser(prev => ({
                ...prev,
                userId: newCreds.adminId,
                name: newCreds.name
              }));
            }
            setIsAdminSettingsOpen(false);
            showToast('Admin ID and Password updated successfully!');
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// 5. INLINE SUBCOMPONENTS
// ==========================================

/**
 * Public Student Enquiry Form with Grouped Course Dropdown (Diploma, B.Tech, Pharmacy, Degree Courses)
 */
function PublicFormInner({
  courses,
  allEnquiries,
  onSubmit,
  onOpenLogin,
  preselectedCourse
}: {
  courses: Course[];
  allEnquiries: Enquiry[];
  onSubmit: (data: Partial<Enquiry>) => void;
  onOpenLogin: (role: 'admin' | 'staff') => void;
  preselectedCourse?: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [guardian, setGuardian] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [course, setCourse] = useState(preselectedCourse || courses[0]?.name || 'Diploma in Computer Engineering');
  const [qualification, setQualification] = useState('Intermediate');
  const [notes, setNotes] = useState('');

  const [submittedNum, setSubmittedNum] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<Enquiry | null>(null);
  const [allowDuplicateSubmit, setAllowDuplicateSubmit] = useState(false);

  // Field validation error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Sync if preselectedCourse prop updates
  useEffect(() => {
    if (preselectedCourse) {
      setCourse(preselectedCourse);
    }
  }, [preselectedCourse]);

  // Group courses by Category
  const groupedCourses = useMemo(() => {
    const map: Record<string, Course[]> = {
      'Diploma': [],
      'B.Tech': [],
      'Pharmacy': [],
      'Degree Courses': []
    };
    courses.forEach(c => {
      const cat = c.category || 'B.Tech';
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    });
    return map;
  }, [courses]);

  // Real-time phone validation & duplicate detection
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    const phoneRes = validatePhoneDetailed(val);
    setErrors(prev => ({ ...prev, phone: phoneRes.isValid ? '' : phoneRes.error! }));

    if (val.length >= 7 || (email && email.length >= 5)) {
      const match = findDuplicateEnquiry(allEnquiries, val, email);
      setDuplicateWarning(match);
    } else {
      setDuplicateWarning(null);
    }
  };

  // Real-time email validation (with special checks for Gmail)
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailRes = validateEmailDetailed(val, true);
    setErrors(prev => ({ ...prev, email: emailRes.isValid ? '' : emailRes.error! }));

    if ((val && val.length >= 5) || phone.length >= 7) {
      const match = findDuplicateEnquiry(allEnquiries, phone, val);
      setDuplicateWarning(match);
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    const nameRes = validateNameDetailed(val);
    setErrors(prev => ({ ...prev, name: nameRes.isValid ? '' : nameRes.error! }));
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    const cityRes = validateCityDetailed(val);
    setErrors(prev => ({ ...prev, city: cityRes.isValid ? '' : cityRes.error! }));
  };

  const validateAll = (): boolean => {
    const errs: Record<string, string> = {};

    const nameRes = validateNameDetailed(name);
    if (!nameRes.isValid) errs.name = nameRes.error!;

    const phoneRes = validatePhoneDetailed(phone);
    if (!phoneRes.isValid) errs.phone = phoneRes.error!;

    const emailRes = validateEmailDetailed(email, true);
    if (!emailRes.isValid) errs.email = emailRes.error!;

    const cityRes = validateCityDetailed(city);
    if (!cityRes.isValid) errs.city = cityRes.error!;

    const courseRes = validateCourseDetailed(course);
    if (!courseRes.isValid) errs.course = courseRes.error!;

    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, city: true, course: true });
    return Object.keys(errs).length === 0;
  };

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateAll()) {
      return;
    }

    if (duplicateWarning && !allowDuplicateSubmit) {
      return;
    }

    const num = generateEnquiryNumber(allEnquiries);
    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
      state: state.trim(),
      guardian: guardian.trim(),
      guardianPhone: guardianPhone.trim(),
      course,
      qualification,
      source: 'Website',
      status: 'New',
      notes: notes.trim() || 'Submitted via public student admission portal.'
    });

    setSubmittedNum(num);
  };

  if (submittedNum) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Enquiry Submitted Successfully!</h2>
        <p className="text-xs text-slate-500">Your admission enquiry reference number is:</p>
        <div className="inline-block px-5 py-2.5 bg-slate-900 text-amber-400 font-mono font-bold rounded-xl text-lg tracking-wider">
          {submittedNum}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
          Thank you, <strong>{name}</strong>! Our college admissions counselor will review your application for <strong>{course}</strong> and contact you via phone (<span className="text-slate-900 font-semibold">{phone}</span>) and email (<span className="text-slate-900 font-semibold">{email}</span>) with fee structures and scholarship guidance.
        </p>
        <div className="pt-3">
          <button
            type="button"
            onClick={() => {
              setSubmittedNum(null);
              setName('');
              setPhone('');
              setEmail('');
              setCity('');
              setState('');
              setGuardian('');
              setGuardianPhone('');
              setNotes('');
              setErrors({});
              setTouched({});
              setSubmitAttempted(false);
              setDuplicateWarning(null);
              setAllowDuplicateSubmit(false);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
          >
            Submit Another Student Enquiry
          </button>
        </div>
      </div>
    );
  }

  const hasFormErrors = Object.keys(errors).some(k => Boolean(errors[k]));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* College Banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>College Admissions 2026-27 Open</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Student Admission Enquiry Form</h1>
        <p className="text-xs text-indigo-200 mt-1 max-w-xl leading-relaxed">
          Select your course from Diploma, B.Tech, Pharmacy, or Degree Programs and connect with our counseling team.
        </p>
      </div>

      {/* Top Error Banner when submission attempted with invalid inputs */}
      {submitAttempted && hasFormErrors && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-start gap-3 shadow-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-950 text-sm">Please correct the invalid inputs highlighted below:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-rose-800">
              {errors.name && <li>Student Name: {errors.name}</li>}
              {errors.phone && <li>Phone Number: {errors.phone}</li>}
              {errors.email && <li>Email Address: {errors.email}</li>}
              {errors.city && <li>City: {errors.city}</li>}
              {errors.course && <li>Course: {errors.course}</li>}
            </ul>
          </div>
        </div>
      )}

      {/* Duplicate Detection Alert */}
      {duplicateWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-400 text-amber-950 text-xs flex items-start gap-3 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-900 text-sm">
                ⚠️ Duplicate Enquiry Detected
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                Match Found
              </span>
            </div>
            <p className="text-slate-800">
              A student enquiry with this contact information is already registered in our database:
            </p>
            <div className="p-2.5 rounded-lg bg-white/80 border border-amber-200 font-medium text-slate-900 space-y-0.5">
              <div>
                <strong>Student Name:</strong> {duplicateWarning.name} ({duplicateWarning.enquiryNumber})
              </div>
              <div>
                <strong>Course Applied:</strong> {duplicateWarning.course} • <strong>Status:</strong> {duplicateWarning.status}
              </div>
              <div>
                <strong>Matched Details:</strong> Phone: {duplicateWarning.phone} {duplicateWarning.email ? `| Email: ${duplicateWarning.email}` : ''}
              </div>
            </div>
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-900 bg-amber-100/70 p-2 rounded-lg border border-amber-300">
                <input
                  type="checkbox"
                  checked={allowDuplicateSubmit}
                  onChange={e => setAllowDuplicateSubmit(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>I confirm this is an intentional new enquiry and wish to submit anyway.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* The Public Form */}
      <form onSubmit={handleSub} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
        <div className="space-y-4">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider pb-2 border-b">
            01. Student Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Full Name */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-slate-700">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                {touched.name && !errors.name && name.trim() && (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Valid
                  </span>
                )}
              </div>
              <input
                type="text"
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, name: true }));
                  const r = validateNameDetailed(name);
                  setErrors(prev => ({ ...prev, name: r.isValid ? '' : r.error! }));
                }}
                placeholder="e.g. Aarav Sharma"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-xs ${
                  (touched.name || submitAttempted) && errors.name
                    ? 'border-rose-500 bg-rose-50/20 text-rose-950 focus:ring-rose-200'
                    : touched.name && name.trim()
                    ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-300'
                }`}
              />
              {(touched.name || submitAttempted) && errors.name && (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Mobile Phone Number */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-slate-700">
                  Mobile Phone Number <span className="text-rose-500">*</span>
                </label>
                {touched.phone && !errors.phone && phone.trim() && (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Valid (10 digits)
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => handlePhoneChange(e.target.value)}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, phone: true }));
                  const r = validatePhoneDetailed(phone);
                  setErrors(prev => ({ ...prev, phone: r.isValid ? '' : r.error! }));
                }}
                placeholder="e.g. 9876543210"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-xs ${
                  (touched.phone || submitAttempted) && errors.phone
                    ? 'border-rose-500 bg-rose-50/20 text-rose-950 focus:ring-rose-200'
                    : touched.phone && phone.trim() && !errors.phone
                    ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-300'
                }`}
              />
              {(touched.phone || submitAttempted) && errors.phone ? (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Enter a valid 10-digit mobile number</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-slate-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                {touched.email && !errors.email && email.trim() && (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Valid email
                  </span>
                )}
              </div>
              <input
                type="email"
                value={email}
                onChange={e => handleEmailChange(e.target.value)}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, email: true }));
                  const r = validateEmailDetailed(email, true);
                  setErrors(prev => ({ ...prev, email: r.isValid ? '' : r.error! }));
                }}
                placeholder="e.g. student@gmail.com"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-xs ${
                  (touched.email || submitAttempted) && errors.email
                    ? 'border-rose-500 bg-rose-50/20 text-rose-950 focus:ring-rose-200'
                    : touched.email && email.trim() && !errors.email
                    ? 'border-emerald-500 bg-emerald-50/10 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-300'
                }`}
              />
              {(touched.email || submitAttempted) && errors.email ? (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">e.g. student@gmail.com or name@yahoo.com</p>
              )}
            </div>

            {/* City */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-bold text-slate-700">
                  City <span className="text-rose-500">*</span>
                </label>
                {touched.city && !errors.city && city.trim() && (
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Valid
                  </span>
                )}
              </div>
              <input
                type="text"
                value={city}
                onChange={e => handleCityChange(e.target.value)}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, city: true }));
                  const r = validateCityDetailed(city);
                  setErrors(prev => ({ ...prev, city: r.isValid ? '' : r.error! }));
                }}
                placeholder="e.g. Pune"
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 transition text-xs ${
                  (touched.city || submitAttempted) && errors.city
                    ? 'border-rose-500 bg-rose-50/20 text-rose-950 focus:ring-rose-200'
                    : 'border-slate-300 focus:ring-indigo-300'
                }`}
              />
              {(touched.city || submitAttempted) && errors.city && (
                <p className="text-[11px] text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.city}</span>
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="block font-bold mb-1 text-slate-700">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="e.g. Maharashtra"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>
        </div>

        {/* 02. Course Selection with Diploma, B.Tech, Pharmacy, Degree categories */}
        <div className="space-y-4 pt-2">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider pb-2 border-b">
            02. Course & Qualification
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold mb-1 text-slate-700">
                Preferred Degree / Course <span className="text-rose-500">*</span>
              </label>
              <select
                value={course}
                onChange={e => {
                  setCourse(e.target.value);
                  const r = validateCourseDetailed(e.target.value);
                  setErrors(prev => ({ ...prev, course: r.isValid ? '' : r.error! }));
                }}
                className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {COURSE_CATEGORIES.map(categoryName => {
                  const catCourses = groupedCourses[categoryName] || [];
                  if (catCourses.length === 0) return null;
                  return (
                    <optgroup key={categoryName} label={`=== ${categoryName.toUpperCase()} PROGRAMS ===`}>
                      {catCourses.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} ({c.code}) - {c.duration} - Rs. {c.fees.toLocaleString('en-IN')}/yr
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Courses categorized across Diploma, B.Tech, Pharmacy, and Degree Courses.
              </p>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700">Prior Qualification</label>
              <select
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                <option value="10th / SSC">10th / SSC (For Diploma)</option>
                <option value="Intermediate">12th / Intermediate / HSC</option>
                <option value="Diploma">Diploma (Polytechnic)</option>
                <option value="Degree">Undergraduate Degree</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1 text-slate-700">Parent / Guardian Name</label>
              <input
                type="text"
                value={guardian}
                onChange={e => setGuardian(e.target.value)}
                placeholder="Parent's name"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold mb-1 text-slate-700">Questions / Specific Requests</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ask about hostel accommodation, scholarships, bus transport, or admission cutoffs..."
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              ></textarea>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Send className="w-4 h-4" />
          <span>Submit Student Admission Enquiry</span>
        </button>
      </form>
    </div>
  );
}

/**
 * Internal Enquiry Form (with Full Live Validation & Duplicate Detection)
 */
function EnquiryFormInner({
  initialData,
  courses,
  staff,
  allEnquiries,
  onSave,
  onCancel,
  preselectedCourse
}: {
  initialData?: Enquiry | null;
  courses: Course[];
  staff: Staff[];
  allEnquiries: Enquiry[];
  onSave: (data: Partial<Enquiry>) => void;
  onCancel: () => void;
  preselectedCourse?: string;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    dob: initialData?.dob || '',
    gender: initialData?.gender || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    guardian: initialData?.guardian || '',
    guardianPhone: initialData?.guardianPhone || '',
    course: initialData?.course || preselectedCourse || (courses[0]?.name || ''),
    qualification: initialData?.qualification || 'Intermediate',
    passingYear: initialData?.passingYear || 2026,
    source: initialData?.source || 'Website',
    status: (initialData?.status || 'New') as EnquiryStatus,
    counsellor: initialData?.counsellor || '',
    followUp: initialData?.followUp || '',
    notes: initialData?.notes || ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [duplicateWarning, setDuplicateWarning] = useState<Enquiry | null>(null);
  const [allowDup, setAllowDup] = useState(false);

  useEffect(() => {
    if (formData.phone.length >= 7 || formData.email.length >= 5) {
      const match = findDuplicateEnquiry(allEnquiries, formData.phone, formData.email, initialData?.id);
      setDuplicateWarning(match);
    } else {
      setDuplicateWarning(null);
    }
  }, [formData.phone, formData.email, allEnquiries, initialData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const nameRes = validateNameDetailed(formData.name);
    if (!nameRes.isValid) errs.name = nameRes.error!;

    const phoneRes = validatePhoneDetailed(formData.phone);
    if (!phoneRes.isValid) errs.phone = phoneRes.error!;

    const emailRes = validateEmailDetailed(formData.email, true);
    if (!emailRes.isValid) errs.email = emailRes.error!;

    if (!formData.course) {
      errs.course = 'Please select a course.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (duplicateWarning && !allowDup) {
      alert(`Duplicate warning: A record for ${duplicateWarning.name} (${duplicateWarning.phone}) already exists.`);
      return;
    }
    onSave({
      ...formData,
      gender: formData.gender as Enquiry['gender']
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {duplicateWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900">Potential Duplicate Record Detected:</span> An enquiry with matching phone or email exists for{' '}
            <strong>{duplicateWarning.name}</strong> ({duplicateWarning.enquiryNumber}, Course: {duplicateWarning.course}).
            <div>
              <label className="flex items-center gap-1.5 font-semibold text-slate-800 cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={allowDup}
                  onChange={e => setAllowDup(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span>Allow saving despite duplicate match</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 01: Personal Details */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          01. Personal Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                const r = validateNameDetailed(e.target.value);
                setFormErrors(prev => ({ ...prev, name: r.isValid ? '' : r.error! }));
              }}
              placeholder="e.g. Aarav Sharma"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formErrors.name ? 'border-rose-500 bg-rose-50/20 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-300'
              }`}
            />
            {formErrors.name && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e => {
                setFormData({ ...formData, phone: e.target.value });
                const r = validatePhoneDetailed(e.target.value);
                setFormErrors(prev => ({ ...prev, phone: r.isValid ? '' : r.error! }));
              }}
              placeholder="e.g. 9876543210"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formErrors.phone ? 'border-rose-500 bg-rose-50/20 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-300'
              }`}
            />
            {formErrors.phone && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.phone}
              </p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => {
                setFormData({ ...formData, email: e.target.value });
                const r = validateEmailDetailed(e.target.value, true);
                setFormErrors(prev => ({ ...prev, email: r.isValid ? '' : r.error! }));
              }}
              placeholder="student@gmail.com"
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formErrors.email ? 'border-rose-500 bg-rose-50/20 focus:ring-rose-200' : 'border-slate-300 focus:ring-indigo-300'
              }`}
            />
            {formErrors.email && (
              <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {formErrors.email}
              </p>
            )}
          </div>
          <div>
            <label className="block font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={e => setFormData({ ...formData, dob: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Pune"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={e => setFormData({ ...formData, state: e.target.value })}
              placeholder="e.g. Maharashtra"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* 02: Parent details */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          02. Parent / Guardian
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Guardian Name</label>
            <input
              type="text"
              value={formData.guardian}
              onChange={e => setFormData({ ...formData, guardian: e.target.value })}
              placeholder="Guardian name"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Guardian Phone</label>
            <input
              type="tel"
              value={formData.guardianPhone}
              onChange={e => setFormData({ ...formData, guardianPhone: e.target.value })}
              placeholder="Guardian mobile"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* 03: Admission & Course */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
          03. Admission & Follow-Up
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold mb-1">Course Interested In *</label>
            <select
              value={formData.course}
              onChange={e => setFormData({ ...formData, course: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-medium"
            >
              {COURSE_CATEGORIES.map(cat => {
                const catCourses = courses.filter(c => c.category === cat);
                if (catCourses.length === 0) return null;
                return (
                  <optgroup key={cat} label={`=== ${cat.toUpperCase()} ===`}>
                    {catCourses.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.code}) - Rs. {c.fees.toLocaleString('en-IN')}/yr
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Qualification</label>
            <select
              value={formData.qualification}
              onChange={e => setFormData({ ...formData, qualification: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            >
              <option value="10th / SSC">10th / SSC</option>
              <option value="Intermediate">12th / Intermediate</option>
              <option value="Diploma">Diploma (Polytechnic)</option>
              <option value="Degree">Undergraduate Degree</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Status *</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as EnquiryStatus })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-semibold"
            >
              {STATUS_LIST.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Assigned Counselor</label>
            <select
              value={formData.counsellor}
              onChange={e => setFormData({ ...formData, counsellor: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Unassigned</option>
              {staff.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.designation})
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Next Follow-Up Date</label>
            <input
              type="date"
              value={formData.followUp}
              onChange={e => setFormData({ ...formData, followUp: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold mb-1">Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Initial student queries, counseling details..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-xs cursor-pointer"
        >
          {initialData ? 'Update Enquiry' : 'Save Enquiry'}
        </button>
      </div>
    </form>
  );
}

/**
 * All Enquiries Table View with Confirmed Deletion & Duplicate Indicators
 */
function EnquiriesListInner({
  enquiries,
  courses,
  staff,
  onOpenNewEnquiry,
  onEditEnquiry,
  onRequestDeleteEnquiry,
  onSelectEnquiry,
  onExportCSV,
  userRole,
  isEmbedded = false
}: {
  enquiries: Enquiry[];
  courses: Course[];
  staff: Staff[];
  onOpenNewEnquiry: () => void;
  onEditEnquiry: (enquiry: Enquiry) => void;
  onRequestDeleteEnquiry: (enquiry: Enquiry) => void;
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onExportCSV: () => void;
  userRole: UserRole;
  isEmbedded?: boolean;
}) {
  const [q, setQ] = useState('');
  const [stFilter, setStFilter] = useState('');
  const [crFilter, setCrFilter] = useState('');
  const [onlyDuplicates, setOnlyDuplicates] = useState(false);

  const duplicateIdSet = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < enquiries.length; i++) {
      const match = findDuplicateEnquiry(enquiries, enquiries[i].phone, enquiries[i].email, enquiries[i].id);
      if (match) set.add(enquiries[i].id);
    }
    return set;
  }, [enquiries]);

  const filtered = enquiries.filter(item => {
    if (stFilter && item.status !== stFilter) return false;
    if (crFilter && item.course !== crFilter) return false;
    if (onlyDuplicates && !duplicateIdSet.has(item.id)) return false;
    if (!q) return true;
    const searchStr = `${item.name} ${item.phone} ${item.email} ${item.city} ${item.course} ${item.counsellor} ${item.enquiryNumber}`.toLowerCase();
    return searchStr.includes(q.toLowerCase());
  });

  return (
    <div className="space-y-4">
      {!isEmbedded && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Student Enquiries</h1>
            <p className="text-xs text-slate-500">Manage all prospective student applications.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onExportCSV}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Export</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewEnquiry}
              className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Enquiry</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, phone, email, city..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 bg-white rounded-lg text-xs"
          />
        </div>
        <div>
          <select
            value={stFilter}
            onChange={e => setStFilter(e.target.value)}
            className="w-full p-1.5 border border-slate-300 bg-white rounded-lg font-medium text-xs"
          >
            <option value="">All Statuses ({enquiries.length})</option>
            {STATUS_LIST.map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
        <div>
          <select
            value={crFilter}
            onChange={e => setCrFilter(e.target.value)}
            className="w-full p-1.5 border border-slate-300 bg-white rounded-lg font-medium text-xs"
          >
            <option value="">All Courses ({courses.length})</option>
            {courses.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 text-xs">
            <input
              type="checkbox"
              checked={onlyDuplicates}
              onChange={e => setOnlyDuplicates(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Duplicates Only ({duplicateIdSet.size})</span>
            </span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Counselor</th>
              <th className="py-3 px-4">Follow-up</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No matching student enquiries found.
                </td>
              </tr>
            ) : (
              filtered.map(enq => {
                const cfg = STATUS_CONFIG[enq.status] || STATUS_CONFIG.New;
                const fu = getFollowUpStatus(enq.followUp, enq.status);
                const isDup = duplicateIdSet.has(enq.id);

                return (
                  <tr key={enq.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <span>{enq.name}</span>
                        {isDup && (
                          <span
                            title="Duplicate phone or email match found"
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold"
                          >
                            <AlertTriangle className="w-2.5 h-2.5" /> Duplicate
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {enq.enquiryNumber} {enq.city ? `• ${enq.city}` : ''}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{enq.phone}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{enq.email || '—'}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{enq.course}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {enq.counsellor || <span className="text-rose-500 font-semibold">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4">
                      {enq.followUp ? (
                        <div>
                          <div>{enq.followUp}</div>
                          {fu === 'overdue' && <span className="text-[10px] text-rose-600 font-bold">Overdue</span>}
                          {fu === 'today' && <span className="text-[10px] text-amber-600 font-bold">Due Today</span>}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onSelectEnquiry(enq)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                          title="View Details & Log Call"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditEnquiry(enq)}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 rounded cursor-pointer"
                          title="Edit Enquiry"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Admin Delete Action with dedicated confirmation modal */}
                        {userRole === 'admin' && (
                          <button
                            type="button"
                            onClick={() => onRequestDeleteEnquiry(enq)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded cursor-pointer transition active:scale-90"
                            title="Delete Enquiry Record (Asks confirmation)"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Follow-up Workspace View
 */
function FollowUpsInner({
  enquiries,
  onSelectEnquiry,
  onUpdateStatus
}: {
  enquiries: Enquiry[];
  onSelectEnquiry: (enquiry: Enquiry) => void;
  onUpdateStatus: (id: string, newStatus: EnquiryStatus) => void;
}) {
  const followUpQueue = enquiries.filter(
    e => e.followUp && e.status !== 'Admitted' && e.status !== 'Not Interested'
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Follow-up Call Workspace</h1>
        <p className="text-xs text-slate-500">Track and execute scheduled calls with prospective students.</p>
      </div>

      <div className="space-y-3">
        {followUpQueue.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border text-slate-400 text-xs">
            No follow-ups currently scheduled.
          </div>
        ) : (
          followUpQueue.map(enq => {
            const fu = getFollowUpStatus(enq.followUp, enq.status);
            return (
              <div
                key={enq.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{enq.name}</span>
                    <span className="text-[11px] text-slate-400">({enq.enquiryNumber})</span>
                    {fu === 'overdue' && (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                        Overdue ({enq.followUp})
                      </span>
                    )}
                    {fu === 'today' && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                        Due Today
                      </span>
                    )}
                  </div>
                  <div className="text-slate-600 mt-1">
                    Course: <strong>{enq.course}</strong> • Counselor: {enq.counsellor || 'Unassigned'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${enq.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                  >
                    Call {enq.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectEnquiry(enq)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold cursor-pointer"
                  >
                    Log Call
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(enq.id, 'Admitted')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold cursor-pointer"
                  >
                    Admitted
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/**
 * Courses & Fees Management View (For Both Admin and Student Page)
 * Features Category Filters (Diploma, B.Tech, Pharmacy, Degree Courses), Full Fee Editing, and In-App Removal Modal
 */
function CoursesInner({
  courses,
  onSaveCourse,
  onDeleteCourse,
  userRole,
  onSelectCourseForEnquiry
}: {
  courses: Course[];
  onSaveCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  userRole: UserRole;
  onSelectCourseForEnquiry: (courseName: string) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Course Edit/Add Modal State
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<CourseCategory>('B.Tech');
  const [formFees, setFormFees] = useState(150000);
  const [formDuration, setFormDuration] = useState('4 Years (8 Semesters)');
  const [formEligibility, setFormEligibility] = useState('10+2 with min 50%');
  const [formSeats, setFormSeats] = useState(60);
  const [formDepartment, setFormDepartment] = useState('School of Engineering');

  // Custom in-app Course Deletion Confirmation Modal
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);

  const openAddModal = () => {
    setEditingCourse(null);
    setFormName('');
    setFormCode('');
    setFormCategory('Diploma');
    setFormFees(55000);
    setFormDuration('3 Years (6 Semesters)');
    setFormEligibility('10th / SSC with min 50% aggregate');
    setFormSeats(60);
    setFormDepartment('Polytechnic Department');
    setCourseModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormName(c.name);
    setFormCode(c.code);
    setFormCategory(c.category || 'B.Tech');
    setFormFees(c.fees);
    setFormDuration(c.duration);
    setFormEligibility(c.eligibility);
    setFormSeats(c.totalSeats);
    setFormDepartment(c.department || 'Academic Department');
    setCourseModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      alert('Please provide Course Name and Code.');
      return;
    }

    onSaveCourse({
      id: editingCourse ? editingCourse.id : generateId(),
      code: formCode.trim().toUpperCase(),
      name: formName.trim(),
      category: formCategory,
      duration: formDuration.trim(),
      fees: Number(formFees),
      eligibility: formEligibility.trim(),
      totalSeats: Number(formSeats),
      enrolledSeats: editingCourse ? editingCourse.enrolledSeats : 0,
      isActive: true,
      department: formDepartment.trim()
    });

    setCourseModalOpen(false);
  };

  const filteredCourses = courses.filter(c => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const s = `${c.name} ${c.code} ${c.category} ${c.eligibility}`.toLowerCase();
    return s.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Title & Add Course button for Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Courses & Tuition Fees</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
              {courses.length} Programs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive curriculum, annual tuition fees, and admission eligibility across all 4 streams.
          </p>
        </div>
        {userRole === 'admin' && (
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer self-start sm:self-auto active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar: Stream Category Filter Tabs (Diploma, B.Tech, Pharmacy, Degree Courses) + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Courses ({courses.length})
          </button>
          {COURSE_CATEGORIES.map(cat => {
            const count = courses.filter(c => c.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border text-slate-400 text-xs">
            No courses found matching "{searchQuery}" in category {selectedCategory}.
          </div>
        ) : (
          filteredCourses.map(c => {
            const catBadgeColor =
              c.category === 'Diploma'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : c.category === 'B.Tech'
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : c.category === 'Pharmacy'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-purple-50 text-purple-800 border-purple-200';

            return (
              <div
                key={c.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between text-xs space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${catBadgeColor}`}>
                      {c.category || 'Degree'}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {c.code}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {c.name}
                  </h3>

                  {/* Fee Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Annual Tuition Fee:</span>
                      <span className="font-extrabold text-indigo-700 text-sm">
                        Rs. {c.fees.toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-slate-500">/ yr</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Duration:</span>
                      <span className="font-semibold text-slate-800">{c.duration}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Intake Capacity:</span>
                      <span className="font-semibold text-slate-800">{c.totalSeats} seats</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">Eligibility:</strong> {c.eligibility}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  {userRole === 'admin' ? (
                    <div className="w-full flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openEditModal(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                        title="Edit course details and tuition fees"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit Course & Fees</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCourse(c)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer active:scale-95"
                        title="Remove course"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectCourseForEnquiry(c.name)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
                    >
                      <span>Apply / Enquire for this Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* EDIT / ADD COURSE MODAL (TOTALLY EDITABLE LIKE FEES, DURATION, SEATS) */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSubmit}
            className="bg-white p-6 rounded-2xl max-w-lg w-full space-y-4 text-xs shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150"
          >
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {editingCourse ? `Edit Course: ${editingCourse.name}` : 'Add New Academic Course'}
                </h3>
                <p className="text-[11px] text-slate-400">Update tuition fees, criteria, and stream details</p>
              </div>
              <button
                type="button"
                onClick={() => setCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold mb-1 text-slate-700">Course / Degree Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Diploma in Computer Engineering"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Course Code *</label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={e => setFormCode(e.target.value)}
                  placeholder="e.g. DIP-CE"
                  className="w-full p-2.5 border border-slate-300 rounded-lg uppercase font-mono font-bold text-xs focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Stream / Category *</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as CourseCategory)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-xs focus:ring-2 focus:ring-indigo-300"
                >
                  {COURSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Annual Tuition Fee (Rs.) *</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={formFees}
                  onChange={e => setFormFees(Number(e.target.value))}
                  placeholder="e.g. 55000"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700 text-xs focus:ring-2 focus:ring-indigo-300"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Current: Rs. {Number(formFees || 0).toLocaleString('en-IN')}/year
                </span>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Course Duration</label>
                <input
                  type="text"
                  required
                  value={formDuration}
                  onChange={e => setFormDuration(e.target.value)}
                  placeholder="e.g. 3 Years (6 Semesters)"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Total Seat Capacity</label>
                <input
                  type="number"
                  min={1}
                  value={formSeats}
                  onChange={e => setFormSeats(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-700">Department</label>
                <input
                  type="text"
                  value={formDepartment}
                  onChange={e => setFormDepartment(e.target.value)}
                  placeholder="e.g. Polytechnic Department"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold mb-1 text-slate-700">Minimum Eligibility Criteria *</label>
                <textarea
                  rows={2}
                  required
                  value={formEligibility}
                  onChange={e => setFormEligibility(e.target.value)}
                  placeholder="e.g. 10th / SSC with min 50% aggregate"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-300"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setCourseModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs cursor-pointer active:scale-98"
              >
                {editingCourse ? 'Save Updated Course & Fees' : 'Add Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOM IN-APP COURSE DELETION CONFIRMATION MODAL (NO WINDOW.CONFIRM) */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Remove Course</h3>
                <p className="text-[11px] text-slate-500">Course Code: {deletingCourse.code}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              <p className="font-extrabold text-sm text-rose-900">
                Do you really want to remove this course?
              </p>
              <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-rose-200/60">
                <div>
                  <span className="font-semibold text-slate-900">Course Name:</span> {deletingCourse.name}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Category:</span> {deletingCourse.category}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Tuition Fee:</span> Rs. {deletingCourse.fees.toLocaleString('en-IN')}/year
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                No, Keep Course
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCourse(deletingCourse.id);
                  setDeletingCourse(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Remove Course</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Staff Accounts Directory (Admin Creates Multiple Accounts & Passwords with Custom In-App Deletion Modal)
 */
function StaffManagementInner({
  staff,
  enquiries,
  onSaveStaff,
  onDeleteStaff
}: {
  staff: Staff[];
  enquiries: Enquiry[];
  onSaveStaff: (s: Staff) => void;
  onDeleteStaff: (id: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Admission Counselor');
  const [department, setDepartment] = useState('Admissions & Counseling');
  const [canViewAll, setCanViewAll] = useState(false);

  // Custom in-app Staff Deletion Confirmation Modal
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  const openAdd = () => {
    setEditingStaff(null);
    setStaffId(`staff${staff.length + 1}`);
    setPassword('staff123');
    setName('');
    setEmail('');
    setPhone('');
    setDesignation('Admission Counselor');
    setDepartment('Admissions Directorate');
    setCanViewAll(false);
    setIsModalOpen(true);
  };

  const openEdit = (s: Staff) => {
    setEditingStaff(s);
    setStaffId(s.staffId);
    setPassword(s.password);
    setName(s.name);
    setEmail(s.email);
    setPhone(s.phone);
    setDesignation(s.designation);
    setDepartment(s.department);
    setCanViewAll(Boolean(s.canViewAllEnquiries));
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffId.trim() || !password.trim() || !name.trim()) {
      alert('Please provide Staff Login ID, Password, and Full Name.');
      return;
    }

    onSaveStaff({
      id: editingStaff ? editingStaff.id : generateId(),
      staffId: staffId.trim(),
      password: password.trim(),
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role: 'staff',
      designation: designation.trim(),
      department: department.trim(),
      isActive: true,
      canViewAllEnquiries: canViewAll
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Staff Accounts & Access Management</h1>
          <p className="text-xs text-slate-500">
            Create multiple staff accounts, assign staff ID & passwords, and configure access permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs self-start sm:self-auto cursor-pointer active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Staff Account</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(s => {
          const assignedCount = enquiries.filter(e => e.counsellor === s.name).length;
          return (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                  <div className="text-[11px] text-indigo-600 font-mono font-semibold">
                    Staff Login ID: {s.staffId}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Counselor
                </span>
              </div>

              {/* Password display so admin can manage credentials */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-slate-400" /> Password:
                </span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {s.password}
                </span>
              </div>

              <div className="text-slate-600 space-y-1">
                <div>{s.designation}</div>
                <div className="text-slate-400 text-[11px]">{s.department}</div>
                <div className="text-slate-400 text-[11px]">{s.email || 'No email'} • {s.phone || 'No phone'}</div>
              </div>

              <div className="pt-2 border-t flex justify-between items-center text-slate-700">
                <span>Assigned Enquiries:</span>
                <span className="font-bold text-indigo-600">{assignedCount}</span>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(s)}
                  className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded cursor-pointer"
                >
                  Edit / Password
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingStaff(s)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition active:scale-90"
                  title="Remove staff account"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating / Editing Staff Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl max-w-md w-full space-y-4 text-xs shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-sm text-slate-900">
                {editingStaff ? 'Edit Staff Account & Password' : 'Create Staff Member Account'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Staff Login ID *</label>
                <input
                  type="text"
                  required
                  value={staffId}
                  onChange={e => setStaffId(e.target.value)}
                  placeholder="e.g. counselor1"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Login Password *</label>
                <input
                  type="text"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="e.g. staff123"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-indigo-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dr. Priya Mehta"
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Counselor"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Admissions Desk"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="staff@college.edu"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9845012345"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="canViewAll"
                checked={canViewAll}
                onChange={e => setCanViewAll(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <label htmlFor="canViewAll" className="text-slate-700 font-medium cursor-pointer">
                Grant access to view all enquiries (not just assigned)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer">
                {editingStaff ? 'Update Account' : 'Create Staff Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CUSTOM IN-APP STAFF REMOVAL CONFIRMATION MODAL */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-xs space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Remove Staff Account</h3>
                <p className="text-[11px] text-slate-500">Staff ID: {deletingStaff.staffId}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-2">
              <p className="font-extrabold text-sm text-rose-900">
                Do you really want to remove this staff account?
              </p>
              <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-rose-200/60">
                <div>
                  <span className="font-semibold text-slate-900">Staff Name:</span> {deletingStaff.name}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Designation:</span> {deletingStaff.designation}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Department:</span> {deletingStaff.department}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition cursor-pointer"
              >
                No, Keep Account
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteStaff(deletingStaff.id);
                  setDeletingStaff(null);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Remove Staff</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Reports View
 */
function ReportsInner({
  enquiries,
  courses,
  staff
}: {
  enquiries: Enquiry[];
  courses: Course[];
  staff: Staff[];
}) {
  const total = enquiries.length;
  const rate = calculateConversionRate(enquiries);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Analytics & Intake Reports</h1>
          <p className="text-xs text-slate-500">Statistical breakdown of enquiries, conversions, and courses.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-3xl font-extrabold text-slate-900">{total}</div>
          <p className="text-xs text-slate-500 mt-1">Total Enquiries Received</p>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-3xl font-extrabold text-emerald-600">{rate}%</div>
          <p className="text-xs text-slate-500 mt-1">Conversion To Admissions</p>
        </div>
        <div className="p-5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
          <div className="text-3xl font-extrabold text-indigo-600">{courses.length}</div>
          <p className="text-xs text-slate-500 mt-1">Active Academic Programs</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Detail Modal with Communication Logs
 */
function EnquiryModalInner({
  enquiry,
  staff,
  onClose,
  onUpdateStatus,
  onUpdateCounselor,
  onAddCommunication,
  currentUserName
}: {
  enquiry: Enquiry;
  staff: Staff[];
  onClose: () => void;
  onUpdateStatus: (id: string, s: EnquiryStatus) => void;
  onUpdateCounselor: (id: string, name: string, idStaff?: string) => void;
  onAddCommunication: (id: string, log: CommunicationLog, nextDate?: string) => void;
  currentUserName: string;
}) {
  const [notes, setNotes] = useState('');
  const [commType, setCommType] = useState<CommunicationLog['type']>('Phone Call');
  const [nextDate, setNextDate] = useState(enquiry.followUp || '');

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    onAddCommunication(
      enquiry.id,
      {
        id: generateId(),
        enquiryId: enquiry.id,
        type: commType,
        notes: notes.trim(),
        outcome: 'Interaction logged',
        nextFollowUpDate: nextDate || undefined,
        counselorName: currentUserName,
        timestamp: new Date().toISOString()
      },
      nextDate || undefined
    );
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-3 border-b">
          <div>
            <h2 className="text-base font-bold text-slate-900">{enquiry.name}</h2>
            <p className="text-slate-400">{enquiry.enquiryNumber} • Course: {enquiry.course}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
          <div>
            <label className="block font-bold mb-1">Status</label>
            <select
              value={enquiry.status}
              onChange={e => onUpdateStatus(enquiry.id, e.target.value as EnquiryStatus)}
              className="w-full p-1.5 border rounded bg-white font-semibold cursor-pointer"
            >
              {STATUS_LIST.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-bold mb-1">Assigned Counselor</label>
            <select
              value={enquiry.counsellor || ''}
              onChange={e => onUpdateCounselor(enquiry.id, e.target.value)}
              className="w-full p-1.5 border rounded bg-white font-medium cursor-pointer"
            >
              <option value="">Unassigned</option>
              {staff.map(s => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.designation})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <p>
            <strong>Phone:</strong> {enquiry.phone} | <strong>Email:</strong> {enquiry.email || 'N/A'}
          </p>
          <p>
            <strong>City:</strong> {enquiry.city || 'N/A'}, {enquiry.state || ''}
          </p>
          {enquiry.notes && <p className="p-2 bg-slate-50 rounded text-slate-600 italic">{enquiry.notes}</p>}
        </div>

        <form onSubmit={handleLog} className="p-3 border rounded-xl space-y-2 bg-indigo-50/50">
          <h4 className="font-bold text-indigo-900">Record Communication Entry</h4>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={commType}
              onChange={e => setCommType(e.target.value as CommunicationLog['type'])}
              className="p-1.5 border rounded bg-white cursor-pointer"
            >
              <option value="Phone Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Campus Visit">Campus Visit</option>
            </select>
            <input
              type="date"
              value={nextDate}
              onChange={e => setNextDate(e.target.value)}
              className="p-1.5 border rounded bg-white"
            />
          </div>
          <textarea
            rows={2}
            required
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Conversation summary..."
            className="w-full p-2 border rounded bg-white"
          ></textarea>
          <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded cursor-pointer">
            Save Log
          </button>
        </form>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-800">Communication History</h4>
          {(enquiry.communications || []).length === 0 ? (
            <p className="text-slate-400">No communication logs recorded yet.</p>
          ) : (
            (enquiry.communications || []).map(comm => (
              <div key={comm.id} className="p-2.5 border rounded-lg bg-white space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-indigo-700">{comm.type}</span>
                  <span>{comm.timestamp ? new Date(comm.timestamp).toLocaleString() : ''}</span>
                </div>
                <p className="text-slate-700">{comm.notes}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Login Modal for Admin (ID: krishna, pass: apple123) and Staff (Created by Admin)
 */
function LoginModalInner({
  role,
  adminCreds,
  staffList,
  onClose,
  onLogin
}: {
  role: 'admin' | 'staff';
  adminCreds: AdminCredentials;
  staffList: Staff[];
  onClose: () => void;
  onLogin: (user: AuthUser) => void;
}) {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedId = userIdInput.trim();
    const trimmedPass = passwordInput.trim();

    if (role === 'admin') {
      if (trimmedId === adminCreds.adminId && trimmedPass === adminCreds.password) {
        onLogin({
          id: 'admin-main',
          userId: adminCreds.adminId,
          name: adminCreds.name,
          email: 'admin@college.edu',
          role: 'admin',
          designation: 'Institutional Administrator'
        });
      } else {
        setErrorMsg(`Invalid Admin ID or Password. (Current Admin ID: ${adminCreds.adminId})`);
      }
    } else {
      const matched = staffList.find(
        s => s.staffId.toLowerCase() === trimmedId.toLowerCase() && s.password === trimmedPass
      );

      if (matched) {
        onLogin({
          id: matched.id,
          userId: matched.staffId,
          name: matched.name,
          email: matched.email,
          role: 'staff',
          designation: matched.designation
        });
      } else {
        setErrorMsg('Staff credentials incorrect. Please enter the Staff ID and Password created by the Admin.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-xs space-y-4 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
              Adi
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {role === 'admin' ? 'Administrator Login' : 'Staff / Counselor Login'}
              </h2>
              <p className="text-[10px] text-slate-400">adiES Secure Portal</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-3">
          <div>
            <label className="block font-semibold mb-1">
              {role === 'admin' ? 'Admin ID' : 'Staff ID (Created by Admin)'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={userIdInput}
                onChange={e => setUserIdInput(e.target.value)}
                placeholder={role === 'admin' ? 'e.g. krishna' : 'e.g. priya101'}
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-medium"
              />
            </div>
            {role === 'admin' && (
              <p className="text-[11px] text-slate-400 mt-1">
                Default credentials: <strong className="text-slate-700">{adminCreds.adminId} / {adminCreds.password}</strong>
              </p>
            )}
            {role === 'staff' && staffList.length > 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Sample staff login:{' '}
                <strong className="text-slate-700">
                  {staffList[0].staffId} / {staffList[0].password}
                </strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to {role === 'admin' ? 'Admin Portal' : 'Staff Portal'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Modal to edit Admin ID and Password anytime
 */
function AdminSecurityModal({
  adminCreds,
  onClose,
  onSave
}: {
  adminCreds: AdminCredentials;
  onClose: () => void;
  onSave: (creds: AdminCredentials) => void;
}) {
  const [id, setId] = useState(adminCreds.adminId);
  const [pass, setPass] = useState(adminCreds.password);
  const [name, setName] = useState(adminCreds.name);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !pass.trim()) {
      alert('Admin ID and Password cannot be blank.');
      return;
    }
    onSave({
      adminId: id.trim(),
      password: pass.trim(),
      name: name.trim() || 'Administrator'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form onSubmit={handleSave} className="bg-white rounded-2xl max-w-sm w-full p-6 text-xs space-y-4 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center pb-2 border-b">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Admin Security & Password</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-500 text-[11px]">
          You can edit your Administrator login ID and password here anytime.
        </p>

        <div>
          <label className="block font-semibold mb-1">Administrator Display Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Admin ID (Username)</label>
          <input
            type="text"
            required
            value={id}
            onChange={e => setId(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-mono font-bold text-indigo-700"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Admin Password</label>
          <input
            type="text"
            required
            value={pass}
            onChange={e => setPass(e.target.value)}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-300 font-mono font-bold text-indigo-700"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t">
          <button type="button" onClick={onClose} className="px-3 py-1.5 border rounded-lg text-slate-600 cursor-pointer">
            Cancel
          </button>
          <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer">
            Save New Credentials
          </button>
        </div>
      </form>
    </div>
  );
}
