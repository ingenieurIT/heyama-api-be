# 🎉 Heyama API Backend - Project Summary

## ✅ What Has Been Created

A complete NestJS backend API with:

### Core Features
- ✅ **RESTful API** with NestJS framework
- ✅ **MongoDB** integration for data persistence
- ✅ **MinIO** (S3-compatible) for image storage with **PUBLIC ACCESS**
- ✅ **Socket.IO** for real-time updates
- ✅ **CORS** enabled for frontend integration

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/objects` | Create object with image upload |
| GET | `/objects` | Get all objects |
| GET | `/objects/:id` | Get single object |
| DELETE | `/objects/:id` | Delete object (removes image from storage) |

### Real-time Events (WebSocket)
- `objectCreated` - Emitted when a new object is created
- `objectDeleted` - Emitted when an object is deleted

---

## 📁 Project Structure

```
heyama-api-be/
├── src/
│   ├── main.ts                     # Application entry point
│   ├── app.module.ts               # Main app module
│   ├── objects/                    # Objects feature module
│   │   ├── objects.controller.ts  # REST endpoints
│   │   ├── objects.service.ts     # Business logic
│   │   ├── objects.gateway.ts     # WebSocket events
│   │   ├── objects.module.ts      # Module definition
│   │   ├── dto/                    # Data transfer objects
│   │   │   ├── create-object.dto.ts
│   │   │   └── object-response.dto.ts
│   │   └── schemas/               # MongoDB schemas
│   │       └── object.schema.ts
│   └── storage/                   # MinIO storage module
│       ├── storage.service.ts     # Image upload/delete logic
│       └── storage.module.ts
├── docker-compose.yml             # MongoDB + MinIO services
├── package.json                   # Dependencies
├── .env                          # Environment configuration
├── README.md                     # Full documentation
├── QUICK_START.md               # Quick start guide
├── API_TESTING.md               # API testing guide
├── MINIO_SETUP.md              # MinIO setup details
├── setup.ps1                   # Windows setup script
└── setup.sh                   # Linux/Mac setup script
```

---

## 🚀 How to Start

### Option 1: Quick Start
```powershell
# In the heyama-api-be directory:
.\setup.ps1
```

### Option 2: Manual Start
```powershell
# 1. Start Docker services
docker-compose up -d

# 2. Install dependencies (already done)
npm install

# 3. Start the API
npm run start:dev
```

---

## 🌐 Service URLs

Once running:

| Service | URL | Description |
|---------|-----|-------------|
| **API** | http://localhost:3001 | Backend REST API |
| **WebSocket** | ws://localhost:3001 | Real-time updates |
| **MongoDB** | mongodb://localhost:27017 | Database |
| **MinIO Console** | http://localhost:9001 | Storage admin panel |
| **MinIO API** | http://localhost:9000 | Storage endpoint |

**MinIO Credentials:**
- Username: `minioadmin`
- Password: `minioadmin`

---

## 🖼️ Public Image Access

### Key Feature: No Authentication Required!

All uploaded images are **automatically public**:

```javascript
// Example uploaded image URL:
http://localhost:9000/heyama-objects/objects/abc-uuid-123.jpg

// Can be used directly in HTML/React:
<img src="http://localhost:9000/heyama-objects/objects/abc-uuid-123.jpg" />
```

The backend automatically:
1. Creates the `heyama-objects` bucket
2. Sets a public read policy
3. Returns publicly accessible URLs

---

## 💻 Using from Your Frontend

### Create Object with Image
```javascript
const formData = new FormData();
formData.append('title', 'My Object');
formData.append('description', 'Description here');
formData.append('image', imageFile);

const response = await fetch('http://localhost:3001/objects', {
  method: 'POST',
  body: formData,
});

const object = await response.json();
// object.imageUrl is ready to use!
```

### Get All Objects
```javascript
const response = await fetch('http://localhost:3001/objects');
const objects = await response.json();
```

### Real-time Updates
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('objectCreated', (newObject) => {
  // Update your UI in real-time
  console.log('New object:', newObject);
});

socket.on('objectDeleted', (deletedId) => {
  // Remove from UI
  console.log('Deleted:', deletedId);
});
```

