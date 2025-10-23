import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SystemCard from "@/components/SystemCard";
import SessionTimer from "@/components/SessionTimer";
import { System, Student, Session, STORAGE_KEYS, initializeSystems } from "@/lib/mockData";

const Systems = () => {
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [systems, setSystems] = useState<System[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!userStr) {
      navigate("/login");
      return;
    }
    
    setCurrentUser(JSON.parse(userStr));

    // Load or initialize systems
    const systemsStr = localStorage.getItem(STORAGE_KEYS.SYSTEMS);
    if (systemsStr) {
      setSystems(JSON.parse(systemsStr));
    } else {
      const initialSystems = initializeSystems();
      setSystems(initialSystems);
      localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(initialSystems));
    }

    // Check for active session
    const sessionsStr = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (sessionsStr) {
      const sessions: Session[] = JSON.parse(sessionsStr);
      const user = JSON.parse(userStr);
      const userSession = sessions.find(s => s.studentId === user.id);
      if (userSession) {
        setActiveSession(userSession);
      }
    }
  }, [navigate]);

  const handleSystemSelect = (systemId: number) => {
    if (!currentUser || activeSession) return;

    const updatedSystems = systems.map(sys =>
      sys.id === systemId
        ? {
            ...sys,
            isOccupied: true,
            occupiedBy: currentUser.name,
            studentId: currentUser.id,
            startTime: new Date(),
          }
        : sys
    );

    const newSession: Session = {
      id: Date.now().toString(),
      studentId: currentUser.id,
      studentName: currentUser.name,
      systemNumber: systemId,
      startTime: new Date(),
      duration: 0,
    };

    // Update storage
    setSystems(updatedSystems);
    localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(updatedSystems));

    const sessionsStr = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
    sessions.push(newSession);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));

    setActiveSession(newSession);

    toast({
      title: "System Assigned",
      description: `You are now using System ${systemId}`,
    });
  };

  const handleLogout = () => {
    if (activeSession) {
      // End session
      const updatedSystems = systems.map(sys =>
        sys.id === activeSession.systemNumber
          ? { ...sys, isOccupied: false, occupiedBy: undefined, studentId: undefined, startTime: undefined }
          : sys
      );

      setSystems(updatedSystems);
      localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(updatedSystems));

      const sessionsStr = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (sessionsStr) {
        const sessions: Session[] = JSON.parse(sessionsStr);
        const updatedSessions = sessions.filter(s => s.id !== activeSession.id);
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
      }
    }

    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    navigate("/login");
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const vacantCount = systems.filter(s => !s.isOccupied).length;
  const isLabFull = vacantCount === 0;

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Lab Systems</h1>
              {currentUser && (
                <p className="text-muted-foreground mt-1">Welcome, {currentUser.name}</p>
              )}
            </div>
            
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {activeSession && (
            <div className="mb-6">
              <SessionTimer startTime={activeSession.startTime} />
            </div>
          )}

          {isLabFull && !activeSession && (
            <Alert className="mb-6 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Lab is fully occupied. Please wait for a system to become available.
              </AlertDescription>
            </Alert>
          )}

          {activeSession ? (
            <Alert className="mb-6 border-success">
              <AlertDescription>
                You are currently using System {activeSession.systemNumber}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">{vacantCount}</span> systems available out of {systems.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click on a vacant system to start your session
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {systems.map((system) => (
              <SystemCard
                key={system.id}
                systemNumber={system.id}
                isOccupied={system.isOccupied}
                occupiedBy={system.occupiedBy}
                onClick={() => handleSystemSelect(system.id)}
                disabled={!!activeSession}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Systems;
