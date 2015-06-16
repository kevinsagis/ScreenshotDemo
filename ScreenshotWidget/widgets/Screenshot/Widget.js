
define([
    "dojo/_base/declare",
  "jimu/BaseWidget",
  "dijit/form/ToggleButton",
  "dojo/dom",
  "dijit/registry",
  "dijit/form/Button",
  "dojo/on",
  "dojo/aspect",
  "esri/map",
  "./widgets/Screenshot/html2canvas.js",
    "./widgets/Screenshot/filesaver.js",
  "./widgets/Screenshot/CanvasToBlob.js"

   

],
function (declare, BaseWidget, ToggleButton, dom, registry, Button, on, aspect, map) {
    var handlerPictometry = {advice: null};

    var clazz = declare([BaseWidget], 


{
        templateString: '<div> <br /> <br />1. Click the Screenshot button to save a screenshot. <br /> ' +
      '<input type="button" class="jimu-btn" id="btnScreenshot" value="Save Screenshot" data-dojo-attach-event="click:_screenshotClick"> <br /> <br /> <br /></div> ',
     
 baseClass: 'jimu-widget-screenshot',
 name: 'Screenshot',

 _screenshotClick: function () {


     var canvas;

     html2canvas(document.body, {

         "logging": true, //Enable log (use Web Console for get Errors and Warnings)
       //  "useCORS": true,
         //"allowTaint": true,
         "proxy": "/boa4/widgets/Screenshot/html2canvasproxy.php",
        // "timeout": "0",

         onrendered: function (canvas) {
            // document.body.appendChild(canvas);
             canvas.toBlob(function (blob) {
                 saveAs(blob, "Screenshot.png");
             });
         }
     });
 
     //html2canvas(document.body).then(function (canvas) {
     /////this is the sytnax for the new alpha 0.5  ..... /////
     //    document.body.appendChild(canvas);
     //    canvas.toBlob(function (blob) {
     //        saveAs(blob, "Screenshot.png");
     //    });

     //});


/////
 },

        startup: function () {
            this.inherited(arguments);
            //alert('startup');

           

        },

        onClose:
    function () {
 //
    }


    });

    clazz.hasStyle = true;
    clazz.hasUIFile = false;
    clazz.hasLocale = false;
    clazz.hasConfig = false;
    return clazz;
});