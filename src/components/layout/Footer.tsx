import { Link } from "react-router-dom";
import { FileText, Sparkles, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    product: [
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "AI Features", href: "/features" },
      { label: "Export Options", href: "/export" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
    resources: [
      { label: "Resume Guide", href: "/guide" },
      { label: "Examples", href: "/examples" },
      { label: "FAQ", href: "/faq" },
      { label: "Help Center", href: "/help" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-muted/30 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl gradient-button flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-baby-pink" />
              </div>
              <span className="font-display font-bold text-xl">
                Make<span className="text-gradient">Me</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-xs">
              Create stunning, ATS-optimized resumes in minutes with AI-powered assistance. Perfect for students and professionals.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@makeme.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MakeMe. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ in Bangladesh 🇧🇩
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
