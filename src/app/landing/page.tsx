
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Bot, Dna, HeartPulse, ScanSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { ChatWidget } from "@/components/chat-widget";

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-1");

  const features = [
    {
      icon: <ScanSearch className="h-10 w-10 text-primary" />,
      title: "Medical Image Analysis",
      description: "Analyze X-rays, MRIs, and more with our AI to detect anomalies and potential health issues.",
      link: "/dashboard/image-analysis",
    },
    {
      icon: <Dna className="h-10 w-10 text-primary" />,
      title: "Predictive Diagnostics",
      description: "Utilize machine learning to forecast potential health conditions from EHR and monitoring data.",
      link: "/dashboard/predictive-assessment",
    },
    {
      icon: <HeartPulse className="h-10 w-10 text-primary" />,
      title: "Early Diagnosis",
      description: "Combine all data points for a comprehensive early diagnosis and risk assessment.",
      link: "/dashboard/early-diagnosis",
    },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };


  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-border/40">
        <Link href="#" className="flex items-center justify-center gap-2" prefetch={false}>
          <Bot className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">HealthWise AI</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
           <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/dashboard" prefetch={false}>
              Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              Login
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-6">
                <motion.div 
                  className="space-y-4"
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                >
                   <motion.div variants={itemVariants} className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-primary-foreground">
                    AI-Powered Healthcare
                  </motion.div>
                  <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    The Future of Diagnostic Intelligence
                  </motion.h1>
                  <motion.p variants={itemVariants} className="max-w-[600px] text-muted-foreground md:text-xl">
                    HealthWise AI leverages advanced artificial intelligence to provide real-time diagnostic insights,
                    predictive analysis, and early condition detection.
                  </motion.p>
                </motion.div>
                <motion.div 
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.6}}
                >
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                   <Button asChild size="lg" variant="outline">
                    <Link href="#features">
                      Learn More
                    </Link>
                  </Button>
                </motion.div>
              </div>
              <div className="relative group">
                <motion.div 
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-lg blur-xl opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                />
                <Image
                  src={heroImage?.imageUrl || "https://picsum.photos/seed/1/600/400"}
                  width="550"
                  height="550"
                  alt="AI in Healthcare"
                  data-ai-hint={heroImage?.imageHint || "medical technology"}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </div>
        </section>
        
        <motion.section 
          id="features" 
          className="w-full py-20 md:py-32 lg:py-40 bg-muted/40"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <motion.div variants={itemVariants} className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-primary-foreground">Core Features</motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl font-bold tracking-tighter sm:text-5xl">A Comprehensive Suite of Tools</motion.h2>
              <motion.p variants={itemVariants} className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides a comprehensive suite of tools for modern healthcare diagnostics.
              </motion.p>
            </div>
            <motion.div 
              className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3"
              variants={sectionVariants}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full">
                    <CardHeader className="items-center">
                      <motion.div
                        className="bg-primary/10 p-4 rounded-full mb-4"
                        variants={iconVariants}
                        animate="pulse"
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/40">
        <p className="text-xs text-muted-foreground">&copy; 2024 HealthWise AI. All Rights Reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
      <ChatWidget />
    </div>
  );
}
