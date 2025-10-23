import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { mockStudents, STORAGE_KEYS } from "@/lib/mockData";

const Login = () => {
  const [idCard, setIdCard] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      const student = mockStudents.find(
        (s) => s.idCard === idCard && s.password === password
      );

      if (student) {
        // Store current user
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(student));
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${student.name}!`,
        });
        
        navigate("/systems");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid ID card or password",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleScanCard = () => {
    // Simulate card scan - auto-fill with first student's credentials
    setIdCard(mockStudents[0].idCard);
    toast({
      title: "Card Scanned",
      description: "ID card detected. Please enter your password.",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/50">
        <Card className="w-full max-w-md p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Student Login</h1>
            <p className="text-muted-foreground mt-2">
              Access the lab system with your ID card
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="idCard">ID Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="idCard"
                  type="text"
                  placeholder="ST2024001"
                  value={idCard}
                  onChange={(e) => setIdCard(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleScanCard}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Scan ID Card
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs font-mono">ID: ST2024001</p>
            <p className="text-xs font-mono">Password: password123</p>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
