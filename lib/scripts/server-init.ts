/**
 * Server Initialization Script
 * 
 * This file contains initialization code that runs when the server starts.
 * Import and call these functions in your app initialization.
 */

import { initializeAdmin } from './init-admin';

/**
 * Initialize server on startup
 * Call this function when your Next.js app starts
 */
export async function initializeServer(): Promise<void> {
  console.log('🚀 Initializing server...');
  
  // Initialize admin user
  await initializeAdmin();
  
  console.log('✅ Server initialization complete');
}

/**
 * For Next.js App Router, you can call this in a server component or API route
 * Example: Create a route handler at /api/init that calls this
 */
export async function handleServerInit(): Promise<Response> {
  try {
    await initializeServer();
    return new Response(JSON.stringify({ message: 'Server initialized successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    return new Response(JSON.stringify({ error: 'Server initialization failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

