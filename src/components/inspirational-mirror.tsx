
"use client";

import { analyzeUserSentiment } from "@/ai/flows/analyze-user-sentiment";
import { analyzeFacialExpression } from "@/ai/flows/analyze-facial-expression";
import { getYoutubeVideo } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Camera,
  Frown,
  Link2,
  Loader2,
  Meh,
  PenLine,
  RotateCw,
  Smile,
  Sparkles,
  Video,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Mirror } from "./icons";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type AppState = "idle" | "loading" | "error" | "result";
type Emotion = "happy" | "sad" | "thoughtful";

type VideoResult = {
  title: string;
  url: string;
};

const emotionIcons: Record<Emotion, React.ReactNode> = {
  happy: <Smile className="h-10 w-10 text-green-500" />,
  sad: <Frown className="h-10 w-10 text-blue-500" />,
  thoughtful: <Meh className="h-10 w-10 text-purple-500" />,
};

export default function InspirationalMirror() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [textInput, setTextInput] = useState("");
  const [detectedEmotion, setDetectedEmotion] = useState<Emotion | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Camera state
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { toast } = useToast();

  const mapSentimentToEmotion = (sentiment: string): Emotion => {
    switch (sentiment.toLowerCase()) {
      case "positive": return "happy";
      case "negative": return "sad";
      default: return "thoughtful";
    }
  };

  const mapExpressionToEmotion = (expression: string): Emotion => {
    const lowerExpr = expression.toLowerCase();
    if (["happy", "surprise"].includes(lowerExpr)) return "happy";
    if (["sad", "fear", "disgust"].includes(lowerExpr)) return "sad";
    return "thoughtful";
  };
  
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraEnabled(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setAppState("idle");
    setTextInput("");
    setDetectedEmotion(null);
    setVideoResult(null);
    setError(null);
    setCapturedImage(null);
    stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast({ title: "Input required", description: "Please tell us how you feel.", variant: "destructive" });
      return;
    }
    setAppState("loading");
    try {
      const sentimentResult = await analyzeUserSentiment({ text: textInput });
      const emotion = mapSentimentToEmotion(sentimentResult.sentiment);
      setDetectedEmotion(emotion);
      const video = await getYoutubeVideo(emotion);
      setVideoResult(video);
      setAppState("result");
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setAppState("error");
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
    }
  };
  
  const handleEnableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraEnabled(true);
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
      setAppState("error");
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUri);
        stopCamera();
      }
    }
  };

  const handleFacialAnalysis = async () => {
    if (!capturedImage) {
        toast({ title: "Image required", description: "Please capture an image first.", variant: "destructive" });
        return;
    }
    setAppState("loading");
    try {
      const expressionResult = await analyzeFacialExpression({ photoDataUri: capturedImage });
      const emotion = mapExpressionToEmotion(expressionResult.dominantEmotion);
      setDetectedEmotion(emotion);
      const video = await getYoutubeVideo(emotion);
      setVideoResult(video);
      setAppState("result");
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        setAppState("error");
        toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const renderContent = () => {
    switch (appState) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 p-8 animate-fade-in">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Analyzing your mood...</p>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        );
      case "result":
        return (
          <div className="flex flex-col items-center justify-center space-y-6 p-4 text-center animate-fade-in">
            <div className="space-y-2">
              <p className="text-muted-foreground">We detected you're feeling</p>
              <div className="flex items-center gap-3">
                {detectedEmotion && emotionIcons[detectedEmotion]}
                <p className="text-3xl font-headline font-semibold capitalize text-primary">{detectedEmotion}</p>
              </div>
            </div>
            
            <Card className="w-full bg-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-accent"/> A little something for you</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{videoResult?.title}</p>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row gap-2">
                <Button asChild className="w-full sm:w-auto">
                  <Link href={videoResult?.url ?? '#'} target="_blank" rel="noopener noreferrer">
                    <Link2 className="mr-2 h-4 w-4" />
                    Watch Now
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                  <RotateCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      case "error":
        return (
            <div className="p-4 animate-fade-in space-y-4">
                <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertTitle>An Error Occurred</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={handleReset} className="w-full">
                    <RotateCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            </div>
        );
      case "idle":
      default:
        return (
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">
                <PenLine className="mr-2 h-4 w-4" /> Write it down
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Camera className="mr-2 h-4 w-4" /> Show your face
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="p-1">
                <div className="space-y-4">
                    <Textarea
                        placeholder="Tell me how you're feeling today..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[120px] text-base"
                        aria-label="Your feelings"
                    />
                    <Button onClick={handleTextAnalysis} className="w-full" size="lg">
                        <Sparkles className="mr-2 h-5 w-5"/> Analyze my mood
                    </Button>
                </div>
            </TabsContent>
            <TabsContent value="camera" className="p-1">
                <div className="space-y-4">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                        {capturedImage ? (
                          <img src={capturedImage} alt="Captured expression" className="h-full w-full object-cover" />
                        ) : isCameraEnabled ? (
                          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover transform -scale-x-100"></video>
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <Video className="h-16 w-16" />
                            <p>Camera is off</p>
                          </div>
                        )}
                        <canvas ref={canvasRef} className="hidden"></canvas>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {!isCameraEnabled && !capturedImage && (
                          <Button onClick={handleEnableCamera} variant="secondary" className="w-full col-span-1 sm:col-span-2">Enable Camera</Button>
                        )}
                        {isCameraEnabled && !capturedImage && (
                          <Button onClick={handleCapture} className="w-full col-span-1 sm:col-span-2">Take Picture</Button>
                        )}
                        {capturedImage && (
                          <>
                           <Button onClick={() => setCapturedImage(null)} variant="secondary">Retake</Button>
                           <Button onClick={handleFacialAnalysis}><Sparkles className="mr-2 h-4 w-4"/>Analyze Expression</Button>
                          </>
                        )}
                    </div>
                </div>
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <Card className={cn(
        "w-full max-w-lg shadow-2xl shadow-primary/10 transition-all duration-500",
        appState === 'result' && 'max-w-xl'
      )}>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3">
          <Mirror className="h-8 w-8 text-primary" />
          <CardTitle className="font-headline text-4xl">Inspirational Mirror</CardTitle>
        </div>
        <CardDescription className="text-base pt-2">
          Find inspirational content that reflects your current state of mind.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
