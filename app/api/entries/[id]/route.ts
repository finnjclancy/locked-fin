import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import { NextRequest } from 'next/server';

type RouteContext = {
  params: {
    id: string;
  }
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const id = params.id;
  
  try {
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + '/entries.json', 'utf8');
    const entries = JSON.parse(fileContents);
    
    const entry = entries.find((entry: any) => entry.id === id);
    
    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(entry);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  const id = params.id;
  
  try {
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + '/entries.json', 'utf8');
    const entries = JSON.parse(fileContents);
    
    const entryIndex = entries.findIndex((entry: any) => entry.id === id);
    
    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    // Remove the entry from the array
    entries.splice(entryIndex, 1);
    
    // Save the updated entries back to the file
    await fs.writeFile(
      jsonDirectory + '/entries.json',
      JSON.stringify(entries, null, 2)
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  const id = params.id;
  
  try {
    const jsonDirectory = path.join(process.cwd(), 'app/data');
    const fileContents = await fs.readFile(jsonDirectory + '/entries.json', 'utf8');
    const entries = JSON.parse(fileContents);
    
    const entryIndex = entries.findIndex((entry: any) => entry.id === id);
    
    if (entryIndex === -1) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }
    
    const { title, content } = await request.json();
    
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }
    
    // Update the entry
    entries[entryIndex] = {
      ...entries[entryIndex],
      title,
      content,
      updatedAt: new Date().toISOString()
    };
    
    // Save the updated entries back to the file
    await fs.writeFile(
      jsonDirectory + '/entries.json',
      JSON.stringify(entries, null, 2)
    );
    
    return NextResponse.json(entries[entryIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 500 }
    );
  }
} 