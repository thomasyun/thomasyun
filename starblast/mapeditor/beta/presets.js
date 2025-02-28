if (window.t) {
  $('html').html(`<head><title>Redirecting...</title></head><body style="font-family:Verdana">Redirecting, please wait...<br> Click <a href="${t}">here</a> if your browser does not redirect you automatically.</body>`);
  window.open(t,"_self");
}
else (function(){
  addServiceWorker("sw.js");
  var links = [
    ["version",'/starblast/mapeditor/changelog.html','_blank'],
    ["feedback",'/redirect?id=MapEditorFeedback','_blank'],
    ["tutorial",'https://github.com/Bhpsngum/starblast/blob/master/MapEditorTutorial.md','_blank'],
    ["changelog",'/starblast/mapeditor/changelog.html','_blank'],
    ["advanceddoc","https://github.com/Bhpsngum/starblast/blob/master/MapEditorTutorial.md#custom-brush",'_blank']
  ]
  for (let link of links) $("#"+link[0]).on("click",function(){
    window.open(link[1],link[2]);
  });
  let states=["dark","light"];
  if (!window.matchMedia) document.querySelector("link").href="/starblast/mapeditor/icon_light.png";
  else for (let state of states) if (window.matchMedia(`(prefers-color-scheme: ${state})`).matches) document.querySelector("link").href=`/starblast/mapeditor/icon_${state}.png`;
  console.log('%c Stop!!', 'font-weight: bold; font-size: 100px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38)');
  console.log('%cYou are accessing the Web Developing Area.\n\nPlease do not write/copy/paste/run any scripts here (unless you know what you\'re doing) to better protect yourself from loosing your map data, and even your other sensitive data.\n\nWe will not be responsible for any problems if you do not follow the warnings.', 'font-weight: bold; font-size: 15px;color: grey;');
  console.log('%cMap Editor, made by Bhpsngum,\n\nfeel free to distribute the code and make sure to credit my name if you intend to do that\n\nGitHub: https://github.com/Bhpsngum', 'font-weight: bold; font-size: 15px;color: Black;');
  $("input, textarea").attr("spellcheck", false);
  $.ajax("/starblast/mapeditor/changelog.txt").then(function(data){
    data.replace(/\d+\.\d+\.\d+/, function(version) {
      $("#modules tr").append('<td id="version" style="border:none;width:auto">Version ' + version + '</td>');
      if (localStorage.getItem("lastVer") != version)
      {
        let info = data.split("\n\n")[0].split("\n");
        localStorage.setItem("lastVer",version);
        confirm("What's new ("+version+")\n"+info.slice(1,info.length).join("\n").replace(/\\n/g,"")+"\n\nWould you like to see full updates?") && $('#changelog').click();
      }
    });
  }).fail(e => {});
})();
