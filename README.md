# Vehicles Auction Query

This project contains a Next.js application configured with Babel and Webpack in the `app` directory.

## Project Structure

- `app/` - Main Next.js application with Babel and Webpack configuration
- `.github/workflows/` - GitHub Actions for CI/CD
- `build.sh` / `build.cmd` - Helper scripts for building from the root directory

## Development from Root Directory

You can use the following commands from the root directory:

### Using npm scripts:

```bash
# Install dependencies
npm run install:app

# Start development server
npm run dev

# Build the application
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run tests
npm run test

# Build with webpack
npm run webpack:build
```

### Using helper scripts:

#### On Unix/Linux/Mac:
```bash
# Make the script executable
chmod +x build.sh

# Install dependencies
./build.sh install

# Start development server
./build.sh dev

# Build the application
./build.sh build

# Other commands
./build.sh lint
./build.sh test
./build.sh webpack
```

#### On Windows:
```cmd
# Install dependencies
build install

# Start development server
build dev

# Build the application
build build

# Other commands
build lint
build test
build webpack
```

## GitHub Actions

This project includes a GitHub Actions workflow that automatically builds and tests the application on push to main/master and on pull requests. The workflow:

1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Runs lint check
5. Builds the Next.js application
6. Runs tests
7. Optionally builds with Webpack

## Vercel Deployment

### Automatic Deployment from GitHub

This project is configured for automatic deployment to Vercel when you push to your GitHub repository. To set it up:

1. Connect your GitHub repository to Vercel:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "Add New" > "Project"
   - Select your GitHub repository
   - Vercel will detect the Next.js app in the `app` directory thanks to the `vercel.json` configuration

2. Set up the required GitHub secrets for the GitHub Actions workflow:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel Organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel Project ID

   You can find these values in your Vercel project settings or by running:
   ```bash
   npx vercel login
   npx vercel link
   ```

3. Push to your main/master branch, and GitHub Actions will automatically build and deploy your project to Vercel

### Manual Deployment

You can also manually deploy to Vercel using:

```bash
npm run vercel:deploy
``` 