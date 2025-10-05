# Deploy to GitHub (Repo: jriizzyy/rayaanxplorae)

```bash
git init
printf "node_modules\n.next\nout\n.env\n.env.*\n.vercel\n.supabase\ndist\ncoverage\n.DS_Store\n" >> .gitignore
git add .
git commit -m "chore: initial commit"
git remote add origin https://github.com/jriizzyy/rayaanxplorae.git
git branch -M main
git push -u origin main
```

CI example at .github/workflows/ci.yml; Stripe webhook via Stripe CLI locally.
