"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Quiz from "@/components/quiz";
import Flashcards from "@/components/flashcards";
import Matching from "@/components/matching";
import Test from "@/components/test";
import { toast } from "sonner";
import { useLearningStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function LearningModePage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const pdfContent = useLearningStore((state) => state.pdfContent);
  const clearPDF = useLearningStore((state) => state.clearPDF);

  const handleClearPDF = () => {
    clearPDF();
    router.push("/");
  };

  useEffect(() => {
    const generateContent = async () => {
      if (!pdfContent) {
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: [{ data: pdfContent }],
            type: params.mode,
          }),
        });

        if (!response.ok) throw new Error("Failed to generate content");
        const data = await response.json();
        setContent(data);
      } catch (error) {
        toast.error("Error generating content");
      } finally {
        setIsLoading(false);
      }
    };

    generateContent();
  }, [params.mode, pdfContent, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Failed to load content</h2>
          <Button onClick={handleClearPDF}>Try Another PDF</Button>
        </div>
      </div>
    );
  }

  switch (params.mode) {
    case "quiz":
      return (
        <Quiz questions={content} clearPDF={handleClearPDF} title="Quiz" />
      );
    case "flashcards":
      return <Flashcards cards={content} clearPDF={handleClearPDF} />;
    case "matching":
      return (
        <Matching pairs={content?.pairs || []} clearPDF={handleClearPDF} />
      );
    case "test":
      return <Test questions={content} clearPDF={handleClearPDF} />;
    default:
      return null;
  }
}
