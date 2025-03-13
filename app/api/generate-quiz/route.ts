import {
  questionSchema,
  questionsSchema,
  flashcardSchema,
  matchingSchema,
  testQuestionSchema,
} from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, type, testType } = await req.json();
  const firstFile = files[0].data;

  console.log("\n🚀 Starting content generation:");
  console.log("📊 Type:", type);
  console.log("📝 Test type:", testType || "N/A");

  let systemPrompt = "";
  let schema;

  switch (type) {
    case "quiz":
      systemPrompt =
        "You are a teacher. Create a multiple choice test (with 4 questions) based on the content...";
      schema = questionSchema;
      break;
    case "flashcards":
      systemPrompt =
        "Create flashcards with key terms and their definitions from the document...";
      schema = flashcardSchema;
      break;
    case "matching":
      systemPrompt =
        "Create matching pairs of related concepts from the document...";
      schema = matchingSchema;
      break;
    case "test":
      systemPrompt = `Create a test with ${testType} questions based on the document...`;
      schema = testQuestionSchema;
      break;
  }

  try {
    let generatedContent: any = null;
    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: `Create a ${type} based on this document.` },
            { type: "file", data: firstFile, mimeType: "application/pdf" },
          ],
        },
      ],
      schema: z.union([
        z.array(questionSchema),
        z.array(flashcardSchema),
        matchingSchema,
        z.array(testQuestionSchema),
      ]),
      onFinish: ({ object }) => {
        if (!object) throw new Error("No response generated");
        generatedContent = object;
        console.log("\n✅ Generated content:");
        console.log(JSON.stringify(object, null, 2));
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("\n❌ Error generating content:", error);
    throw error;
  }
}
