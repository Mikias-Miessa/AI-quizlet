"use client";

import { useState, useEffect } from "react";
import { FileUp, Loader2 } from "lucide-react";
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
    // Clear PDF only on initial mount
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

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-white to-gray-50 flex justify-center items-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center space-y-3 pb-8">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Start Learning
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Upload your study material to begin
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
    </div>
  );
}
