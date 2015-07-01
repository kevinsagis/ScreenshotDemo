# ScreenshotDemo

The widget is located inside the Widgets folder:  
ScreenshotWidget/widgets/Screenshot  

To use:

1) put the Screenshot widget folder into your own WAB site's Widgets folder
2) change    the line in Widget.js ---
      "proxy": "/INSERT_YOUR_SITE_NAME/widgets/Screenshot/html2canvasproxy.php",
to whatever the name of your WAB site is.  For example, in this downloadable demo the name of the site is 
ScreenshotWidget.  That is why, when you first download, the line is as follows:
"proxy": "/ScreenshotWidget/widgets/Screenshot/html2canvasproxy.php",

If your site was named "ParcelViewer" then the line would be
"proxy": "/ParcelViewer/widgets/Screenshot/html2canvasproxy.php",

Note: Sometime soon I'll add this as a configurable text box in the WebApp Builder Developer 
config window, so when you go to add this widget, all you have to do is enter your Site name there.



Credits: 

html2canvas by Niklas von Hertzen at github.com/niklasvh/html2canvas
html2canvasProxy by Guilherme Nascimento at github.com/brcontainer/html2canvas-python-proxy 
filesaver.js by Eli Grey at github.com/eligrey/FileSaver.js/
Canvas to Blob by Sebastian Tschan at github.com/blueimp/JavaScript-Canvas-to-Blob

Disclaimer: all code and instructions provided with no warranty or guarantee of any kind express or implied. For Pictometry product support, contact Pictometry.
