# Environment Variables Guide

This directory documents the environment configuration for **Project-1S**.

## Environment Files

| File | Purpose | Committed to Git? |
|------|---------|-------------------|
| `.env.example` | Template with all variables and descriptions | ✅ Yes |
| `.env` | Local development secret values | ❌ No (ignored by Git) |

## Supported Variables

### 1. `GEMINI_API_KEY` *(Optional)*
- **Purpose**: Powers Google Gemini AI responses in the Kisan Mitra Agriculture Chatbot.
- **Default / Fallback**: If not provided or left empty, the chatbot operates **100% autonomously** using the built-in **ICAR & TNAU Agricultural Expert Engine**.
- **Free Tier**: Free forever with no expiration at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 2. `NEXT_PUBLIC_APP_URL` *(Optional)*
- **Purpose**: Base URL of the deployment (e.g. `https://project-1s.vercel.app` or `http://localhost:3000`).

## Vercel Deployment Note
When deploying to Vercel, you can optionally paste `GEMINI_API_KEY` in **Vercel Project Settings → Environment Variables**. If you don't add it, the site and chatbot will still run without any issues!
