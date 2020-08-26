Note to myself for how to create this:

Champ profile pics are 400x400 and the title must match the card's code exactly.

1. Add all photos to photoshop, same file different layer.
2. Center all champ PFPs as desired in each individual layer.
3. Select the Ellipses Marquee
4. In the tools preset menu choose "Champ PFP"
5. Align the ellipses so it is centered
6. Press "Ctrl + Shift + i" to select everything outside of the ellipses
7. Press "Delete"
8. Click new layer
9. Press "Delete"
10. Repeat until all layers have been cropped.
11. Right click the layeer > Quick Export as PNG (for each layer)
12. _*IMPORTANT*_ Make sure to name every layer its correct card code EXACTLY
13. Add the pfps to this folder
14. in the main folder `npm run upload-to-s3`