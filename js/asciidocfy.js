// Namespace
var asciidoctor = asciidoctor || {};


function loadContent() {

     var content = document.getElementById('content').innerHTML;	
  
 
     content = content.replace(new RegExp(['&lt;'],"g"), "<");
     content = content.replace(new RegExp(['&gt;'],"g"), ">");
     content = content.replace(new RegExp(['<!--'],"g"), "<");
     content = content.replace(new RegExp(['-->'],"g"), ">");


     asciidoctor.loadContent(content.trim());
 
  
     //document.getElementById('content').innerHTML = Opal.Asciidoctor.$convert(contentEscaped);

   
 
}

asciidoctor.loadContent = function (data) {
      appendStyles();
      appendHighlightJsScript();
      asciidoctor.convert(data);
};

