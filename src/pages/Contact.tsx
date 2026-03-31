import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Office",
      lines: ["Block-B, Bashundhara RA", "Dhaka-1229, Bangladesh"],
      color: "text-royal-violet-600",
      bg: "bg-royal-violet-500/15",
    },
    {
      icon: Phone,
      title: "Phone",
      lines: ["02-55668200", "Saturday–Thursday, 9 AM–5 PM"],
      color: "text-aquamarine-500",
      bg: "bg-aquamarine-500/15",
    },
    {
      icon: Mail,
      title: "Email",
      lines: ["sumaiya.tarannum@northsouth.edu", "We respond within 24 hours"],
      color: "text-turquoise-500",
      bg: "bg-turquoise-500/15",
    },
    {
      icon: Clock,
      title: "Working Hours",
      lines: ["Saturday – Thursday", "9:00 AM – 5:00 PM BST"],
      color: "text-pearl-aqua-500",
      bg: "bg-pearl-aqua-500/15",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-royal-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-aquamarine-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-turquoise-500/8 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question or need help? We'd love to hear from you. Send us
              a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="glass rounded-2xl p-6 border border-border/50 hover:border-border transition-colors group"
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.bg} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Form + Map Section */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="glass rounded-2xl p-8 md:p-10 border border-border/50">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Send us a Message
              </h2>
              <p className="text-muted-foreground text-sm mb-8">
                Fill out the form below and we'll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name
                    </label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="bg-background/50 border-border/50 focus:border-aquamarine-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="bg-background/50 border-border/50 focus:border-aquamarine-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Subject
                  </label>
                  <Input
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    required
                    className="bg-background/50 border-border/50 focus:border-aquamarine-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <Textarea
                    placeholder="Write your message here..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="bg-background/50 border-border/50 focus:border-aquamarine-500 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map / Illustration Side */}
            <div className="flex flex-col gap-6">
              {/* Embedded Map */}
              <div className="glass rounded-2xl border border-border/50 overflow-hidden flex-1 min-h-[300px]">
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.254638879066!2d90.4252073!3d23.8103074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103180c3%3A0xb295ee331bcf5e13!2sBashundhara%20R%2FA!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "300px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Quick note card */}
              <div className="glass rounded-2xl p-6 border border-border/50">
                <h3 className="font-display font-semibold text-foreground mb-2">
                  Prefer social media?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You can also reach us on LinkedIn for professional inquiries
                  and updates.
                </p>
                <a
                  href="https://www.linkedin.com/in/sumaiyatarannumnoor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-aquamarine-500 hover:text-aquamarine-400 transition-colors"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
