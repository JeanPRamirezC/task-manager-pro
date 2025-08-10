# 📝 Task Manager Pro

Una aplicación Full Stack para gestionar tareas personales o de equipo.  
Construida con **Next.js 14 (App Router)**, **TypeScript**, **PostgreSQL + Supabase** y **Drizzle ORM**.

## ✨ Funcionalidades

- ✅ Crear, leer, editar y eliminar tareas (CRUD completo)
- ✅ Cambiar estado de la tarea (`pending`, `in-progress`, `completed`)
- ✅ Interfaz limpia con TailwindCSS
- ✅ API REST modular con Next.js
- ✅ Base de datos alojada en Supabase

## 🧱 Tech Stack

- **Frontend:** Next.js + TypeScript + TailwindCSS
- **Backend:** Next.js API Routes (App Router)
- **ORM:** Drizzle
- **DB:** PostgreSQL (Supabase)
- **Deploy recomendado:** Vercel + Supabase

## 🛠️ Instrucciones de uso

1. Clona el repo:
```bash
git clone https://github.com/tu-usuario/task-manager-pro.git
cd task-manager-pro
```
2. Instala dependencias:
```bash
npm install
```
3. Crea un archivo .env:
```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.supabase.co:5432/postgres
 ```
 4. Ejecuta migraciones:
 ```bash
 npx drizzle-kit push:pg
```
5. Inicia la app:
```bash
npm run dev
```