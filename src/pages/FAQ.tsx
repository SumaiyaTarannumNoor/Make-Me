import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, Sparkles } from "lucide-react";

const FAQ = () => {
  const faqs = [
    { question: "Why MakeMe for my resume?", answer: "Because we provide premium service with minimum prices. Our platform is built specifically for job seekers who want professional results without breaking the bank." },
    { question: "Is MakeMe free to use?", answer: "Yes! You can create up to 6 resumes completely free. No credit card required." },
    { question: "What templates are available?", answer: "We offer a variety of professionally designed templates for students, freshers, and experienced professionals. Premium templates are available with our paid plans." },
    { question: "Can I export my resume as PDF?", answer: "Absolutely! All plans support PDF export. Pro and Yearly users can also export in DOCX format without watermarks." },
    { question: "How many pages can my resume be?", answer: "Free users can create up to 2-page resumes. Pro users get up to 3 pages, and Yearly subscribers enjoy unlimited page options." },
    { question: "Do you offer student discounts?", answer: "Yes! Students with a valid .edu email address get 20% off on all paid plans. Contact us with your student email to get your discount code." },
    { question: "Can I cancel my subscription anytime?", answer: "Of course! You can cancel at any time and continue using your plan until the end of your billing period." },
    { question: "Is my data safe with MakeMe?", answer: "Your privacy is our priority. All data is encrypted and stored securely. We never share your information with third parties." },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-royal-violet-500/10 via-indigo-bloom-500/10 to-slate-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-aquamarine-500/10 via-turquoise-500/10 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fresh-sky-500/20 border border-fresh-sky-500/30 mb-6">
                <HelpCircle className="w-4 h-4 text-fresh-sky-500" />
                <span className="text-sm font-medium text-fresh-sky-700">Got Questions?</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Frequently Asked
                <span className="text-gradient block">Questions</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about MakeMe. Can't find the answer you're looking for? Feel free to reach out.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="relative max-w-3xl mx-auto text-center rounded-2xl p-12 bg-card border border-border overflow-hidden">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-royal-violet-500/5 via-transparent to-aquamarine-500/5" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-turquoise-500/20 border border-turquoise-500/30 mb-6">
                  <MessageCircle className="w-4 h-4 text-turquoise-500" />
                  <span className="text-sm font-medium text-turquoise-700">Still have questions?</span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Can't find what you're looking for?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                  Our team is happy to help. Reach out and we'll get back to you as soon as possible.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link to="/about">
                    <Button variant="hero" size="lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="hero-outline" size="lg">View Pricing</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
