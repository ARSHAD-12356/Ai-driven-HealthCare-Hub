# 🏥 Rural Healthcare Continuity Platform

> **A comprehensive digital health solution connecting rural communities with AI-powered health guidance and professional healthcare workers**

---

## 📊 Badges

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Gemini API](https://img.shields.io/badge/Gemini-2.0%20Flash-orange)

---

## 📋 Project Description

**Rural Healthcare Continuity Platform** is a modern, user-friendly digital health solution designed to bridge the healthcare gap in rural communities. The platform leverages **AI-powered health guidance** through Google's Gemini 2.0 Flash API and connects users with **verified healthcare professionals**.

### Core Objectives:
- 🎯 Provide accessible health consultation for rural populations
- 🤖 Offer AI-powered health guidance and symptom checking
- 👨‍⚕️ Connect patients with qualified healthcare workers
- 📊 Enable administrators to manage health workers and monitor health metrics
- 🌍 Support multiple languages including English and Indian regional languages
- 🔒 Maintain security and privacy of patient health records

---

## ✨ Key Features

### 👥 For Patients/Users
- ✅ **AI Health Assistant** - Real-time health guidance using Gemini 2.0 Flash
- ✅ **Multilingual Support** - English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Urdu, Kannada, Malayalam, Nepali
- ✅ **Chat-Based Consultation** - Interactive conversations with AI health assistant
- ✅ **Health Records** - View and manage personal health history
- ✅ **Remote Consultations** - Connect with verified health professionals
- ✅ **Symptom Checker** - Intelligent symptom analysis and guidance
- ✅ **Patient Feedback** - Provide feedback on consultations and services
- ✅ **Role-Based Authentication** - Secure login with role-based access

### 👨‍⚕️ For Health Workers
- ✅ **Professional Dashboard** - Manage assigned cases and patients
- ✅ **Application Portal** - Apply and get approved to work on the platform
- ✅ **Patient Management** - View and manage assigned patients
- ✅ **Consultation History** - Track all past consultations
- ✅ **Profile Management** - Update credentials and qualifications

### 🛡️ For Administrators
- ✅ **Health Worker Approvals** - Review and approve health worker applications
- ✅ **NMC Verification** - Quick access to verify doctor credentials (NMC Registry)
- ✅ **Dashboard Analytics** - Monitor platform health and metrics
- ✅ **Village Management** - Manage villages and coverage areas
- ✅ **Alert System** - Real-time alerts for critical cases
- ✅ **Worker Analytics** - Track health worker performance
- ✅ **System Overview** - Monitor total cases, consultations, and metrics

### 🔧 Platform Features
- ✅ **Real-time Chat** - Powered by Gemini API for instant responses
- ✅ **Multi-Device Support** - Responsive design for mobile and desktop
- ✅ **Dark/Light Theme** - Customizable appearance
- ✅ **Secure Authentication** - MongoDB-based user management
- ✅ **Error Handling** - Comprehensive error messages and recovery
- ✅ **Performance Optimized** - Fast load times with Next.js optimization

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 16.0.3 with App Router
- **UI Library:** React 19.2.0
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.x
- **Components:** shadcn/ui, Radix UI
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useRef, useEffect)
- **Form Management:** React Hook Form

### **Backend**
- **Runtime:** Node.js 18+
- **Server:** Next.js API Routes
- **Authentication:** Custom JWT-based auth
- **API Routes:** RESTful endpoints

### **Database**
- **Primary:** MongoDB Atlas
- **Collections:** Users, Health Workers, Chat History, Cases, Alerts

### **AI & APIs**
- **AI Model:** Google Gemini 2.0 Flash
- **API Integration:** REST-based API calls
- **Response Format:** JSON streaming

### **DevOps & Tools**
- **Package Manager:** npm / pnpm
- **Version Control:** Git & GitHub
- **Environment:** .env.local configuration
- **Build Tool:** Next.js Turbopack

### **Security**
- **Password Hashing:** bcryptjs
- **JWT Tokens:** For session management
- **Environment Variables:** Sensitive data protection
- **CORS:** Configured for secure requests

---

## 📁 Folder Structure

