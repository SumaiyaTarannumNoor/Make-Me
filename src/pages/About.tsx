import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Linkedin } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            About <span className="text-gradient">MakeMe</span>
          </h1>
          <div className="glass rounded-2xl p-10 border border-border/50">
            <p className="text-lg text-muted-foreground leading-relaxed">
              This was created by{" "}
              <span className="font-semibold text-xl md:text-2xl text-gradient-creator">
                Sumaiya Tarannum Noor
              </span>
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              Connect on LinkedIn{" "}
              <a
                href="https://www.linkedin.com/in/sumaiyatarannumnoor"
                className="inline-flex items-center gap-2 font-semibold transition-colors duration-200 group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5 text-[#5a3fd0] group-hover:text-[#4361ee] transition-colors" />
                <span className="text-gradient-creator">LinkedIn</span>
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
