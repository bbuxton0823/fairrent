import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the authentication cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    // Remove the auth cookie
    response.cookies.delete('auth-token');
    
    return response;
  } catch (_) {
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
} 