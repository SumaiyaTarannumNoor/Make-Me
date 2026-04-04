import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Crown, Send, CheckCircle, Smartphone, ArrowRight } from "lucide-react";

const BKASH_NUMBER = "01755945946";
const REQUIRED_AMOUNT = 100;

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<"pay" | "txid" | "done">("pay");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAmountSubmit = () => {
    if (Number(amount) !== REQUIRED_AMOUNT) {
      toast({
        title: "Invalid amount",
        description: `Please send exactly ৳${REQUIRED_AMOUNT} via bKash.`,
        variant: "destructive",
      });
      return;
    }
    setStep("txid");
  };

  const handleTransactionSubmit = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter your bKash transaction ID.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Save transaction ID to profile
      const { error } = await supabase
        .from("profiles")
        .update({ bkash_transaction_id: transactionId.trim() })
        .eq("user_id", user?.id);

      if (error) throw error;

      // Notify admin via edge function
      await supabase.functions.invoke("notify-payment", {
        body: {
          userEmail: user?.email,
          transactionId: transactionId.trim(),
        },
      });

      setStep("done");
      toast({
        title: "Payment submitted!",
        description: "Your transaction ID has been recorded. An admin will verify and activate your premium account shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Upgrade</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Upgrade to Premium
            </h1>
            <p className="text-muted-foreground">
              Unlock all premium templates and features
            </p>
          </div>

          {step === "pay" && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  Step 1: Send Payment via bKash
                </CardTitle>
                <CardDescription>
                  Send exactly <span className="font-bold text-foreground">৳{REQUIRED_AMOUNT}</span> to our bKash number using the "Send Money" option from your bKash app.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Enter the amount you sent (৳)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAmountSubmit}
                  disabled={!amount}
                >
                  I've Sent ৳{REQUIRED_AMOUNT} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "txid" && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Step 2: Enter Transaction ID
                </CardTitle>
                <CardDescription>
                  After sending the payment, you'll receive a bKash transaction ID (TxID). Enter it below for verification.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    bKash Transaction ID
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. TXN123ABC456"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="text-lg font-mono"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleTransactionSubmit}
                  disabled={submitting || !transactionId.trim()}
                >
                  {submitting ? "Submitting..." : "Submit Transaction ID"}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "done" && (
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="pt-6 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h2 className="text-xl font-bold text-foreground">Payment Submitted!</h2>
                <p className="text-muted-foreground">
                  Your transaction ID <span className="font-mono font-bold text-foreground">{transactionId}</span> has been recorded.
                  An admin will verify your payment and activate your premium account shortly.
                </p>
                <Button onClick={() => navigate("/dashboard")} variant="outline" className="mt-4">
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;
