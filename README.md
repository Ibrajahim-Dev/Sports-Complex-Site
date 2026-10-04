# Sports Complex Website
Static site (HTML/CSS/JS), no build step.
1. Edit business name, address, prices in the HTML files.
2. WhatsApp / phone number is **+92 334 8188872** (wa.me/923348188872). To change it, search & replace `923348188872` and `+92 334 8188872` in the HTML files, and edit `WA_NUMBER` at the top of `js/main.js`.
3. Animations use anime.js v3 (bundled in `js/anime.min.js`, no CDN needed). All animation code is in `js/main.js`; start states are at the bottom of `css/style.css`. Users with "reduce motion" enabled see the site without animations.
4. Push to GitHub, then import the repo in Vercel (Framework: Other, no build command).
