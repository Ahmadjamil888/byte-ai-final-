import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { UserProject } from '@/types/subscription';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const projects = (user.privateMetadata?.projects as UserProject[]) || [];

    // Sort by updatedAt descending (most recent first)
    const sortedProjects = projects.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({ projects: sortedProjects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, sandboxId, url, planUsed } = await req.json();

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const projects = (user.privateMetadata?.projects as UserProject[]) || [];

    const newProject: UserProject = {
      id: `project_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      name,
      description,
      sandboxId,
      url,
      createdAt: new Date(),
      updatedAt: new Date(),
      planUsed: planUsed || 'free',
      isActive: true
    };

    projects.push(newProject);

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        projects
      }
    });

    return NextResponse.json({ project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}