```
ai-health-continuity/
├── app/
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   ├── admin/
│   │   ├── init/page.tsx             # Admin setup
│   │   └── login/page.tsx            # Admin login
│   └── api/
│       ├── auth/                     # Authentication endpoints
│       ├── admin/                    # Admin endpoints
│       └── chat/                     # Chat API
│
├── components/
│   ├── auth/                         # Auth components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   ├── admin-login-form.tsx
│   │   └── role-selection.tsx
│   │
│   ├── chat/                         # Chat interface
│   │   ├── chat-interface.tsx
│   │   ├── language-selector.tsx
│   │   └── message-component.tsx
│   │
│   ├── dashboard/                    # Dashboard components
│   │   ├── admin-dashboard.tsx
│   │   ├── patient-dashboard.tsx
│   │   ├── health-worker-dashboard.tsx
│   │   └── dashboard.tsx
│   │
│   ├── consultation/
│   │   └── remote-consultation.tsx
│   │
│   ├── health-records/
│   │   └── health-records.tsx
│   │
│   ├── symptom-checker/
│   │   └── symptom-checker.tsx
│   │
│   ├── feedback/
│   │   └── patient-feedback.tsx
│   │
│   ├── theme/
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   │
│   └── ui/                           # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (50+ shadcn/ui components)
│
├── hooks/
│   ├── use-gemini-chat.ts            # Gemini API hook
│   ├── use-mobile.ts
│   ├── use-toast.ts
│   └── use-theme.ts
│
├── lib/
│   ├── mongodb.ts                    # MongoDB connection
│   ├── utils.ts                      # Utility functions
│   ├── models/
│   │   └── user.ts                   # User schema
│   └── scripts/
│       ├── init-admin.ts
│       └── server-init.ts
│
├── public/
│   └── assets/                       # Static files
│
├── scripts/
│   └── init-admin.js                 # Admin initialization script
│
├── styles/
│   └── globals.css                   # Global styles
│
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.mjs                   # Next.js config
├── tailwind.config.ts                # Tailwind config
├── postcss.config.mjs                # PostCSS config
└── README.md                         # This file
```

---

## 🔐 Environment Variables Setup

Create a `.env.local` file in the project root and add the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster0

# Admin Credentials (for initial setup)
ADMIN_EMAIL=admin@ruralhealthcare.com
ADMIN_PASSWORD=Admin@123456
ADMIN_FULL_NAME=Super Admin

# Google Gemini API
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Application Settings
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 📝 Environment Variables Reference

| Variable | Type | Description | Required |
|----------|------|-------------|----------|
| `MONGODB_URI` | String | MongoDB Atlas connection string | ✅ Yes |
| `GEMINI_API_KEY` | String | Google Gemini API key for AI | ✅ Yes |
| `ADMIN_EMAIL` | String | Initial admin email | ✅ Yes |
| `ADMIN_PASSWORD` | String | Initial admin password | ✅ Yes |
| `ADMIN_FULL_NAME` | String | Initial admin name | ✅ Yes |
| `NODE_ENV` | String | Environment (development/production) | ❌ No |
| `NEXT_PUBLIC_APP_URL` | String | Application URL | ❌ No |

---

