
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Bot, Dna, HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 md:px-6 h-16 flex items-center">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">HealthWise AI</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline">
                The Future of Healthcare, Today.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                HealthWise AI leverages advanced artificial intelligence to provide real-time diagnostic insights,
                predictive analysis, and early condition detection.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Enter Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage?.imageUrl || "https://picsum.photos/seed/1/600/400"}
                width={600}
                height={400}
                alt="AI in Healthcare"
                data-ai-hint={heroImage?.imageHint || "medical technology"}
                className="w-full object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </div>
        </section>
        <section className="bg-muted/50 w-full py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Core Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a comprehensive suite of tools for modern healthcare diagnostics.
                </p>
              </div>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Dna className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Medical Image Analysis</h3>
                  <p className="text-muted-foreground">
                    Analyze X-rays, MRIs, and more with our AI to detect anomalies and potential health issues.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <HeartPulse className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Predictive Diagnostics</h3>
                  <p className="text-muted-foreground">
                    Utilize machine learning to forecast potential health conditions from EHR and monitoring data.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Early Diagnosis</h3>
                  <p className="text-muted-foreground">
                    Combine all data points for a comprehensive early diagnosis and risk assessment.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 md:px-6 flex justify-center items-center">
            <p className="text-sm text-muted-foreground">&copy; 2024 HealthWise AI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
