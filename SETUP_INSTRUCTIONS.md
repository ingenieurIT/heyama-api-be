# 🚀 Final Setup & Start Instructions

## ✅ What's Already Done

1. ✅ Project structure created
2. ✅ All dependencies installed (`npm install`)
3. ✅ Code compiled successfully (`npm run build`)
4. ⏳ Docker images downloading (MongoDB and MinIO)

---

## 🎯 To Start the Backend

### Step 1: Wait for Docker Images (First Time Only)

If the Docker images are still downloading, you can check progress:

```powershell
docker images | Select-String -Pattern "mongo|minio"
```

You should see:
- `mongo:latest`
- `minio/minio:latest`

### Step 2: Start Docker Services

```powershell
cd "c:\Users\ivan\Documents\projects\test\New folder\heyama-api-be"
docker-compose up -d
```

Wait ~10 seconds for services to start, then verify:

```powershell
docker-compose ps
```

You should see:
- `heyama-mongodb` - Running on port 27017
- `heyama-minio` - Running on ports 9000, 9001

### Step 3: Start the Backend API

```powershell
npm run start:dev
```

You should see:
```
Application is running on: http://localhost:3001
Bucket heyama-objects created successfully
Bucket heyama-objects is now public
```

---

## 🧪 Quick Test

Once the backend is running, test it in a **new PowerShell window**:

```powershell
# Test API health
curl http://localhost:3001/objects

# Should return: []
```

### Test with an Image Upload

```powershell
# Replace path with your actual image file
curl.exe -X POST http://localhost:3001/objects `
  -F "title=Test Object" `
  -F "description=My first test" `
  -F "image=@C:\Users\ivan\Pictures\test.jpg"
```

You should get a response like:
```json
{
  "id": "...",
  "title": "Test Object",
  "description": "My first test",
  "imageUrl": "http://localhost:9000/heyama-objects/objects/uuid.jpg",
  "createdAt": "2026-02-23T..."
}
```

**Copy the `imageUrl` and paste it in your browser - the image should load!**

---

## 🌐 Connect Your Frontend

### Update Your Frontend Configuration

In your `heyama-web-fe` or mobile app, update the API URL:

```typescript
// In your API config file
const API_BASE_URL = 'http://localhost:3001';
const SOCKET_URL = 'http://localhost:3001';
```

### Using the API

```typescript
// Create object
const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
formData.append('image', imageFile);

const response = await fetch(`${API_BASE_URL}/objects`, {
  method: 'POST',
  body: formData,
});

const object = await response.json();
```

### Real-time Updates

```typescript
import io from 'socket.io-client';

const socket = io(SOCKET_URL);

socket.on('connect', () => {
  console.log('Connected to backend');
});

socket.on('objectCreated', (object) => {
  // Add to your state/list
  setObjects(prev => [object, ...prev]);
});

socket.on('objectDeleted', (id) => {
  // Remove from your state/list
  setObjects(prev => prev.filter(obj => obj.id !== id));
});
```

---

## 📱 Ports Being Used

Make sure these ports are available:

| Port | Service | Purpose |
|------|---------|---------|
| 3001 | Backend API | Your new API server |
| 9000 | MinIO API | Image storage |
| 9001 | MinIO Console | Admin interface |
| 27017 | MongoDB | Database |

**Note:** Your existing `heyama-be` uses port 3000, so this new API uses 3001 to avoid conflicts.

---

## 🔄 Switching Between Backends

You now have TWO backends:

### heyama-be (Original)
- Port: 3000
- Location: `c:\Users\ivan\Documents\projects\test\New folder\heyama-be`

### heyama-api-be (New - Public Images)
- Port: 3001
- Location: `c:\Users\ivan\Documents\projects\test\New folder\heyama-api-be`

**To use the new backend with public images:**
1. Update frontend API URL from `http://localhost:3000` to `http://localhost:3001`
2. Make sure both use different MinIO buckets (already configured)

---

## 🐛 If Something Goes Wrong

### Docker containers won't start?
```powershell
docker-compose down
docker-compose up -d
docker-compose logs
```

### Port 3001 already in use?
Change in `.env`:
```env
PORT=3002
```

### Backend won't start?
```powershell
# Check for errors
npm run start:dev

# If you see MinIO errors, check Docker:
docker-compose ps
```

### Images still downloading?
```powershell
# Check progress
docker images

# If stuck, cancel and try again:
docker-compose down
docker-compose up -d
```

---

## 📋 Complete Start Sequence

Copy and paste this entire block:

```powershell
# Navigate to project
cd "c:\Users\ivan\Documents\projects\test\New folder\heyama-api-be"

# Start Docker services
docker-compose up -d

# Wait for services
Start-Sleep -Seconds 10

# Check services are running
docker-compose ps

# Start the backend
npm run start:dev
```

---

## ✨ What Makes This Backend Special

1. **Public Image Access** - No authentication needed for images
2. **Automatic Setup** - Bucket creation and public policy applied automatically
3. **Real-time Updates** - WebSocket events for instant UI updates
4. **Clean Code** - Well-structured, documented, and maintainable
5. **Production Ready** - Easy to deploy with minimal configuration

---

## 📂 Files Created

```
heyama-api-be/
├── 📄 PROJECT_SUMMARY.md      ← Overview of everything
├── 📄 README.md               ← Complete documentation
├── 📄 QUICK_START.md          ← 3-step quick start
├── 📄 API_TESTING.md          ← How to test endpoints
├── 📄 MINIO_SETUP.md          ← MinIO public access details
├── 📄 SETUP_INSTRUCTIONS.md   ← This file
├── 🔧 .env                    ← Configuration
├── 🐳 docker-compose.yml      ← Docker services
├── 📦 package.json            ← Dependencies
└── src/                       ← Source code
```

---

## 🎉 You're All Set!

Once you complete the 3 steps above:

1. ✅ Backend running on http://localhost:3001
2. ✅ MinIO storing images with public access
3. ✅ MongoDB persisting data
4. ✅ WebSocket broadcasting real-time updates

Your frontend can now consume this API and display images without any authentication issues!

**Happy coding! 🚀**

---

## 💡 Pro Tips

1. **Keep both backends running** - They use different ports
2. **Check MinIO Console** - http://localhost:9001 to see uploaded images
3. **Use the new API** - It has public image access (what you requested)
4. **Monitor logs** - Keep the terminal open to see real-time activity

---

For detailed information, see:
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- [README.md](./README.md)