## 📦 Installation Guide

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **MongoDB Atlas** account ([Create free](https://www.mongodb.com/cloud/atlas))
- **Google Gemini API** key ([Get free key](https://aistudio.google.com/app/apikey))
- **Git** installed

### Step 1: Clone the Repository
```bash
git clone https://github.com/It-iandeepak/ai-health-continuity.git
cd ai-health-continuity
```

### Step 2: Install Dependencies
```bash
npm install
# or
pnpm install
```

### Step 3: Setup Environment Variables
```bash
# Create .env.local file
cp .env.example .env.local

# Edit .env.local and add your credentials
nano .env.local
```

Add your MongoDB URI and Gemini API key.

### Step 4: Initialize Database & Admin
```bash
npm run init:admin
```

This will:
- Create the admin user in MongoDB
- Setup initial database collections
- Initialize the application

### Step 5: Verify Installation
```bash
npm run build
```

If build succeeds, you're ready to run!

---

## 🚀 Running the Project

### Development Mode
```bash
npm run dev
```

The application will start on:
- **Frontend:** http://localhost:3000
- **API Routes:** http://localhost:3000/api

### Production Build & Run
```bash
# Build the project
npm run build

# Start production server
npm run start
```

### Available Scripts
```bash
npm run dev           # Start development server with hot reload
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
npm run init:admin    # Initialize admin user
npm run type-check    # Run TypeScript type checking
```

---

## 🔌 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | ❌ No |
| POST | `/api/auth/login` | User login | ❌ No |
| POST | `/api/auth/health-workers` | Get health workers | ✅ Yes |
| GET | `/api/auth/health-workers?status=pending` | Get pending workers | ✅ Yes |
| POST | `/api/auth/health-workers/:id/approve` | Approve health worker | ✅ Yes |
| POST | `/api/auth/health-workers/:id/deny` | Deny health worker | ✅ Yes |

### Admin Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/admin/init` | Initialize admin | ❌ No |
| POST | `/api/admin/login` | Admin login | ❌ No |
| GET | `/api/admin/dashboard` | Get dashboard data | ✅ Yes |
| GET | `/api/admin/workers` | List all workers | ✅ Yes |
| PUT | `/api/admin/workers/:id` | Update worker | ✅ Yes |

### Chat Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Send message to AI | ✅ Yes |
| GET | `/api/chat/history` | Get chat history | ✅ Yes |
| DELETE | `/api/chat/:id` | Delete chat | ✅ Yes |

### Request/Response Examples

<details>
<summary><b>📤 User Login Request</b></summary>

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "patient",
    "token": "jwt_token_here"
  }
}
```
</details>

<details>
<summary><b>🤖 AI Chat Request</b></summary>

```bash
POST /api/chat
Content-Type: application/json
Authorization: Bearer {token}

{
  "message": "I have a headache and fever",
  "language": "en-US"
}
```

**Response (200):**
```json
{
  "success": true,
  "response": "Based on your symptoms...",
  "conversation_id": "conv123"
}
```
</details>

---

## 📸 Screenshots & UI

### Dashboard Views

![Admin Dashboard](./screenshots/admin-dashboard.png)
*Admin Dashboard - Health Worker Approvals & Analytics*

![Patient Dashboard](./screenshots/patient-dashboard.png)
*Patient Dashboard - Chat Interface with AI*

![Chat Interface](./screenshots/chat-interface.png)
*AI Chat Interface with Multilingual Support*

![Health Records](./screenshots/health-records.png)
*Health Records Management*

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SIDE (React)                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Patient    │  │Health Worker │  │ Administrator│       │
│  │   Dashboard  │  │   Dashboard  │  │   Dashboard  │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                   │
└───────────────────────────┼───────────────────────────────────┘
                            │
                   Next.js API Routes
                            │
┌───────────────────────────┼───────────────────────────────────┐
│                  SERVER SIDE (Node.js)                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Authentication & Authorization             │   │
│  │  (JWT Tokens, Password Hashing, Session Management) │   │
│  └────────────────────────┬─────────────────────────────┘   │
│                           │                                   │
│  ┌────────────┐  ┌────────┴─────────┐  ┌─────────────────┐ │
│  │ Chat API   │  │ Admin API        │  │ Auth API        │ │
│  │ (Gemini)   │  │ (Management)     │  │ (Login/Signup) │ │
│  └────────────┘  └──────────────────┘  └─────────────────┘ │
│         │                                      │              │
└─────────┼──────────────────────────────────────┼──────────────┘
          │                                      │
          │                    ┌─────────────────┘
          │                    │
          ▼                    ▼
    ┌──────────────┐    ┌──────────────┐
    │ Google       │    │   MongoDB    │
    │ Gemini 2.0   │    │   Atlas      │
    │ Flash API    │    │   Database   │
    └──────────────┘    └──────────────┘
```

---

## 💡 How the System Works

### 🔄 User Journey: Patient Seeking Health Guidance

```
1. User Registration/Login
   ↓
2. Select Language & Role
   ↓
3. Access AI Chat Interface
   ↓
4. Type Health Query (or use speech input)
   ↓
5. Gemini AI Processes Query
   ↓
6. Real-time Response with Guidance
   ↓
7. View Health Records (if applicable)
   ↓
8. Option to Connect with Health Worker
   ↓
9. Provide Feedback on Consultation
```

### 🤖 AI Integration: Gemini 2.0 Flash

The platform uses **Google's Gemini 2.0 Flash** API for intelligent health guidance:

- **Real-time Processing:** Instant responses to health queries
- **Context Awareness:** Understands patient history and previous messages
- **Multilingual:** Supports 11+ languages seamlessly
- **Safety:** Configured with safety settings to avoid medical advice beyond scope
- **Accuracy:** Fine-tuned prompts for healthcare domain

**Sample Gemini Integration:**
```typescript
const response = await gemini.generateContent({
  contents: [{
    role: "user",
    parts: [{
      text: userMessage
    }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  }
});
```

### 👨‍⚕️ Health Worker Approval Flow

```
1. Health Worker Applies via Signup
   ↓
2. Provides Credentials & Documents
   ↓
3. Admin Reviews Application
   ↓
4. Admin Verifies with NMC Registry
   ↓
5. Admin Approves/Denies
   ↓
6. Worker Gets Access to Dashboard
   ↓
7. Can Accept & Manage Cases
```

---

## 🛡️ Admin Panel Features

### Dashboard Overview
- 📊 **Real-time Metrics:** Total cases, consultations, workers, villages
- 🗺️ **Village Management:** Add, edit, delete villages
- 👥 **Health Worker Management:** Review, approve, deny applications
- ⚠️ **Alert System:** Monitor critical health cases
- 📈 **Analytics:** Worker performance, case trends
- 🔍 **Search & Filter:** Find workers and cases quickly

### NMC Registry Integration
- Quick link to verify doctor credentials
- Direct access from approvals section
- One-click verification process

### Key Sections
1. **Overview** - Dashboard statistics
2. **Approvals (1)** - Pending health worker applications
3. **Villages** - Village management
4. **Alerts** - Critical case notifications
5. **Workers** - All registered health workers
6. **Analytics** - Performance metrics & trends

---

## 👥 User Features

### Patient/User Portal
- ✅ Create account with email verification
- ✅ Update personal health information
- ✅ Chat with AI health assistant
- ✅ View consultation history
- ✅ Request remote consultations
- ✅ Manage health records
- ✅ Provide feedback on services
- ✅ Switch between languages

### Health Worker Portal
- ✅ Apply to work on platform
- ✅ Upload credentials & documents
- ✅ View approved status
- ✅ Access patient list
- ✅ Manage assigned cases
- ✅ Update profile information
- ✅ View consultation history

---

## 🔒 Security Considerations

### Data Protection
- **Password Hashing:** bcryptjs with salt rounds
- **JWT Tokens:** Secure token-based authentication
- **MongoDB Encryption:** Atlas built-in encryption
- **HTTPS:** Enforced in production
- **Environment Variables:** Sensitive data in .env.local

### Access Control
- **Role-Based Access:** Patient, Health Worker, Administrator roles
- **API Authorization:** Protected endpoints with token verification
- **Document Upload Security:** File type validation and scanning
- **Session Management:** Automatic token expiration

### Best Practices
- ✅ Never commit `.env.local` to Git
- ✅ Rotate admin passwords regularly
- ✅ Use strong, unique passwords
- ✅ Enable MongoDB IP Whitelist
- ✅ Monitor API key usage
- ✅ Implement rate limiting on production
- ✅ Regular security audits
- ✅ User data privacy compliance

---

## 🗺️ Future Improvements / Roadmap

### Phase 2 (Q1 2026)
- [ ] Video consultation support
- [ ] Prescription generation system
- [ ] Lab test integration
- [ ] Push notifications
- [ ] Offline mode support

### Phase 3 (Q2 2026)
- [ ] Telemedicine marketplace
- [ ] AI-powered diagnosis suggestions
- [ ] Patient appointment scheduling
- [ ] SMS alerts for non-internet users
- [ ] WhatsApp bot integration

### Phase 4 (Q3 2026)
- [ ] Advanced analytics dashboard
- [ ] Insurance claim processing
- [ ] Medical record blockchain verification
- [ ] Multi-language documentation
- [ ] Mobile app (iOS & Android)

### Phase 5 (Q4 2026)
- [ ] Predictive health analytics
- [ ] Integration with government health systems
- [ ] Community health programs
- [ ] Research data analytics
- [ ] Enterprise partnerships

---

## 🐛 Troubleshooting

<details>
<summary><b>❌ MongoDB Connection Failed</b></summary>

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
1. Verify MongoDB URI in `.env.local`
2. Check MongoDB Atlas IP whitelist includes your IP
3. Ensure cluster is running and active
4. Test connection with mongosh:
   ```bash
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"
   ```
</details>

<details>
<summary><b>❌ Gemini API Key Invalid</b></summary>

**Error:** `401 Unauthorized - Invalid API key`

**Solution:**
1. Generate new API key from https://aistudio.google.com/app/apikey
2. Update `GEMINI_API_KEY` in `.env.local`
3. Restart dev server: `npm run dev`
4. Verify key has Gemini API enabled
</details>

<details>
<summary><b>❌ Port 3000 Already in Use</b></summary>

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or start on different port
npm run dev -- -p 3001
```
</details>

<details>
<summary><b>❌ TypeScript Compilation Error</b></summary>

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solution:**
1. Run type checking: `npm run type-check`
2. Review error location
3. Check imports and exports
4. Ensure all dependencies are installed:
   ```bash
   npm install
   ```
</details>

<details>
<summary><b>❌ Admin Login Not Working</b></summary>

**Error:** `Invalid credentials`

**Solution:**
1. Verify admin was initialized: `npm run init:admin`
2. Check admin email & password in `.env.local`
3. Reset admin in MongoDB:
   ```bash
   npm run init:admin -- --reset
   ```
4. Ensure MongoDB is connected
</details>

---

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these guidelines:

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/ai-health-continuity.git
cd ai-health-continuity
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow existing code style
- Add TypeScript types
- Test your changes
- Write clear commit messages

### 4. Commit & Push
```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Describe your changes clearly
- Reference any related issues
- Request review from maintainers

### Code Standards
- Use TypeScript for all new code
- Follow Prettier formatting
- Ensure no TypeScript errors
- Write meaningful comments
- Test before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### What You Can Do
✅ Use commercially  
✅ Modify the code  
✅ Distribute freely  
✅ Use privately  

### What You Cannot Do
❌ Remove license notices  
❌ Hold liable for damages  
❌ Claim original authorship  

---

## 🙏 Acknowledgments

This project was made possible by:

### Technologies & Services
- [Next.js](https://nextjs.org/) - Modern React framework
- [Google Gemini API](https://ai.google.dev/) - AI health guidance
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Cloud database
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety

### Contributors & Teams
- **Development Team:** Deepak Kumar (Lead Developer)
- **Design Team:** [Contributors Welcome]
- **Testing Team:** [Contributors Welcome]
- **Community:** All users and contributors

### Open Source Community
Special thanks to the open-source community for incredible tools and libraries that made this project possible.

---

## 📞 Contact Information

### Get in Touch
- **Email:** deepak@ruralhealthcare.com
- - **GitHub:** [It-iandeepak](https://github.com/It-iandeepak)
- - **LinkedIn:** https://www.linkedin.com/in/deepak-kumar-18999232b/
- - **Email:** ankit26548k@gmail.com
- - **GitHub:** (https://github.com/ankit-kumar-developer-122)
- - **LinkedIn:** (https://www.linkedin.com/in/ankit-kumar-developer122)
- - - **Email:** abhishekkumar98954@gmail.com
- - **GitHub:** (https://github.com/XoABHI)
- - **LinkedIn:** (https://www.linkedin.com/in/abhishek-kumar-b99449226)
    


### Support & Issues
- **Bug Reports:** [GitHub Issues](https://github.com/It-iandeepak/ai-health-continuity/issues)
- **Feature Requests:** [GitHub Discussions](https://github.com/It-iandeepak/ai-health-continuity/discussions)
- **Documentation:** Check [Wiki](https://github.com/It-iandeepak/ai-health-continuity/wiki)

### Quick Links
- 🌐 [Project Repository](https://github.com/It-iandeepak/ai-health-continuity)
- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/It-iandeepak/ai-health-continuity/issues)
- 💬 [Discussions](https://github.com/It-iandeepak/ai-health-continuity/discussions)

---

<div align="center">

### Made with ❤️ for Rural Healthcare

⭐ If you find this project helpful, please give it a star!

[⬆ Back to Top](#-rural-healthcare-continuity-platform)

</div>
#   A i - d r i v e n - H e a l t h C a r e - H u b  
 