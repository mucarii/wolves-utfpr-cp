import { Storage } from '@google-cloud/storage'

const storage = new Storage({ projectId: 'wolves-utfpr-cp' })

await storage.bucket('wolves-utfpr-cp.firebasestorage.app').setCorsConfiguration([
  {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://wolves-gamma.vercel.app'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    maxAgeSeconds: 3600,
    responseHeader: ['Content-Type', 'Authorization'],
  },
])

console.log('CORS configurado com sucesso!')