---

## 🧪 Testing the API

### Quick Test with cURL

**Create an object:**
```powershell
curl.exe -X POST http://localhost:3001/objects `
  -F "title=Test Object" `
  -F "description=My first test" `
  -F "image=@C:\path\to\image.jpg"
```

**Get all objects:**
```powershell
curl http://localhost:3001/objects
```

**Delete an object:**
```powershell
curl -X DELETE http://localhost:3001/objects/{object-id}
```

See [API_TESTING.md](./API_TESTING.md) for more detailed testing examples.

---

## 🔧 Configuration

Environment variables in `.env`:

```env
PORT=3001                                      # API port
MONGODB_URI=mongodb://localhost:27017/heyama   # Database
MINIO_ENDPOINT=localhost                       # MinIO host
MINIO_PORT=9000                               # MinIO port
MINIO_ACCESS_KEY=minioadmin                   # MinIO username
MINIO_SECRET_KEY=minioadmin                   # MinIO password
MINIO_BUCKET_NAME=heyama-objects              # Bucket name
MINIO_PUBLIC_URL=http://localhost:9000        # Public URL prefix
```

---

## ⚠️ Important Notes

### 1. Public Images
- All images are publicly accessible (no auth needed)
- Anyone with the URL can view the image
- Perfect for development and demo purposes

### 2. Real-time Updates
- WebSocket connection is required for real-time features
- Connect from your frontend using Socket.IO client
- Events are broadcast to ALL connected clients

### 3. Docker Required
- MongoDB and MinIO run in Docker containers
- Make sure Docker Desktop is running
- Use `docker-compose up -d` to start services

### 4. File Upload
- Maximum file size: Configure in NestJS if needed
- Supported formats: All image types
- Files are stored with UUID names

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Complete documentation |
| [QUICK_START.md](./QUICK_START.md) | Get started in 3 steps |
| [API_TESTING.md](./API_TESTING.md) | How to test endpoints |
| [MINIO_SETUP.md](./MINIO_SETUP.md) | MinIO configuration details |

---

## 🐛 Troubleshooting

### Docker services not starting?
```powershell
docker-compose down
docker-compose up -d
```

### Port already in use?
Change `PORT` in `.env` file

### Images not loading?
1. Check MinIO is running: `docker ps`
2. Verify bucket is public: Check MinIO Console
3. Check image URL format

### MongoDB connection error?
```powershell
docker exec -it heyama-mongodb mongosh
```

---

## 🎯 Next Steps

1. **Start the services** (if not already running):
   ```powershell
   docker-compose up -d
   npm run start:dev
   ```

2. **Test the API** using the examples in [API_TESTING.md](./API_TESTING.md)

3. **Connect your frontend**:
   - Update API base URL to `http://localhost:3001`
   - Connect Socket.IO to `http://localhost:3001`
   - Use the object response `imageUrl` directly in `<img>` tags

4. **Monitor in real-time**:
   - Create objects from web app → See them appear in mobile app
   - Create objects from mobile app → See them in web app
   - All in real-time! 🚀

---

## 📊 API Response Format

### Object Response
```json
{
  "id": "65f1234567890abcdef12345",
  "title": "My Object",
  "description": "Object description",
  "imageUrl": "http://localhost:9000/heyama-objects/objects/uuid.jpg",
  "createdAt": "2026-02-23T10:30:00.000Z"
}
```

---

## ✨ Key Advantages

1. **Simple Setup** - One command to start everything
2. **Public Images** - No authentication complexity
3. **Real-time** - Instant updates across all clients
4. **Well Documented** - Multiple guides for different needs
5. **Production Ready** - Can be easily deployed to cloud

---

## 🚢 Production Deployment

For production, update `.env`:
```env
MINIO_ENDPOINT=your-minio.com
MINIO_USE_SSL=true
MINIO_PUBLIC_URL=https://your-minio.com
MONGODB_URI=mongodb+srv://...
```

---

That's it! Your backend is ready to power both your web and mobile applications. 🎉

For questions or issues, refer to the documentation files or check the code comments.
