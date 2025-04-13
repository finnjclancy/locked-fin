import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + '/entries.json', 'utf8');
    const entries = JSON.parse(fileContents);
    
    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + '/entries.json', 'utf8');
    const entries = JSON.parse(fileContents);
    
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString(),
    };
    
    entries.push(newEntry);
    
    await fs.writeFile(
      jsonDirectory + '/entries.json',
      JSON.stringify(entries, null, 2)
    );
    
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
} 