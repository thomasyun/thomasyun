(function(){
  var SSCV = {
    compile: function(data) {
      return data.replace(/.+?[^\\]'((return)*(.+?[^\\]))'.+/,"$3").replace(/\\+/g,function(v){return v.slice(1,v.length)});
    },
    types: {
      list: [
        {
          name: "Ship Editor code",
          parse: function(data) {
            let result;
            try {
              let ship = JSON.parse(data);
              delete ship.typespec;
              result = "return "+js2coffee.build("model="+JSON.stringify(ship)).code;
            }
            catch(e) {
              result = js2coffee.build(data).code.replace(/^\(\-\>\n*/,"").replace(/\n*\)\.call\sthis\n*$/,"").replace(/\n*\s*\w+\s*=\s*undefined/g,"").replace(/(\n\s+)/g,function(v){return v.slice(0,v.length-2)}).replace(/_this\s*=\s*this/,"").trim().replace(/(model$|^model)/,"return $1").replace(/\(\n\s+/g,"(").replace(/\n\s+\)/g,")");
            }
            return result.replace(/\n+\s+(?=[^[\]]*\])/g, ",").replace(/\[,/g, "[").replace(/,\]/g, "]").replace(/'(\w+)':/g, "$1:");
          }
        },
        {
          name: "Basic WikiText info",
          parse: function(data) {
            data = eval("(function(){"+data+"})();");
            let s = data.typespec, t = function(arr) {
              if (!Array.isArray(arr)) return arr;
              let i=0;
              while (i<arr.length) {
                if (arr.indexOf(arr[i])<i) arr.splice(i,1);
                else i++
              }
              return arr.join("/");
            }, wikitext = `{{Ship-Infobox
|name=${s.name||""}
|image=${(s.name||"").replace(/\s/g,"_")}.png
|shieldc=${t(s.specs.shield.capacity)}
|shieldr=${t(s.specs.shield.reload)}
|energyc=${t(s.specs.generator.capacity)}
|energyr=${t(s.specs.generator.reload)}
|turning=${t(s.specs.ship.rotation)}
|acceleration=${t(s.specs.ship.acceleration)}
|speed=${t(s.specs.ship.speed)}
|tier=${s.level||1}
|mass=${s.specs.ship.mass||0}
|designer=${data.designer||"Neuronality"}
}}\n\n== Cannons ==\n\n`;
            let lasers = s.lasers.map(laser => {
              laser.x = Math.abs(laser.x);
              laser.y = Math.abs(laser.y);
              laser.z = Math.abs(laser.z);
              return laser;
            }), dups = new Map(), i = 0;
            while (i<lasers.length) {
              let laser = lasers[i], p = [laser.x,laser.y,laser.z].join("-"), dupi = dups.get(p);
              if (!dupi) {
                dups.set(p,laser);
                i++;
              }
              else {
                lasers.splice(i,1);
                dups.get(p).dual = true;
                dups.delete(p);
              }
            }
            let dash = s.specs.ship.dash;
            if (dash) wikitext+=`{{Cannon
|type=Dash
|energy=${t(dash.energy)}
|damage=${t(dash.energy)}
|speed=${t(dash.burst_speed)}
|dual=N/A
|recoil=N/A
|frequency=1
|error=N/A
|angle=N/A
|spread=N/A
}}\n\n`;
            wikitext+=lasers.map(laser => `{{Cannon
|type=${["Stream","Pulse"][(laser.type-1)||0]}
|energy=${t(laser.damage.map(lar => ((laser.dual?(lar*2):lar)||0)))}
|damage=${t(laser.damage)}
|speed=${t(laser.speed)}
|dual=${!!laser.dual}
|recoil=${laser.recoil||0}
|frequency=${laser.rate||1}
|error=${laser.error||0}
|angle=${Math.abs(laser.angle)||0}
|spread=${Math.abs(laser.spread)||0}
}}`).join("\n\n");
            return wikitext;
          }
        }
      ],
      set: function() {
        $("#types").html("<option selected disabled>Select conversion type</option>"+this.list.map(i => `<option>${i.name}</option>`).join(""));
        this.choose();
      },
      choose: function() {
        let select = $("#types").prop("selectedIndex");
        if (select < 1 || select > this.list.length) {
          let t = Number(localStorage.getItem("selected-conversion-type"));
          select = (t > 0 && t <= this.list.length && !isNaN(t))?t:1;
        }
        select = Math.trunc(select);
        localStorage.setItem("selected-conversion-type",select);
        $("#types").prop("selectedIndex",select);
        return select;
      }
    },
    convert: function (forced) {
      let json = $("#input").val() || localStorage.getItem("json-input"), results;
      try {results = this.types.list[this.types.choose() - 1].parse(this.compile(json))}
      catch(e){
        if (forced) {
          json = "Ship Mod Export code"
          results = "Output";
        }
        else {
          this.error();
          return;
        }
      };
      localStorage.setItem("json-input",json);
      $("#output").val(results);
      $("#input").val(json);
    },
    error: function() {
      alert("Cannot parse the requested code!");
    },
    copy: function (text) {
      var dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }
  }
  SSCV.types.set();
  SSCV.convert(!0);
  $("#convert").on("click",function(){SSCV.convert()});
  $("#copy").on("click",function(){SSCV.copy($("#output").val())});
})();
