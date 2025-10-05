# Chef Convex Prompt Extension: Add Custom Color Scheme

Tailwind `theme.extend.colors`:
```js
colors: {
  primary: { DEFAULT: '#0066CC', dark: '#0052A3', light: '#3385D6' },
  secondary:{ DEFAULT: '#00BFA6', dark: '#009682', light: '#33CCBA' },
  neutral:  { dark: '#1A1A1A', medium: '#666666', light: '#E6E6E6', white: '#FFFFFF' },
  state:    { success: '#28A745', warning: '#FFB300', error: '#E53935' },
}
```

Apply:
- Navbar: `bg-primary text-neutral-white`
- Buttons: primary default; secondary hover
- Footer: `bg-neutral-dark text-neutral-white`, links in secondary
- Use AA contrast or better
