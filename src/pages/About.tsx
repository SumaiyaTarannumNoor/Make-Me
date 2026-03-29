import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
              <span className="font-semibold text-aquamarine-400">
                Sumaiya Tarannum Noor
              </span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
