import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/landing/PricingSection";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const Pricing = () => {
  const faqs = [
    {
      question: "Can I try MakeMe for free?",
      answer: "Yes! Our Free plan lets you create 1 resume with basic templates and 3 AI rewrites per month. No credit card required.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept bKash, Nagad, Rocket, and all major credit/debit cards including Visa and Mastercard.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely! You can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period.",
    },
    {
      question: "What's the difference between Pro and Lifetime?",
      answer: "Pro is a monthly subscription at ৳499/month. Lifetime is a one-time payment of ৳2,999 that gives you permanent access to all Pro features.",
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 7-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: "Are the resumes really ATS-optimized?",
      answer: "Yes! All our templates are designed to pass Applicant Tracking Systems. We regularly test them against popular ATS software used by employers in Bangladesh and globally.",
    },
    {
      question: "Can I export my resume in different formats?",
      answer: "Free users can export with a watermark in PDF format. Pro and Lifetime users can export in both PDF and DOCX formats without any watermark.",
    },
    {
      question: "Do you offer discounts for students?",
      answer: "Yes! Students with a valid .edu email address get 20% off on all paid plans. Contact us with your student email to get your discount code.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16">
        <PricingSection />

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-baby-pink-600/30 border border-baby-pink-400/30 mb-6">
                <HelpCircle className="w-4 h-4 text-baby-pink-300" />
                <span className="text-sm font-medium text-baby-pink-100">FAQ</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Got questions? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6"
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

export default Pricing;
