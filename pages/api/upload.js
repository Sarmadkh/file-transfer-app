// Simple in-memory storage
const fileStorage = {};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get files from the request
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Simple processing (for demo only - real apps should parse multipart properly)
    const fileId = Math.random().toString(36).substring(2, 15);
    const fileName = `file-${fileId}`;
    
    fileStorage[fileId] = {
      buffer: buffer,
      originalname: fileName,
      mimetype: 'application/octet-stream'
    };
    
    // Files expire after 1 hour
    setTimeout(() => {
      delete fileStorage[fileId];
    }, 3600000);
    
    res.status(200).json({ 
      links: [{
        id: fileId,
        name: fileName
      }] 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
