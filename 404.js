(function(){
  function random(num)
  {
    return ~~(Math.random()*num);
  }
  let name = ["Megumin"],img_types = ["png","jpg"],
  styles = [
    [null],
    [null]
  ]
  let i = random(name.length), ind = random(styles[i].length), body = window.document.querySelector("#body");
  body.setAttribute("style", "color:"+(styles[i][ind]||"rgb(102,102,102)"));
  window.document.querySelector("#message").innerHTML= `Here is a picture of ${name[i]} instead.`;
  let img_link = `https://bhpsngum.github.io/404_img/${name[i].replace(/\s/g,"_")}/${ind}.`;
  function testImage(i)
  {
    if (i<0) return;
    let u = new Image(),lnk = img_link+img_types[i];
    u.src = lnk;
    img.onload = function(){
    body.setAttribute("style",body.getAttribute("style")+`background-image:url(${lnk});`);
      window.document.querySelector("#link").href = lnk;
    }
    img.onerror = function(){testImage(i-1)}
  }
  testImage(img_types.length-1);
})();
