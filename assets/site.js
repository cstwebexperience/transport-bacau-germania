(function () {
  "use strict";
  var PHONE = "40746551785";
  var form = document.getElementById("form");
  var f = form.elements;
  var err = document.getElementById("err");
  document.getElementById("y").textContent = new Date().getFullYear();

  var t = new Date();
  f.data.min = t.getFullYear() + "-" + String(t.getMonth() + 1).padStart(2, "0") + "-" + String(t.getDate()).padStart(2, "0");

  // Linkurile din carduri aleg tipul cursei în formular
  document.querySelectorAll("[data-tip]").forEach(function (a) {
    a.addEventListener("click", function () {
      Array.prototype.forEach.call(f.tip, function (r) { r.checked = r.value === a.dataset.tip; });
    });
  });

  document.getElementById("swap").addEventListener("click", function () {
    var x = f.de.value; f.de.value = f.la.value; f.la.value = x;
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var de = f.de.value.trim(), la = f.la.value.trim();
    f.de.parentNode.classList.toggle("bad", !de);
    f.la.parentNode.classList.toggle("bad", !la);
    if (!de || !la) { err.hidden = false; (de ? f.la : f.de).focus(); return; }
    err.hidden = true;
    var lines = ["Bună ziua! Aș dori o rezervare.", "", "Cursa: " + f.tip.value, "Traseu: " + de + " → " + la];
    if (f.data.value) lines.push("Data: " + f.data.value.split("-").reverse().join("."));
    if (f.tip.value === "Transport persoane") lines.push("Persoane: " + f.nr.value);
    window.location.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(lines.join("\n"));
  });
})();
