import { Monitor } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <span className="font-semibold">SLAMS</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Smart Lab Access & Monitoring System © {new Date().getFullYear()}
          </p>
          <p className="text-sm text-muted-foreground">
            Built for Tech Expo
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
