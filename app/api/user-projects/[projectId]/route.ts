import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { UserProject } from '@/types/subscription';

export async function PUT(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, sandboxId, url, isActive } = await req.json();
    const projectId = params.projectId;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const projects = (user.privateMetadata?.projects as UserProject[]) || [];

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects[projectIndex] = {
      ...projects[projectIndex],
      ...(name && { name }),
      ...(description && { description }),
      ...(sandboxId && { sandboxId }),
      ...(url && { url }),
      ...(typeof isActive === 'boolean' && { isActive }),
      updatedAt: new Date()
    };

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        projects
      }
    });

    return NextResponse.json({ project: projects[projectIndex] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projectId = params.projectId;

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const projects = (user.privateMetadata?.projects as UserProject[]) || [];

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    projects.splice(projectIndex, 1);

    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        ...user.privateMetadata,
        projects
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}