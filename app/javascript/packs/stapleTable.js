let t = "";
for (var i = 0; i < staples.data.length; i++) {
  var tr = "<tr>";
  tr += "<td>" + (i + 1) + "</td>";
  tr += "<td>" + staples.data[i].name + "</td>";
  tr += "<td>" + rgb2Hex(staples.data[i].color) + "</td>"
  tr += "<td>" + staples.data[i].sequence + "</td>";
  tr += "<td>" + staples.data[i].sequence.length + "</td>";
  tr += "</tr>";
  t += tr;
}

function rgb2Hex(rgb) {
    let r, g, b;
    [r, g, b] = rgb;
    
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    let arr = [r, g, b]; 
    hex= ""
    for (let i = 0; i < arr.length; i++) {
        let h = arr[i].toString(16);
        if (arr[i] < 16) {
            hex += `0${h}`;
        } else {
            hex += h;
        }
    }

    return `0x${hex}`
    // newR = r.toString(16);
    // if 
}

document.getElementById("staples_table").innerHTML += t;