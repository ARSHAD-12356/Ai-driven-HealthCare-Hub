import { MongoClient, Db } from 'mongodb';

const uri: string = process.env.MONGODB_URI || '';

if (!uri) {
  console.error('MONGODB_URI is not set. Please add your Mongo URI to .env.local');
}

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000, // Increased timeout
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Initialize connection only if URI is available
if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      try {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
          // Clear the promise on error so it can be retried
          globalWithMongo._mongoClientPromise = undefined;
          throw err;
        });
      } catch (err) {
        console.error('Failed to create MongoDB client:', err);
        throw err;
      }
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    try {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    } catch (err) {
      console.error('Failed to create MongoDB client:', err);
      throw err;
    }
  }
} else {
  // Create a rejected promise if URI is not set
  clientPromise = Promise.reject(new Error('MongoDB URI is not configured'));
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  // Re-read URI from environment in case it was updated
  const currentUri = process.env.MONGODB_URI || '';
  
  if (!currentUri) {
    throw new Error('MongoDB URI is not configured. Please set MONGODB_URI in .env.local and restart the server.');
  }

  try {
    // Wait for client connection
    const client = await clientPromise;
    
    // Verify client is connected
    if (!client) {
      throw new Error('MongoDB client is not initialized');
    }
    
    // Extract database name from URI or use default
    // URI format: mongodb+srv://user:pass@cluster/dbname?options
    const dbNameMatch = currentUri.match(/\/\/(?:[^@]+@)?[^/]+\/([^?]+)/);
    const dbName = dbNameMatch?.[1] || 'rural_healthcare';
    const db = client.db(dbName);
    
    // Test the connection with a simple operation (without admin ping which might fail)
    // Just return the db - the actual operation will test the connection
    return db;
  } catch (error: any) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errorResponse: error.errorResponse,
    });
    
    // Provide more specific error messages
    if (error.message?.includes('authentication failed') || error.code === 8000 || error.errorResponse?.code === 8000) {
      throw new Error('MongoDB authentication failed. Please verify: 1) Username and password in MongoDB Atlas Database Access, 2) User has correct privileges, 3) Connection string in .env.local matches Atlas. Get the connection string from Atlas Dashboard → Connect → Connect your application.');
    } else if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
      throw new Error('MongoDB connection timeout. Please check your network connection and firewall settings.');
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('getaddrinfo') || error.code === 'ENOTFOUND') {
      throw new Error('Cannot reach MongoDB server. Please check your network connection and cluster address.');
    } else if (error.message?.includes('MongoServerError')) {
      throw new Error(`MongoDB server error: ${error.message}`);
    } else {
      throw new Error(`MongoDB connection failed: ${error.message || 'Unknown error'}. Please check your .env.local file and restart the server.`);
    }
  }
}

