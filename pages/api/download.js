// Share the same storage as upload.js
const fileStorage = {};

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'File ID is required' });
  }

  const fileData = fileStorage[id];
  if (!fileData) {
    return res.status(404).json({ message: 'File not found or expired' });
  }

  res.setHeader('Content-Type', fileData.mimetype);
  res.setHeader('Content-Disposition', `attachment; filename="${fileData.originalname}"`);
  res.send(fileData.buffer);
}
