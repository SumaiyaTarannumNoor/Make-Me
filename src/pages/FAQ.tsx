import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  const faqs = [
    { question: "Why MakeMe for my resume?", answer: "Because we provide premium service with minimum prices." },
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
      <main className="pt-24 pb-16">
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-violet-500/20 border border-royal-violet-500/30 mb-6">
                <HelpCircle className="w-4 h-4 text-aquamarine-400" />
                <span className="text-sm font-medium text-aquamarine-300">FAQ</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about MakeMe.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass border border-border/50 rounded-xl px-6"
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
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
