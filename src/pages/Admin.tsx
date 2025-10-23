import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, LogOut, User, Clock, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { System, Session, STORAGE_KEYS, mockAdmin } from "@/lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [systems, setSystems] = useState<System[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const authStr = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (authStr === "true") {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadData = () => {
    const systemsStr = localStorage.getItem(STORAGE_KEYS.SYSTEMS);
    const sessionsStr = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    
    if (systemsStr) setSystems(JSON.parse(systemsStr));
    if (sessionsStr) {
      const allSessions: Session[] = JSON.parse(sessionsStr);
      // Update session durations
      const updatedSessions = allSessions.map(session => ({
        ...session,
        duration: Math.floor((new Date().getTime() - new Date(session.startTime).getTime()) / 60000)
      }));
      setSessions(updatedSessions);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === mockAdmin.username && password === mockAdmin.password) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, "true");
      loadData();
      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setUsername("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "Admin logged out successfully",
    });
  };

  const handleEndSession = (sessionId: string, systemNumber: number) => {
    const updatedSystems = systems.map(sys =>
      sys.id === systemNumber
        ? { ...sys, isOccupied: false, occupiedBy: undefined, studentId: undefined, startTime: undefined }
        : sys
    );

    const updatedSessions = sessions.filter(s => s.id !== sessionId);

    setSystems(updatedSystems);
    setSessions(updatedSessions);

    localStorage.setItem(STORAGE_KEYS.SYSTEMS, JSON.stringify(updatedSystems));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));

    toast({
      title: "Session Ended",
      description: `System ${systemNumber} is now vacant`,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        
        <div className="flex-1 flex items-center justify-center p-4 bg-muted/50">
          <Card className="w-full max-w-md p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Admin Login</h1>
              <p className="text-muted-foreground mt-2">
                Access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-xs font-mono">Username: admin</p>
              <p className="text-xs font-mono">Password: admin123</p>
            </div>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  const occupiedCount = systems.filter(s => s.isOccupied).length;
  const vacantCount = systems.length - occupiedCount;

  const chartData = [
    { name: "Occupied", value: occupiedCount, color: "hsl(var(--destructive))" },
    { name: "Vacant", value: vacantCount, color: "hsl(var(--success))" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Systems</p>
                  <p className="text-3xl font-bold">{systems.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-destructive/10">
                  <Monitor className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupied</p>
                  <p className="text-3xl font-bold">{occupiedCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/10">
                  <Monitor className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vacant</p>
                  <p className="text-3xl font-bold">{vacantCount}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">System Usage Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Active Sessions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active Sessions</h2>
            
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No active sessions</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Student</th>
                      <th className="text-left p-3">System</th>
                      <th className="text-left p-3">Start Time</th>
                      <th className="text-left p-3">Duration</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {session.studentName}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Monitor className="h-4 w-4 text-muted-foreground" />
                            System {session.systemNumber}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(session.startTime).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-3">{session.duration} min</td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEndSession(session.id, session.systemNumber)}
                          >
                            End Session
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
