// File: app/api/ask/route.js
import { NextResponse } from 'next/server';
import { join } from 'path';
import * as fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { message: 'No question provided' },
        { status: 400 }
      );
    }

    // Check if PDF exists
    const pdfPath = join(process.cwd(), 'uploads', 'uploaded_pdf.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      return NextResponse.json(
        { message: 'No PDF has been uploaded yet' },
        { status: 400 }
      );
    }
    
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Get the model - Gemini can process PDFs directly
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Create a file part from the PDF
    const pdfData = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfData.toString('base64');
    
    // Create parts for the prompt
    const parts = [
      {
        text: `Answer the following question based on the PDF document: ${question}\n\nIf the information is not in the document, please state that.`
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      }
    ];

    // Generate response from Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('Error processing question:', error);
    return NextResponse.json(
      { message: 'Error processing question: ' + error.message },
      { status: 500 }
    );
  }
}