import { questionSchema, flashcardSchema, matchingSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, type } = await req.json();
  const firstFile = files[0].data;

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
        "Create 10 flashcards with key terms and their definitions from the document...";
      schema = flashcardSchema;
      break;
    case "matching":
      systemPrompt =
        "Create matching pairs (8 pairs) of related concepts from the document...";
      schema = matchingSchema;
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
      ]),
      onFinish: ({ object }) => {
        if (!object) throw new Error("No response generated");
        generatedContent = object;
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    throw error;
  }
}
