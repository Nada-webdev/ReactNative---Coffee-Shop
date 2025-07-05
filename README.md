#  Expo + Appwrite Starter

This project was created using [`create-expo-app`](https://www.npmjs.com/package/create-expo-app) and integrates [**Appwrite**](https://appwrite.io/) for backend services like authentication, databases.

---

##  Features

- ⚛️ Built with **React Native** via [Expo](https://expo.dev)
- ☁️ Backend powered by **Appwrite**
- 🔐 User Authentication (Email/Password)
-   Realtime Database & File Storage
-  Fast styling with [NativeWind](https://www.nativewind.dev/) *(Tailwind-like utility classes)*

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd reactNative
```
### 2. Install dependencies
```bash
npm install
```
### 3. Start the development server

```bash
npx expo start
```
### 4. Appwrite Setup
- Go to https://appwrite.io and create a free backend project.

- Create a new project and copy the Project ID and API Endpoint.

- Configure Appwrite in your client using the SDK:

```bash
  import { Client } from "appwrite";

const client = new Client()
  .setEndpoint("https://[YOUR-ENDPOINT]") // Your Appwrite endpoint
  .setProject("[YOUR-PROJECT-ID]");       // Your project ID
```
<p align="center">
  <img src="https://github.com/user-attachments/assets/13b0bd61-7896-44a0-af17-45aed1955912" alt="Capture" />
</p>




