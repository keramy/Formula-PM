#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Formula PM Next Level Prototype...\n');

const STEPS = [
  {
    name: 'Creating Next.js application',
    command: 'npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm',
    cwd: process.cwd()
  },
  {
    name: 'Installing core dependencies',
    command: 'npm install @prisma/client prisma @tanstack/react-query zustand socket.io-client @headlessui/react @heroicons/react recharts framer-motion react-hook-form @hookform/resolvers zod date-fns clsx lucide-react',
    cwd: process.cwd()
  },
  {
    name: 'Installing development dependencies',
    command: 'npm install -D @types/node @types/react @types/react-dom vitest @testing-library/react @testing-library/jest-dom @playwright/test concurrently nodemon',
    cwd: process.cwd()
  },
  {
    name: 'Initializing Prisma',
    command: 'npx prisma init',
    cwd: process.cwd()
  },
  {
    name: 'Setting up project structure',
    fn: setupProjectStructure
  },
  {
    name: 'Creating sample components',
    fn: createSampleComponents
  },
  {
    name: 'Setting up environment files',
    fn: setupEnvironment
  }
];

async function runStep(step, index) {
  console.log(`${index + 1}/${STEPS.length} ${step.name}...`);
  
  try {
    if (step.command) {
      execSync(step.command, { 
        cwd: step.cwd || process.cwd(), 
        stdio: 'inherit' 
      });
    } else if (step.fn) {
      await step.fn();
    }
    console.log('✅ Completed\n');
  } catch (error) {
    console.error(`❌ Failed: ${error.message}\n`);
    process.exit(1);
  }
}

function setupProjectStructure() {
  const directories = [
    'src/components/ui',
    'src/components/forms',
    'src/components/charts',
    'src/features/projects',
    'src/features/tasks', 
    'src/features/team',
    'src/features/clients',
    'src/lib',
    'src/stores',
    'src/types',
    'src/hooks',
    'api/routes',
    'api/middleware',
    'api/models',
    'prisma/migrations',
    'tests/components',
    'tests/e2e'
  ];

  directories.forEach(dir => {
    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
  });
}

function createSampleComponents() {
  // Create a basic dashboard component
  const dashboardComponent = `
import React from 'react';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetch('/api/projects').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Formula PM Next Level
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Projects</h3>
          <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Active Projects</h3>
          <p className="text-3xl font-bold text-green-600">
            {projects.filter(p => p.status === 'active').length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Completed</h3>
          <p className="text-3xl font-bold text-purple-600">
            {projects.filter(p => p.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Projects</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {projects.slice(0, 5).map(project => (
            <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;

  fs.writeFileSync(
    path.join(process.cwd(), 'src/components/Dashboard.tsx'),
    dashboardComponent
  );

  // Create a basic API route
  const apiRoute = `
import { NextRequest, NextResponse } from 'next/server';

const sampleProjects = [
  {
    id: 1,
    name: 'Akbank Head Office Renovation',
    description: 'Complete renovation of headquarters',
    status: 'active',
    progress: 75
  },
  {
    id: 2,
    name: 'Garanti BBVA Tech Center',
    description: 'MEP infrastructure for tech center',
    status: 'active', 
    progress: 40
  },
  {
    id: 3,
    name: 'İş Bank Branch Fit-out',
    description: 'Interior fit-out for new branch',
    status: 'completed',
    progress: 100
  }
];

export async function GET() {
  return NextResponse.json(sampleProjects);
}

export async function POST(request: NextRequest) {
  const project = await request.json();
  const newProject = {
    id: Date.now(),
    ...project,
    status: 'planning',
    progress: 0
  };
  
  return NextResponse.json(newProject, { status: 201 });
}`;

  // Create API directory
  fs.mkdirSync(path.join(process.cwd(), 'src/app/api/projects'), { recursive: true });
  fs.writeFileSync(
    path.join(process.cwd(), 'src/app/api/projects/route.ts'),
    apiRoute
  );
}

function setupEnvironment() {
  const envLocal = `
# Database
DATABASE_URL="postgresql://formula:password@localhost:5432/formula_pm_next"

# Authentication
NEXTAUTH_SECRET="development_secret_key"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"

# File Storage
NEXT_PUBLIC_UPLOAD_URL="http://localhost:9000"
MINIO_ACCESS_KEY="formula"
MINIO_SECRET_KEY="password123"

# Email
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT=1025
EMAIL_FROM="noreply@formulapm.dev"
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.local'), envLocal);

  const envExample = `
# Copy this file to .env.local and fill in your values

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Authentication
NEXTAUTH_SECRET="your_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"

# API
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_WS_URL="ws://localhost:3001"
`;

  fs.writeFileSync(path.join(process.cwd(), '.env.example'), envExample);
}

async function main() {
  console.log('Formula PM Next Level Prototype Setup\n');
  console.log('This will create a modern Next.js application with:');
  console.log('✨ TypeScript + Tailwind CSS');
  console.log('📊 TanStack Query for state management');
  console.log('🗄️ Prisma ORM with PostgreSQL');
  console.log('🔐 NextAuth.js for authentication');
  console.log('📱 Mobile-first responsive design');
  console.log('🧪 Testing setup with Vitest + Playwright\n');

  for (let i = 0; i < STEPS.length; i++) {
    await runStep(STEPS[i], i);
  }

  console.log('🎉 Prototype setup completed!\n');
  console.log('Next steps:');
  console.log('1. Start the database: docker-compose up postgres redis');
  console.log('2. Run database migrations: npm run db:push');
  console.log('3. Start development server: npm run dev');
  console.log('4. Open http://localhost:3000 in your browser\n');
  console.log('Happy coding! 🚀');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };