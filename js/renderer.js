// Namespace
var asciidoctor = asciidoctor || {};


/**
 * Convert AsciiDoc as HTML
 */
asciidoctor.convert = function (data) {
    try {
      var body = $(document.body);
      // Save scripts
      var scripts = body.find('script');
      updateBody(data, scripts);
    }
    catch (e) {
      showErrorMessage(e.name + ' : ' + e.message);
      console.error(e.stack);
    }
};

/**
 * Update the <body> with the generated HTML
 */
function updateBody(data, scripts) {
  var options = buildAsciidoctorOptions();
  var asciidoctorDocument = Opal.Asciidoctor.$load(data, options);
  if (asciidoctorDocument.attributes.smap['icons'] == 'font') {
    appendFontAwesomeStyle();
  }
  appendTwemojiStyle();
  var generatedHtml = asciidoctorDocument.$convert();
  document.title = asciidoctorDocument.$doctitle(Opal.hash({sanitize: true}));
  document.body.className = asciidoctorDocument.$doctype();
  var maxWidth = asciidoctorDocument.$attr('max-width');
  if (maxWidth) {
    document.body.style.maxWidth = maxWidth;
  }
  $('#content').html(generatedHtml);
 
  appendScripts(scripts);
  syntaxHighlighting();
}

/**
 * Parse URL query parameters
 */
function getAttributesFromQueryParameters() {
  var query = location.search.substr(1);
  var result = [];
  query.split("&").forEach(function (part) {
    // part can be empty
    if (part) {
      var item = part.split("=");
      var key = item[0];
      var value = item[1];
      if (typeof value !== 'undefined') {
        var escapedValue = $('<div/>').text(decodeURIComponent(value)).html();
        result.push(key.concat('=').concat(escapedValue));
      } else {
        result.push(key);
      }
    }
  });
  return result;
}

function getThemeFromQueryParameters() {
  var query = location.search.substr(1);
  var result = 'asciidoctor';
  query.split("&").forEach(function (part) {
    // part can be empty
    if (part) {
      var item = part.split("=");
      var key = item[0];
      var value = item[1];
      if (typeof value !== 'undefined') {
         if(key == 'theme'){
            result = value;
          }
    }
   }
  });
 $("div.themes select").val(result);  
 return result;
}


/**
 * Build Asciidoctor options from settings
 */
function buildAsciidoctorOptions() {
  var attributesQueryParameters = getAttributesFromQueryParameters();
  // Default attributes
  var attributes = ['toc','sectanchors', 'numbered','sectanchors','showtitle', 'icons=font@', 'platform=opal', 'platform-opal', 'env=browser', 'env-browser', 'chart-engine=chartist', 'data-uri!'];
  var href = window.location.href;
  var fileName = href.split('/').pop();
  var fileExtension = fileName.split('.').pop();
  if (fileExtension !== '') {
    // Remove query parameters
    fileExtension = fileExtension.split('?')[0];
    attributes.push('outfilesuffix=.' + fileExtension);
  }
   
  if (attributesQueryParameters.length > 0) {
    Array.prototype.push.apply(attributes, attributesQueryParameters);
  }
  var pwd = Opal.File.$dirname(href);
  Opal.ENV['$[]=']("PWD", pwd);
  return Opal.hash({
    'base_dir': pwd,
    'safe': 'unsafe',
    // Force backend to html5
    'backend': 'html5',
    'attributes': attributes
  });
}

/**
 * Append saved scripts
 */
function appendScripts(scripts) {
  var length = scripts.length;
  for (var i = 0; i < length; i++) {
    var script = scripts[i];
  
      document.body.appendChild(script);
     
  }
}


/**
 * Syntax highlighting
 */
function syntaxHighlighting() {
  $('pre.highlight > code').each(function (i, e) {
    if ((match = /language-(\S+)/.exec(e.className)) != null && hljs.getLanguage(match[1]) != null) {
      hljs.highlightBlock(e);
    }
    else {
      e.className += ' hljs';
    }
  });
}

function appendTwemojiStyle() {
  if ($('#twemoji-awesome-style').length == 0) {
    var twemojiAwesomeLink = document.createElement('link');
    twemojiAwesomeLink.rel = 'stylesheet';
    twemojiAwesomeLink.id = 'twemoji-awesome-style';
    twemojiAwesomeLink.href = '../css/twemoji-awesome.css';
    document.head.appendChild(twemojiAwesomeLink);
  }
}

 
function appendFontAwesomeStyle() {
  if ($('#font-awesome-style').length == 0) {
    var fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.id = 'font-awesome-style';
    fontAwesomeLink.href = '../css/font-awesome.min.css';
    document.head.appendChild(fontAwesomeLink);
  }
}

/**
 * Append highlight.js script
 */
function appendHighlightJsScript() {
  var highlightJsScript = document.createElement('script');
  highlightJsScript.type = 'text/javascript';
  highlightJsScript.src = '../js/highlight.min.js';
  document.head.appendChild(highlightJsScript);
}


/**
 * Append css files
 */
function appendStyles() {
  // Theme
  
  var theme = getThemeFromQueryParameters() || 'foundation';
  var themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.id = 'asciidoctor-style';
  themeLink.href = '../css/themes/' + theme + '.css';
  document.head.appendChild(themeLink);
  // Highlight
  var highlightTheme = 'github';
  var highlightStylesheetLink = document.createElement('link');
  highlightStylesheetLink.rel = 'stylesheet';
  highlightStylesheetLink.id = 'github-highlight-style';
  highlightStylesheetLink.href = '../css/highlight/' + highlightTheme + '.css';
  document.head.appendChild(highlightStylesheetLink);
}

/**
 * Show error message
 * @param message The error message
 */
function showErrorMessage(message) {
  var messageText = '<p>' + message + '</p>';
  $(document.body).html('<div id="content"><h4>Error</h4>' + messageText + '</div>');
}
