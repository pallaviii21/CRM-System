const { execSync } = require('child_process');
const path = require('path');

// Recursion guard to prevent infinite loops during npm postinstall
if (process.env.CRM_INSTALLING_DEPS === 'true') {
  console.log('Recursion guard triggered. Skipping nested install.');
  process.exit(0);
}

// Determine the npm execution path cross-platform.
const npmPath = process.env.npm_execpath 
  ? `"${process.execPath}" "${process.env.npm_execpath}"` 
  : 'npm';

// Clone the current environment variables and add our recursion guard flag.
// Force NODE_ENV to development during install so that devDependencies (like Vite) are installed.
const childEnv = {
  ...process.env,
  CRM_INSTALLING_DEPS: 'true',
  NODE_ENV: 'development'
};

try {
  const rootDir = __dirname;
  
  console.log('Installing backend dependencies...');
  execSync(`${npmPath} install --include=dev`, { 
    stdio: 'inherit', 
    shell: true,
    cwd: path.join(rootDir, 'backend'),
    env: childEnv
  });
  
  console.log('Installing frontend dependencies...');
  execSync(`${npmPath} install --include=dev`, { 
    stdio: 'inherit', 
    shell: true,
    cwd: path.join(rootDir, 'frontend'),
    env: childEnv
  });
  
  console.log('Dependencies installed successfully.');
} catch (error) {
  console.error('Error installing dependencies:', error);
  process.exit(1);
}
