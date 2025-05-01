// First, install the pdf-lib package
// npm install pdf-lib

// File: app/api/upload/route.js
import { writeFile, readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf');

    if (!file) {
      return NextResponse.json(
        { message: 'No PDF file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { message: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const filePath = join(uploadsDir, 'uploaded_pdf.pdf');
    await writeFile(filePath, buffer);

    // Extract text content from PDF using pdf-lib
    try {
      // Load PDF document
      const pdfDoc = await PDFDocument.load(buffer);
      const pageCount = pdfDoc.getPageCount();
      
      // For pdf-lib, we need a different approach to extract text
      // Since pdf-lib doesn't directly support text extraction, we'll store the PDF
      // and use its content directly in the API route
      
      const textPath = join(uploadsDir, 'pdf_content.txt');
      await writeFile(textPath, `PDF document with ${pageCount} pages. Text extraction will be performed during query processing.`);
      
      return NextResponse.json({
        message: 'PDF uploaded successfully',
        pageCount: pageCount,
      });
    } catch (pdfError) {
      console.error('Error parsing PDF:', pdfError);
      return NextResponse.json(
        { message: 'Error parsing PDF content: ' + pdfError.message },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { message: 'Error processing PDF: ' + error.message },
      { status: 500 }
    );
  }
}