export interface Student {
  id: string;
  name: string;
  idCard: string;
  password: string;
}

export interface System {
  id: number;
  isOccupied: boolean;
  occupiedBy?: string;
  studentId?: string;
  startTime?: Date;
}

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  systemNumber: number;
  startTime: Date;
  duration: number; // in minutes
}

// Mock students database
export const mockStudents: Student[] = [
  { id: "1", name: "John Doe", idCard: "ST2024001", password: "password123" },
  { id: "2", name: "Jane Smith", idCard: "ST2024002", password: "password123" },
  { id: "3", name: "Mike Johnson", idCard: "ST2024003", password: "password123" },
  { id: "4", name: "Sarah Williams", idCard: "ST2024004", password: "password123" },
  { id: "5", name: "Tom Brown", idCard: "ST2024005", password: "password123" },
];

// Mock admin credentials
export const mockAdmin = {
  username: "admin",
  password: "admin123",
};

// Initialize systems (30 systems total)
export const initializeSystems = (): System[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    isOccupied: false,
  }));
};

// Session storage key
export const STORAGE_KEYS = {
  SYSTEMS: "slams_systems",
  SESSIONS: "slams_sessions",
  CURRENT_USER: "slams_current_user",
  ADMIN_AUTH: "slams_admin_auth",
};
