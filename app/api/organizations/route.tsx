import { NextResponse } from 'next/server';
import {prisma} from '@/prisma/src/index'
export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(organizations);
    return NextResponse.json({
      data: organizations,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      {  error: 'Failed to fetch organizations' },
      { status: 500 }
    );
  }
}