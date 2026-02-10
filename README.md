# Calm Breath — Labour & Endurance Breathing

A simple breathing trainer for labour and endurance. Uses a 4-count inhale and 6-count exhale with an Apple Watch–style expanding/contracting circle animation.

## How to use

1. Open `index.html` in your browser (double-click or drag into Chrome/Edge/Firefox).
2. Click **Start** and follow the circle: it grows when you inhale, shrinks when you exhale.
3. **Inhale** through your nose for 4 counts, **exhale** slowly through your mouth for 6 counts.
4. Use **Pause** / **Resume** or **Stop** as needed.

## Technique (shown in the app)

- Inhale through your nose for 4 counts  
- Exhale slowly through your mouth for 6 counts  
- Let your shoulders drop on the exhale  
- Keep your jaw loose  
- Picture gently blowing out a candle  

## Run locally (optional)

From the app folder:

```bash
npx serve .
```

Then open http://localhost:3000 (or the port shown). No build step required.

## Deploy on Vercel

### Option A: Deploy with Vercel CLI

1. Install the CLI and log in (one time):
   ```bash
   npm i -g vercel
   vercel login
   ```
2. From this folder, deploy:
   ```bash
   cd labour-breathing-app
   vercel
   ```
3. Follow the prompts (link to your account, confirm project name). You’ll get a live URL like `https://your-project.vercel.app`.

To deploy again after changes:
   ```bash
   vercel --prod
   ```

### Option B: Deploy from GitHub

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
3. Click **Add New…** → **Project**, then **Import** your repo.
4. Leave **Framework Preset** as “Other” (or “None”). Root Directory: leave blank. Click **Deploy**.
5. Vercel will build and give you a URL. Future pushes to the main branch will auto-deploy.
