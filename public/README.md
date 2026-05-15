# Background Video Setup

To replace the background with your Canva video:

1. Export your video from Canva as MP4 format
2. Rename the file to `background-video.mp4`
3. Place it in this `public/` folder
4. The video will automatically play as a background when you run the app

## Video Requirements:
- Format: MP4
- Recommended resolution: 1920x1080 or higher
- The video will be:
  - Muted (no sound)
  - Looped continuously
  - Scaled to cover the entire screen
  - Positioned behind all UI elements
  - Semi-transparent (30% opacity) to blend with the existing design

## Customization:
You can adjust the video appearance by modifying the CSS in `index.html`:
- Change `opacity: 0.3` to make it more/less visible
- Remove `filter: blur(1px)` if you want sharper video
- Adjust `z-index: -50` if needed (must be lower than existing background elements)