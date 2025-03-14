"use client";

import { useState, useEffect } from "react";
import {
  FileUp,
  Loader2,
  Brain,
  Zap,
  Clock,
  Book,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLearningStore } from "@/lib/store";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setPDF = useLearningStore((state) => state.setPDF);
  const clearPDF = useLearningStore((state) => state.clearPDF);

  useEffect(() => {
    const shouldClear = sessionStorage.getItem("shouldClearPDF");
    if (!shouldClear) {
      clearPDF();
      sessionStorage.setItem("shouldClearPDF", "true");
    }
  }, [clearPDF]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile?.type !== "application/pdf" ||
      selectedFile?.size > 5 * 1024 * 1024
    ) {
      toast.error("Only PDF files under 5MB are allowed.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64File = reader.result as string;
        setPDF(base64File, file.name);
        sessionStorage.removeItem("shouldClearPDF");
        router.push("/learn");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: "AI-Powered Learning",
      description:
        "Our advanced AI analyzes your content and creates personalized learning materials",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Quick Generation",
      description: "Get study materials in seconds, not hours",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      title: "Learn Faster",
      description: "Optimize your study time with our proven learning methods",
    },
  ];

  const steps = [
    {
      icon: <FileUp className="h-6 w-6" />,
      title: "Upload Your PDF",
      description: "Start by uploading any educational PDF (max 5MB)",
    },
    {
      icon: <Book className="h-6 w-6" />,
      title: "Choose Learning Mode",
      description: "Select from quiz, flashcards, or matching exercises",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Start Learning",
      description: "Begin your personalized learning journey",
    },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Study Material Into
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              {" "}
              Interactive Learning
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your study material and let our AI create personalized
            learning experiences that help you master any subject efficiently.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="w-full max-w-md mx-auto border-0 shadow-xl mb-20">
          <CardHeader className="text-center space-y-3 pb-8">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Start Learning Now
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Upload your PDF to begin your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center
                  transition-all duration-300 ease-in-out
                  ${
                    file
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="p-4 bg-white rounded-full shadow-md">
                    <FileUp
                      className={`h-8 w-8 ${
                        file ? "text-blue-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">
                      {file ? file.name : "Drop your PDF here"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {file ? "File selected" : "or click to browse"}
                    </p>
                  </div>
                </label>
              </div>
              <Button
                type="submit"
                className={`w-full h-12 text-base font-medium transition-all duration-300
                  ${
                    !file || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-[1.02]"
                  }
                `}
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Start Learning"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
