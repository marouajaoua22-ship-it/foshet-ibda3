/* =========================================================
   فُسحة إبداع — Foshet Ibda3
   Application à page unique (SPA) pilotée par les fichiers
   content/*.json (modifiables via Decap CMS : /admin).
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- 0. Fichiers de contenu ---------------- */
  var CONTENT_FILES = ["settings", "pedagogie", "aventure", "plastique", "musique", "mediatheque"];
  var C = {};          // contenu chargé
  var lang = "ar";     // langue courante
  var main = document.getElementById("main");
  // Mode « équipe » uniquement en local (double-clic ou lancer_site.bat) :
  // les visiteurs du site public ne voient aucun outil ni mention d'édition.
  var EDITOR = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);

  /* ---------------- 1. Textes d'interface (AR / FR) ---------------- */
  var UI = {
    home:            { ar: "لوحة القيادة", fr: "Tableau de bord" },
    loading:         { ar: "جارٍ التحميل…", fr: "Chargement…" },
    enter:           { ar: "الدخول", fr: "Entrer" },
    team_partner:    { ar: "الشراكة", fr: "Partenariat" },
    watch_intro:     { ar: "مشاهدة الفيديو التقديمي", fr: "Voir la vidéo de présentation" },
    nav_peda:        { ar: "الإطار البيداغوجي", fr: "Ingénierie" },
    nav_parc:        { ar: "مسار القسم", fr: "Parcours" },
    nav_media:       { ar: "المكتبة", fr: "Médiathèque" },
    tab_plastique:   { ar: "التربية التشكيلية", fr: "Arts plastiques" },
    tab_musique:     { ar: "التربية الموسيقية", fr: "Éducation musicale" },
    tab_aventure:    { ar: "المغامرة الكبرى", fr: "La grande aventure" },
    mode_game:       { ar: "المغامرة التفاعلية (التلاميذ)", fr: "Aventure interactive (élèves)" },
    mode_class:      { ar: "التطبيق والدرس الشاهد في القسم", fr: "Application en classe" },
    station:         { ar: "المحطّة", fr: "Étape" },
    phase:           { ar: "المرحلة", fr: "Phase" },
    step:            { ar: "الخطوة", fr: "Étape" },
    of:              { ar: "من", fr: "sur" },
    next:            { ar: "التالي", fr: "Suivant" },
    prev:            { ar: "السابق", fr: "Précédent" },
    validate:        { ar: "تثبيت الإجابة", fr: "Valider" },
    restart:         { ar: "إعادة المغامرة", fr: "Recommencer" },
    choose_answer:   { ar: "الرجاء اختيار إجابة.", fr: "Veuillez choisir une réponse." },
    confirm_step:    { ar: "إتمام الخطوة وتأكيد المرور", fr: "Valider l'étape" },
    fullscreen:      { ar: "ملء الشاشة", fr: "Plein écran" },
    no_media:        { ar: "لم يُضف رابط بعد", fr: "Aucun lien pour l'instant" },
    no_media_hint:   { ar: "أضِف رابط Google Drive أو YouTube من لوحة التحكم (admin)، أو الصقه هنا لمعاينة مؤقّتة:", fr: "Ajoutez un lien Google Drive ou YouTube depuis l'admin, ou collez-le ici pour un aperçu temporaire :" },
    paste_ph:        { ar: "الصق الرابط هنا…", fr: "Collez le lien ici…" },
    bad_link:        { ar: "الرابط غير صالح (Drive أو YouTube أو ملفّ محلّي)", fr: "Lien non reconnu (Drive, YouTube ou fichier local)" },
    no_image:        { ar: "مكان الصورة — تُضاف من لوحة التحكم", fr: "Emplacement d'image — à ajouter depuis l'admin" },
    soon:            { ar: "قريباً", fr: "Bientôt disponible" },
    lyrics:          { ar: "مقتطف من الكلمات", fr: "Extrait des paroles" },
    psych:           { ar: "البُعد النفسي", fr: "Dimension psychologique" },
    edu:             { ar: "الأثر التربوي", fr: "Impact éducatif" },
    listen:          { ar: "استماع", fr: "Écouter" },
    watch:           { ar: "مشاهدة", fr: "Regarder" },
    videos:          { ar: "فيديوهات", fr: "Vidéos" },
    audios:          { ar: "تسجيلات صوتية", fr: "Audio" },
    images:          { ar: "صور", fr: "Images" },
    documents:       { ar: "وثائق", fr: "Documents" },
    all:             { ar: "الكلّ", fr: "Tout" },
    open:            { ar: "فتح", fr: "Ouvrir" },
    empty_list:      { ar: "لا توجد عناصر في هذا التصنيف.", fr: "Aucun élément dans cette catégorie." },
    lesson_card:     { ar: "البطاقة الرسمية للدرس", fr: "Fiche officielle de la leçon" },
    ml_title:        { ar: "تطبيق Machine Learning (صورة ← بيئة ← موسيقى)", fr: "Application Machine Learning (image → environnement → musique)" },
    ml_upload:       { ar: "رفع لوحة تلميذ", fr: "Importer une œuvre d'élève" },
    ml_demo_tag:     { ar: "محاكاة توضيحية", fr: "Simulation de démonstration" },
    ml_running:      { ar: "جارٍ تحليل اللوحة وتحويلها إلى مفهوم بيئي ومقطع موسيقي…", fr: "Analyse de l'œuvre en cours…" },
    ml_result:       { ar: "النتيجة: تصنيف بيئي (Harmony) ← تمّ توليد مقطع موسيقي.", fr: "Résultat : classe « Harmony » → extrait musical généré." },
    storyboard_hint: { ar: "مرّر أفقياً لاكتشاف المشاهد", fr: "Faites défiler pour découvrir les scènes" },
    admin:           { ar: "لوحة التحكم", fr: "Administration" },
    source_drive:    { ar: "Google Drive", fr: "Google Drive" },
    source_youtube:  { ar: "YouTube", fr: "YouTube" },
    source_local:    { ar: "ملفّ محلّي", fr: "Fichier local" },
    source_none:     { ar: "بدون رابط", fr: "Sans lien" },
    source_pending:  { ar: "Drive — في الانتظار", fr: "Drive — en attente" },
    pending_file:    { ar: "الملفّ الذي يجب رفعه على Drive:", fr: "Fichier à envoyer sur Drive :" },
    pending_doc:     { ar: "في انتظار رابط Drive", fr: "Lien Drive en attente" },
    scene:           { ar: "مشهد", fr: "Scène" },
    lesson:          { ar: "الدرس", fr: "Leçon" },
    back_dash:       { ar: "العودة إلى لوحة القيادة", fr: "Retour au tableau de bord" }
  };
  function t(key) { return (UI[key] && UI[key][lang]) || (UI[key] && UI[key].ar) || key; }
  function tr(obj, field) {
    if (!obj) return "";
    if (lang === "fr" && obj[field + "_fr"]) return obj[field + "_fr"];
    return obj[field] || "";
  }

  /* ---------------- 2. Icônes SVG intégrées (fonctionnent hors ligne) ---------------- */
  var ICONS = {
    spark: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>',
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    play: '<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1.1 0 1.6-.8 1.6-1.6 0-1.3-1-1.4-1-2.6 0-.9.7-1.6 1.6-1.6H16a5 5 0 005-5C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7" r="1.2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    book: '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4z"/><path d="M20 4h-6a3 3 0 00-3 3v13a2 2 0 012-2h7z"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    doc: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0z"/><path d="M17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 016 5"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    restart: '<path d="M3 12a9 9 0 109-9 9 9 0 00-6.4 2.6L3 8"/><path d="M3 3v5h5"/>',
    link: '<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>',
    quote: '<path d="M7 7h4v4c0 3-2 5-4 6M15 7h4v4c0 3-2 5-4 6"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>'
  };
  function icon(name, cls) {
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[name] || "") + "</svg>";
  }
  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (!el.dataset.iconDone) { el.innerHTML = icon(el.dataset.icon); el.dataset.iconDone = "1"; }
    });
  }

  /* ---------------- 3. Utilitaires ---------------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Mini-markdown : **gras**, paragraphes (ligne vide) et retours à la ligne
  function rich(s) {
    if (!s) return "";
    return String(s).split(/\n\s*\n/).map(function (p) {
      return "<p>" + esc(p).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
  }
  // Chemins locaux : encode espaces / lettres arabes, laisse les URL absolues intactes
  function src(path) {
    if (!path) return "";
    if (/^(https?:|data:|blob:)/i.test(path)) return path;
    try { return encodeURI(decodeURI(path)); } catch (e) { return encodeURI(path); }
  }
  function attr(s) { return esc(src(s)); }

  /* ---------------- 4. Médias : Drive (/preview), YouTube, fichiers locaux ---------------- */
  function parseMedia(url) {
    url = (url || "").trim();
    if (!url) return { type: "none" };
    // Emplacement Drive en attente : https://drive.google.com/file/d/FILE_ID/preview#<fichier d'origine>
    if (/\/FILE_ID\//.test(url)) {
      var orig = "";
      try { orig = decodeURIComponent(url.split("#")[1] || ""); } catch (e) { orig = url.split("#")[1] || ""; }
      return { type: "pending", file: orig, audio: /\.(mp3|m4a|wav|ogg)$/i.test(orig) };
    }
    var d = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:.*&)?id=)([\w-]{10,})/) ||
            url.match(/docs\.google\.com\/[^/]+\/d\/([\w-]{10,})/) ||
            url.match(/[?&]id=([\w-]{10,})/);
    if (/drive\.google\.com|docs\.google\.com/.test(url) && d) {
      return { type: "drive", embed: "https://drive.google.com/file/d/" + d[1] + "/preview", audio: /#audio\b/i.test(url) };
    }
    var y = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?(?:.*&)?v=))([\w-]{11})/);
    if (y) return { type: "youtube", embed: "https://www.youtube.com/embed/" + y[1] + "?rel=0" };
    var ext = (url.split("?")[0].split(".").pop() || "").toLowerCase();
    if (["mp4", "webm", "ogv", "mov", "m4v"].indexOf(ext) > -1) return { type: "video", embed: src(url) };
    if (["mp3", "wav", "ogg", "m4a", "aac", "flac"].indexOf(ext) > -1) return { type: "audio", embed: src(url) };
    if (["jpg", "jpeg", "png", "webp", "gif", "svg"].indexOf(ext) > -1) return { type: "image", embed: src(url) };
    if (ext === "pdf") return { type: "pdf", embed: src(url) };
    if (/^https?:/i.test(url)) return { type: "iframe", embed: url };
    return { type: "unknown" };
  }
  function sourceLabel(url) {
    var m = parseMedia(url);
    if (m.type === "drive") return t("source_drive");
    if (m.type === "youtube") return t("source_youtube");
    if (m.type === "none") return t("source_none");
    if (m.type === "pending") return t(EDITOR ? "source_pending" : "soon");
    return t("source_local");
  }
  // Rend le lecteur adapté. opts.title (accessibilité)
  function mediaHTML(url, title) {
    var m = parseMedia(url);
    var ttl = esc(title || "");
    switch (m.type) {
      case "drive":
        return '<div class="media-frame is-drive' + (m.audio ? " is-audio" : "") + '"><iframe src="' + esc(m.embed) + '" title="' + ttl + '" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe><div class="drive-shield" aria-hidden="true"></div></div>';
      case "youtube":
      case "iframe":
        return '<div class="media-frame"><iframe src="' + esc(m.embed) + '" title="' + ttl + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
      case "video":
        return '<div class="media-frame is-video"><video controls preload="metadata" playsinline src="' + esc(m.embed) + '" aria-label="' + ttl + '"></video></div>';
      case "audio":
        return '<div class="media-audio">' + icon("headphones") + '<audio controls preload="none" src="' + esc(m.embed) + '" aria-label="' + ttl + '"></audio></div>';
      case "image":
        return '<div class="media-frame is-image"><img src="' + esc(m.embed) + '" alt="' + ttl + '" loading="lazy"></div>';
      case "pdf":
        return '<div class="media-frame"><iframe src="' + esc(m.embed) + '" title="' + ttl + '"></iframe></div>';
      case "pending":
        return placeholderHTML(title, m.file);
      default:
        return placeholderHTML(title);
    }
  }
  var phCounter = 0;
  function placeholderHTML(title, file) {
    var id = "ph" + (++phCounter);
    if (!EDITOR) {
      return '<div class="media-frame is-empty"><div class="empty-inner">' + icon("film", "ic-lg") +
        "<strong>" + esc(title || "") + "</strong><span>" + esc(t("soon")) + "</span></div></div>";
    }
    return '<div class="media-frame is-empty" id="' + id + '">' +
      '<div class="empty-inner">' + icon("film", "ic-lg") +
      '<strong>' + esc(title || t("no_media")) + '</strong>' +
      (file ? '<span class="pending-file">' + esc(t("pending_file")) + ' <code dir="ltr">' + esc(file) + "</code></span>" : "") +
      '<span>' + esc(t("no_media_hint")) + '</span>' +
      '<input type="url" class="paste-input" data-target="' + id + '" placeholder="' + esc(t("paste_ph")) + '" aria-label="' + esc(t("paste_ph")) + '" dir="ltr">' +
      '</div></div>';
  }
  // Aperçu temporaire d'un lien collé
  document.addEventListener("change", function (e) {
    var input = e.target.closest && e.target.closest(".paste-input");
    if (!input) return;
    var box = document.getElementById(input.dataset.target);
    var m = parseMedia(input.value);
    if (!box) return;
    if (m.type === "none" || m.type === "unknown") {
      input.setCustomValidity(t("bad_link")); input.reportValidity(); return;
    }
    input.setCustomValidity("");
    var wrap = document.createElement("div");
    wrap.innerHTML = mediaHTML(input.value, "");
    box.replaceWith(wrap.firstChild);
  });

  function imgHTML(path, alt, cls) {
    if (!path) return '<div class="img-empty ' + (cls || "") + '">' + icon("image", "ic-lg") + "<span>" + esc(t(EDITOR ? "no_image" : "soon")) + "</span></div>";
    return '<button type="button" class="zoomable ' + (cls || "") + '" data-zoom="' + attr(path) + '" data-caption="' + esc(alt || "") + '">' +
      '<img src="' + attr(path) + '" alt="' + esc(alt || "") + '" loading="lazy" data-fallback>' +
      "</button>";
  }
  // Image manquante → emplacement propre
  document.addEventListener("error", function (e) {
    var img = e.target;
    if (img.tagName !== "IMG" || !img.hasAttribute("data-fallback")) return;
    var host = img.closest(".zoomable") || img;
    var div = document.createElement("div");
    div.className = "img-empty " + (host.className || "").replace("zoomable", "");
    div.innerHTML = icon("image", "ic-lg") + "<span>" + esc(t(EDITOR ? "no_image" : "soon")) + "</span>" +
      (EDITOR ? "<code dir=\"ltr\">" + esc(decodeURI(img.getAttribute("src") || "")) + "</code>" : "");
    host.replaceWith(div);
  }, true);

  /* ---------------- 5. Dialogues (lightbox + lecteur) ---------------- */
  var lightbox = document.getElementById("lightbox");
  var player = document.getElementById("player");
  function setupDialog(dlg, onClose) {
    dlg.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { dlg.close(); return; }
      // Repli light-dismiss pour les navigateurs sans "closedby"
      if (!("closedBy" in HTMLDialogElement.prototype) && e.target === dlg) {
        var r = dlg.getBoundingClientRect();
        var inside = r.top <= e.clientY && e.clientY <= r.bottom && r.left <= e.clientX && e.clientX <= r.right;
        if (!inside) dlg.close();
      }
    });
    if (onClose) dlg.addEventListener("close", onClose);
  }
  setupDialog(lightbox);
  setupDialog(player, function () { document.getElementById("playerBody").innerHTML = ""; });

  function openLightbox(path, caption) {
    document.getElementById("lightboxImg").src = path;
    document.getElementById("lightboxImg").alt = caption || "";
    document.getElementById("lightboxCaption").textContent = caption || "";
    lightbox.showModal();
  }
  function openPlayer(url, title) {
    document.getElementById("playerTitle").textContent = title || "";
    document.getElementById("playerBody").innerHTML = mediaHTML(url, title);
    player.showModal();
  }
  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zoom]");
    if (z) { openLightbox(z.dataset.zoom, z.dataset.caption); return; }
    var p = e.target.closest("[data-play]");
    if (p) { openPlayer(p.dataset.play, p.dataset.title); return; }
    var fs = e.target.closest("[data-fullscreen]");
    if (fs) {
      var target = document.getElementById(fs.dataset.fullscreen);
      var el = target && (target.querySelector("video, iframe") || target);
      if (el && el.requestFullscreen) el.requestFullscreen().catch(function () {});
    }
  });

  /* ---------------- 6. Langue ---------------- */
  function applyLang(l) {
    lang = l === "fr" ? "fr" : "ar";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.dataset.lang = lang;
    document.getElementById("langLabel").textContent = lang === "ar" ? "FR" : "عربي";
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    try { localStorage.setItem("foshet-lang", lang); } catch (e) {}
  }
  document.getElementById("langBtn").addEventListener("click", function () {
    applyLang(lang === "ar" ? "fr" : "ar");
    renderChrome();
    render(false);
  });

  /* ---------------- 7. En-tête & pied de page ---------------- */
  function renderChrome() {
    var s = C.settings || {};
    document.getElementById("brandTitle").textContent = lang === "fr" ? (s.site_title_fr || s.site_title) : s.site_title;
    document.getElementById("brandSub").textContent = lang === "fr" ? s.site_title : (s.site_title_fr || "");
    document.title = (s.site_title || "") + " — " + (s.site_title_fr || "");
    var links = [
      ["#/pedagogie", "nav_peda", "pedagogie"],
      ["#/parcours", "nav_parc", "parcours"],
      ["#/mediatheque", "nav_media", "mediatheque"]
    ];
    document.getElementById("topnav").innerHTML = links.map(function (l) {
      return '<a href="' + l[0] + '" data-route="' + l[2] + '">' + esc(t(l[1])) + "</a>";
    }).join("");
    var adminLink = (EDITOR && location.protocol.indexOf("http") === 0) ? ' • <a href="admin/">' + esc(t("admin")) + "</a>" : "";
    document.getElementById("footer").innerHTML = "<p>" + esc(tr(s, "footer")) + adminLink + "</p>";
  }

  /* ---------------- 8. Pages ---------------- */
  function pageHead(kicker, title, intro, tone, iconName) {
    return '<header class="page-head tone-' + tone + '">' +
      '<a class="back-link" href="#/">' + icon("arrow", "flip") + esc(t("back_dash")) + "</a>" +
      '<p class="kicker">' + icon(iconName) + esc(kicker) + "</p>" +
      '<h1 tabindex="-1" class="page-title">' + esc(title) + "</h1>" +
      (intro ? '<div class="lead">' + rich(intro) + "</div>" : "") +
      "</header>";
  }

  /* ----- 8.1 Tableau de bord ----- */
  function viewDashboard() {
    var s = C.settings;
    var heroImg = s.hero_image ? ' style="--hero:url(\'' + attr(s.hero_image) + '\')"' : "";
    var team = (s.team || []).map(function (m) {
      var tone = m.subject === "plastique" ? "art" : "music";
      var avatar = m.photo
        ? '<img src="' + attr(m.photo) + '" alt="" loading="lazy">'
        : icon(tone === "art" ? "palette" : "music");
      return '<li class="member tone-' + tone + '">' +
        '<span class="avatar">' + avatar + "</span>" +
        '<span class="member-text"><strong>' + esc(tr(m, "name")) + "</strong>" +
        '<span class="role">' + esc(tr(m, "role")) + "</span>" +
        '<span class="school">' + esc(tr(m, "school")) + "</span></span></li>";
    }).join("");
    var insp = (s.inspectors || []).filter(function (i) { return i.name; }).map(function (i) {
      return "<li><strong>" + esc(tr(i, "name")) + "</strong> — " + esc(tr(i, "role")) + "</li>";
    }).join("");
    var cards = [
      ["pedagogie", s.card_pedagogie, "peda", "book"],
      ["parcours", s.card_parcours, "parc", "compass"],
      ["mediatheque", s.card_mediatheque, "media", "film"]
    ].map(function (c, i) {
      var d = c[1] || {};
      return '<a class="space-card tone-' + c[2] + '" href="#/' + c[0] + '">' +
        '<span class="space-media">' + (d.image ? '<img src="' + attr(d.image) + '" alt="" loading="lazy" data-fallback>' : "") +
        '<span class="space-num">0' + (i + 1) + "</span></span>" +
        '<span class="space-body">' +
        '<span class="space-label">' + icon(c[3]) + esc(d.label || "") + "</span>" +
        "<h2>" + esc(tr(d, "title")) + "</h2>" +
        "<p>" + esc(tr(d, "description")) + "</p>" +
        '<span class="space-cta">' + esc(t("enter")) + icon("arrow", "dir") + "</span>" +
        "</span></a>";
    }).join("");

    return '<section class="hero"' + heroImg + ">" +
      '<div class="hero-inner">' +
      '<p class="partner-badge">' + icon("users") + esc(tr(s, "partnership")) + "</p>" +
      '<h1 tabindex="-1" class="page-title hero-title"><span>' + esc(s.site_title) + '</span><span class="sep" aria-hidden="true">/</span><span lang="fr" dir="ltr">' + esc(s.site_title_fr) + "</span></h1>" +
      '<p class="hero-tagline">' + esc(tr(s, "tagline")) + "</p>" +
      '<p class="hero-desc">' + esc(tr(s, "description")) + "</p>" +
      (s.hero_video ? '<button type="button" class="btn btn-light" data-play="' + esc(s.hero_video) + '" data-title="' + esc(tr(s, "hero_video_title")) + '">' + icon("play") + esc(t("watch_intro")) + "</button>" : "") +
      "</div></section>" +

      '<section class="team-strip" aria-labelledby="teamTitle">' +
      '<h2 id="teamTitle" class="eyebrow">' + esc(tr(s, "team_title")) + "</h2>" +
      '<ul class="team">' + team + "</ul>" +
      (insp ? '<div class="inspectors"><span>' + esc(tr(s, "supervision_label")) + ":</span><ul>" + insp + "</ul></div>" : "") +
      "</section>" +

      '<section class="spaces" aria-label="' + esc(t("home")) + '">' + cards + "</section>";
  }

  /* ----- 8.2 Ingénierie pédagogique ----- */
  function viewPedagogie() {
    var p = C.pedagogie;
    var s = C.settings.card_pedagogie || {};
    var sections = (p.sections || []).map(function (sec, i) {
      return '<article class="split ' + (i % 2 ? "reverse" : "") + '">' +
        '<div class="split-text"><h2>' + esc(tr(sec, "title")) + "</h2>" + rich(tr(sec, "text")) + "</div>" +
        '<figure class="split-media">' + imgHTML(sec.image, sec.image_caption) +
        (sec.image_caption ? "<figcaption>" + esc(sec.image_caption) + "</figcaption>" : "") + "</figure>" +
        "</article>";
    }).join("");

    var trans = (p.transformation || []).map(function (st, i) {
      return '<li style="--i:' + i + '"><span class="t-num">' + (i + 1) + '</span><strong>' + esc(tr(st, "stage")) + "</strong><span>" + esc(tr(st, "text")) + "</span></li>";
    }).join("");

    var theory = (p.theory || []).map(function (th) {
      return '<article class="note-card"><h3>' + esc(tr(th, "title")) + "</h3>" + rich(tr(th, "text")) + "</article>";
    }).join("");

    var stats = (p.stats || []).map(function (st) {
      return '<div class="stat tone-' + esc(st.tone || "violet") + '"><span class="stat-value" dir="ltr">' + esc(st.value) + '</span><span class="stat-label">' + esc(tr(st, "label")) + "</span></div>";
    }).join("");

    var songs = (p.songs || []).map(function (sg, i) {
      var actions = "";
      if (sg.video) actions += '<button type="button" class="btn btn-sm" data-play="' + esc(sg.video) + '" data-title="' + esc(sg.title) + '">' + icon("play") + esc(t("watch")) + "</button>";
      return '<details class="song">' +
        '<summary><span class="song-num">' + (i + 1) + '</span><span class="song-head"><strong>' + esc(sg.title) + "</strong>" +
        (sg.stage ? '<span class="chip">' + esc(sg.stage) + "</span>" : "") + "</span>" + icon("chevron", "chev") + "</summary>" +
        '<div class="song-body">' +
        '<div class="song-grid">' +
        '<div class="song-main">' +
        (sg.lyrics ? '<blockquote class="lyrics"><span class="mini-label">' + esc(t("lyrics")) + "</span>" + inline(sg.lyrics) + "</blockquote>" : "") +
        '<div class="dims">' +
        (sg.psych ? '<div class="dim"><h4>' + esc(t("psych")) + "</h4><p>" + inline(sg.psych) + "</p></div>" : "") +
        (sg.edu ? '<div class="dim"><h4>' + esc(t("edu")) + "</h4><p>" + inline(sg.edu) + "</p></div>" : "") +
        "</div>" +
        (sg.audio ? mediaHTML(sg.audio, sg.title) : "") +
        (actions ? '<div class="row-actions">' + actions + "</div>" : "") +
        "</div>" +
        (sg.image ? '<div class="song-side">' + imgHTML(sg.image, sg.title) + "</div>" : "") +
        "</div></div></details>";
    }).join("");

    var res = (p.resources || []).map(function (r) {
      return '<figure class="tile">' + imgHTML(r.image, r.caption) + (r.caption ? "<figcaption>" + esc(r.caption) + "</figcaption>" : "") + "</figure>";
    }).join("");

    return pageHead(s.label || "Ingénierie Pédagogique", tr(p, "title"), tr(p, "intro"), "peda", "book") +
      '<div class="page-body">' +
      sections +
      (trans ? '<section class="block"><h2 class="block-title">' + esc(tr(p, "transformation_title")) + '</h2><ol class="transformation">' + trans + "</ol></section>" : "") +
      (theory ? '<section class="block"><div class="note-grid">' + theory + "</div></section>" : "") +
      (stats ? '<section class="block stats-block"><h2 class="block-title">' + esc(tr(p, "stats_title")) + '</h2><div class="stats">' + stats + "</div></section>" : "") +
      (songs ? '<section class="block"><h2 class="block-title">' + esc(tr(p, "songs_title")) + '</h2><div class="songs">' + songs + "</div></section>" : "") +
      (res ? '<section class="block"><h2 class="block-title">' + esc(tr(p, "resources_title")) + '</h2><div class="tiles">' + res + "</div></section>" : "") +
      "</div>";
  }

  /* ----- 8.3 Parcours en classe ----- */
  var parcoursState = { tab: "plastique", lesson: { plastique: 0, musique: 0 }, mode: "game", station: 0, substep: 0, classPhase: 0, step: {} };

  function viewParcours(sub) {
    if (["plastique", "musique", "aventure"].indexOf(sub) > -1) parcoursState.tab = sub;
    var s = C.settings.card_parcours || {};
    var tabs = [
      ["plastique", "tab_plastique", "palette", "art"],
      ["musique", "tab_musique", "music", "music"],
      ["aventure", "tab_aventure", "compass", "adv"]
    ].map(function (tb) {
      var on = parcoursState.tab === tb[0];
      return '<a class="tab tone-' + tb[3] + (on ? " is-on" : "") + '" href="#/parcours/' + tb[0] + '"' + (on ? ' aria-current="page"' : "") + ">" + icon(tb[2]) + "<span>" + esc(t(tb[1])) + "</span></a>";
    }).join("");
    var body = parcoursState.tab === "aventure" ? viewAventure() : viewSubject(parcoursState.tab);
    return pageHead(s.label || "Parcours en Classe", tr(s, "title"), tr(s, "description"), "parc", "compass") +
      '<div class="page-body"><nav class="tabs" aria-label="' + esc(tr(s, "title")) + '">' + tabs + "</nav>" +
      '<div id="parcoursBody">' + body + "</div></div>";
  }

  function viewSubject(key) {
    var d = C[key];
    var tone = key === "plastique" ? "art" : "music";
    var idx = Math.min(parcoursState.lesson[key] || 0, (d.lessons || []).length - 1);
    var lessonTabs = (d.lessons || []).length > 1 ? '<div class="pills" role="group">' + d.lessons.map(function (l, i) {
      return '<button type="button" class="pill' + (i === idx ? " is-on" : "") + '" aria-pressed="' + (i === idx) + '" data-lesson="' + key + ":" + i + '">' + esc(l.badge || (t("lesson") + " " + (i + 1))) + "</button>";
    }).join("") + "</div>" : "";
    return '<section class="subject tone-' + tone + '">' +
      '<div class="subject-head">' +
      '<div><h2 class="subject-title">' + icon(tone === "art" ? "palette" : "music") + esc(tr(d, "title")) + "</h2>" + rich(tr(d, "intro")) + "</div>" +
      (d.cover_image ? '<div class="subject-cover">' + imgHTML(d.cover_image, tr(d, "title")) + "</div>" : "") +
      "</div>" + lessonTabs +
      (d.lessons && d.lessons.length ? viewLesson(d.lessons[idx], key + "-" + idx) : "") +
      "</section>";
  }

  function viewLesson(L, uid) {
    var out = '<article class="lesson">';
    out += '<header class="lesson-head"><span class="chip strong">' + esc(L.badge) + "</span><h3>" + esc(L.title) + "</h3>" +
      (L.credits ? '<p class="credits">' + esc(L.credits) + "</p>" : "") + (L.description ? rich(L.description) : "") + "</header>";

    out += '<figure class="fiche"><figcaption class="mini-label">' + esc(L.fiche_caption || t("lesson_card")) + "</figcaption>" + imgHTML(L.fiche_image, L.fiche_caption, "fiche-img") + "</figure>";

    if (L.supports && L.supports.length) {
      out += '<section class="block"><h4 class="block-title sm">' + esc(L.supports_title || "") + '</h4><div class="tiles">' +
        L.supports.map(function (sp) {
          return '<figure class="tile"><h5>' + esc(sp.title) + "</h5>" + imgHTML(sp.image, sp.caption || sp.title) + (sp.caption ? "<figcaption>" + esc(sp.caption) + "</figcaption>" : "") + "</figure>";
        }).join("") + "</div></section>";
    }
    if (L.dimensions && L.dimensions.length) {
      out += '<section class="block"><h4 class="block-title sm">' + esc(L.dimensions_title || "") + '</h4><div class="dim-grid">' +
        L.dimensions.map(function (dm, i) {
          return '<div class="dim-card"><span class="dim-n">' + (i + 1) + "</span><h5>" + esc(dm.title) + "</h5><p>" + inline(dm.text) + "</p></div>";
        }).join("") + "</div></section>";
    }
    if (L.steps && L.steps.length) {
      out += '<section class="block"><h4 class="block-title sm">' + esc(L.steps_title || "") + "</h4>" + stepper(L.steps, uid) + "</section>";
    }
    if (L.videos && L.videos.length) {
      out += '<section class="block"><h4 class="block-title sm">' + esc(L.videos_title || "") + '</h4><div class="video-grid">' +
        L.videos.map(function (v) {
          return '<article class="video-card"><h5>' + esc(v.title) + "</h5>" + mediaHTML(v.url, v.title) + (v.description ? "<p>" + inline(v.description) + "</p>" : "") + "</article>";
        }).join("") + "</div></section>";
    }
    if (L.ml_demo || L.ml_app_url) {
      out += '<section class="block ml-block"><h4 class="block-title sm">' + icon("cpu") + esc(t("ml_title")) + "</h4>" +
        '<div class="ml-grid">' +
        (L.ml_image ? '<div>' + imgHTML(L.ml_image, "Symphonie Kusama") + "</div>" : "") +
        "<div>" + (L.ml_app_url ? mediaHTML(L.ml_app_url, t("ml_title")) :
          '<div class="ml-demo"><span class="chip">' + esc(t("ml_demo_tag")) + "</span>" +
          '<label class="btn">' + icon("upload") + esc(t("ml_upload")) + '<input type="file" accept="image/*" class="visually-hidden" data-ml></label>' +
          '<p class="ml-result" aria-live="polite"></p></div>') +
        "</div></div></section>";
    }
    return out + "</article>";
  }

  // Stepper générique (étapes de leçon)
  function stepper(steps, uid) {
    var cur = Math.min(parcoursState.step[uid] || 0, steps.length - 1);
    var st = steps[cur];
    var dots = steps.map(function (s, i) {
      return '<li><button type="button" class="dot' + (i === cur ? " is-on" : i < cur ? " is-done" : "") + '" data-step="' + uid + ":" + i + '" aria-label="' + esc(t("step") + " " + (i + 1) + " — " + s.title) + '"' + (i === cur ? ' aria-current="step"' : "") + ">" + (i + 1) + "</button></li>";
    }).join("");
    var mediaId = "stepmedia-" + uid;
    var hasVideo = !!st.video;
    return '<div class="stepper" data-uid="' + uid + '">' +
      '<ol class="dots">' + dots + "</ol>" +
      '<div class="step-panel">' +
      '<p class="mini-label">' + esc(t("step") + " " + (cur + 1) + " " + t("of") + " " + steps.length) + "</p>" +
      "<h5>" + esc(st.title) + "</h5>" +
      '<div class="step-grid' + (hasVideo || st.image ? "" : " single") + '">' +
      '<div class="step-text">' + rich(st.text) +
      (st.tips && st.tips.length ? '<ul class="tips">' + st.tips.map(function (tp) { return "<li><strong>" + esc(tp.title) + "</strong><span>" + inline(tp.text) + "</span></li>"; }).join("") + "</ul>" : "") +
      "</div>" +
      (hasVideo || st.image ? '<div class="step-media" id="' + mediaId + '">' + (hasVideo ? mediaHTML(st.video, st.title) : "") + (st.image ? imgHTML(st.image, st.title) : "") +
        (hasVideo ? '<button type="button" class="link-btn" data-fullscreen="' + mediaId + '">' + icon("expand") + esc(t("fullscreen")) + "</button>" : "") + "</div>" : "") +
      "</div>" +
      '<div class="step-nav">' +
      '<button type="button" class="btn btn-ghost" data-step="' + uid + ":" + (cur - 1) + '"' + (cur === 0 ? " disabled" : "") + ">" + icon("arrow", "flip") + esc(t("prev")) + "</button>" +
      '<button type="button" class="btn" data-step="' + uid + ":" + (cur + 1) + '"' + (cur === steps.length - 1 ? " disabled" : "") + ">" + esc(t("next")) + icon("arrow", "dir") + "</button>" +
      "</div></div></div>";
  }

  /* ----- 8.4 L'aventure ----- */
  function viewAventure() {
    var a = C.aventure;
    var modeBtns = '<div class="seg" role="group">' +
      '<button type="button" data-mode="game" aria-pressed="' + (parcoursState.mode === "game") + '">' + icon("compass") + esc(t("mode_game")) + "</button>" +
      '<button type="button" data-mode="class" aria-pressed="' + (parcoursState.mode === "class") + '">' + icon("film") + esc(t("mode_class")) + "</button></div>";
    var story = (a.storyboard || []).length ? '<section class="block"><h4 class="block-title sm">' + esc(a.storyboard_title || "") + '</h4><p class="hint">' + esc(t("storyboard_hint")) + '</p><ol class="storyboard">' +
      a.storyboard.map(function (f, i) {
        return '<li><figure>' + imgHTML(f.image, f.caption || (t("scene") + " " + (i + 1))) + "<figcaption><span>" + (i + 1) + "</span>" + esc(f.caption || "") + "</figcaption></figure></li>";
      }).join("") + "</ol></section>" : "";
    var playlist = (a.playlist || []).length ? '<section class="block"><h4 class="block-title sm">' + esc(a.playlist_title || "") + '</h4><div class="media-list">' +
      a.playlist.map(function (v) { return mediaCard(v); }).join("") + "</div></section>" : "";

    return '<section class="subject tone-adv"><div class="subject-head"><div>' +
      '<span class="chip strong">' + esc(a.badge || "") + "</span>" +
      '<h2 class="subject-title">' + icon("compass") + esc(tr(a, "title")) + "</h2>" + rich(tr(a, "intro")) + "</div></div>" +
      modeBtns +
      '<div class="adventure">' + (parcoursState.mode === "game" ? viewGame(a) : viewClass(a)) + "</div>" +
      story + playlist + "</section>";
  }

  function viewGame(a) {
    var stations = a.stations || [];
    var cur = Math.min(parcoursState.station, stations.length - 1);
    var S = stations[cur];
    var dots = stations.map(function (s, i) {
      return '<li><button type="button" class="dot' + (i === cur ? " is-on" : i < cur ? " is-done" : "") + '" data-station="' + i + '" aria-label="' + esc(t("station") + " " + (i + 1)) + '"' + (i === cur ? ' aria-current="step"' : "") + ">" + (i + 1) + "</button></li>";
    }).join("");
    var head = '<div class="adv-bar"><span class="mini-label">' + esc(t("station") + " " + (cur + 1) + " " + t("of") + " " + stations.length) + '</span><ol class="dots">' + dots + "</ol></div>";
    var body = '<div class="station kind-' + esc(S.kind) + '">';

    if (S.kind === "final") {
      body += '<div class="final">' + icon("trophy", "ic-xl") + "<h3>" + esc(S.title) + "</h3>" + rich(S.text) +
        '<button type="button" class="btn btn-light" data-station="0">' + icon("restart") + esc(t("restart")) + "</button></div>";
    } else {
      body += "<h3>" + esc(S.title) + "</h3>" + rich(S.text);
      if (S.video || S.kind === "video") body += '<div id="station-media">' + mediaHTML(S.video, S.title) + '</div><button type="button" class="link-btn" data-fullscreen="station-media">' + icon("expand") + esc(t("fullscreen")) + "</button>";
      if (S.quote) body += '<blockquote class="quote">' + icon("quote") + "<p>" + inline(S.quote) + "</p></blockquote>";
      if (S.kind === "steps" && S.substeps && S.substeps.length) body += substepper(S.substeps, cur, stations.length);
      if (S.kind === "quiz" && S.quiz && S.quiz.options && S.quiz.options.length) {
        body += '<form class="quiz" data-quiz="' + cur + '"><fieldset><legend>' + esc(S.quiz.question) + "</legend>" +
          S.quiz.options.map(function (o, i) {
            return '<label class="opt"><input type="radio" name="q' + cur + '" value="' + i + '"><span>' + esc(o.label) + "</span></label>";
          }).join("") + '</fieldset><p class="feedback" aria-live="polite"></p>' +
          '<div class="step-nav"><button type="button" class="btn btn-ghost" data-station="' + (cur - 1) + '">' + icon("arrow", "flip") + esc(t("prev")) + '</button><button type="submit" class="btn">' + esc(t("validate")) + icon("check") + "</button></div></form>";
      }
      if (S.kind === "video" || (S.kind !== "steps" && S.kind !== "quiz")) {
        body += '<div class="step-nav">' + (cur > 0 ? '<button type="button" class="btn btn-ghost" data-station="' + (cur - 1) + '">' + icon("arrow", "flip") + esc(t("prev")) + "</button>" : "<span></span>") +
          '<button type="button" class="btn" data-station="' + (cur + 1) + '">' + esc(S.next_label || t("next")) + icon("arrow", "dir") + "</button></div>";
      }
    }
    return head + body + "</div>";
  }

  function substepper(subs, stationIdx, total) {
    var cur = Math.min(parcoursState.substep, subs.length - 1);
    var s = subs[cur];
    var dots = subs.map(function (x, i) {
      return '<li><span class="dot sm' + (i === cur ? " is-on" : i < cur ? " is-done" : "") + '">' + (i + 1) + "</span></li>";
    }).join("");
    var last = cur === subs.length - 1;
    var mid = "substep-media";
    var media = (s.video ? mediaHTML(s.video, s.title) : "") + (s.images || []).map(function (im) { return imgHTML(im.image, im.caption); }).join("");
    return '<div class="substeps"><div class="adv-bar sub"><span class="mini-label">' + esc(t("step") + " " + (cur + 1) + " " + t("of") + " " + subs.length) + '</span><ol class="dots">' + dots + "</ol></div>" +
      '<div class="substep"><h4>' + esc(s.title) + "</h4>" +
      '<div class="step-grid' + (media ? "" : " single") + '"><div class="step-text">' + rich(s.text) +
      ((s.tips || []).length ? '<ul class="tips">' + s.tips.map(function (tp) { return "<li><strong>" + esc(tp.title) + "</strong><span>" + inline(tp.text) + "</span></li>"; }).join("") + "</ul>" : "") +
      "</div>" + (media ? '<div class="step-media" id="' + mid + '">' + media + "</div>" : "") + "</div>" +
      '<p class="feedback ok" id="subFeedback" aria-live="polite" hidden>' + icon("check") + "<span>" + esc(s.success || "") + "</span></p>" +
      '<div class="step-nav">' +
      '<button type="button" class="btn btn-ghost" ' + (cur === 0 ? 'data-station="' + (stationIdx - 1) + '"' : 'data-substep="' + (cur - 1) + '"') + ">" + icon("arrow", "flip") + esc(t("prev")) + "</button>" +
      '<button type="button" class="btn" data-subadvance="' + cur + '" data-last="' + last + '" data-nextstation="' + (stationIdx + 1) + '">' + esc(last ? (C.aventure.stations[stationIdx].next_label || t("next")) : t("confirm_step")) + icon("arrow", "dir") + "</button>" +
      "</div></div></div>";
  }

  function viewClass(a) {
    var ph = a.class_phases || [];
    var cur = Math.min(parcoursState.classPhase, ph.length - 1);
    var P = ph[cur];
    var dots = ph.map(function (s, i) {
      return '<li><button type="button" class="dot' + (i === cur ? " is-on" : i < cur ? " is-done" : "") + '" data-phase="' + i + '" aria-label="' + esc(t("phase") + " " + (i + 1)) + '">' + (i + 1) + "</button></li>";
    }).join("");
    return '<div class="adv-bar"><span class="mini-label">' + esc((a.class_title || "") + " — " + t("phase") + " " + (cur + 1) + " " + t("of") + " " + ph.length) + '</span><ol class="dots">' + dots + "</ol></div>" +
      '<div class="station tone-' + (P.subject === "plastique" ? "art" : P.subject === "musique" ? "music" : "adv") + '">' +
      '<span class="chip">' + esc(P.badge) + "</span><h3>" + esc(P.title) + "</h3>" +
      '<div id="phase-media">' + mediaHTML(P.video, P.title) + "</div>" +
      (P.video ? '<button type="button" class="link-btn" data-fullscreen="phase-media">' + icon("expand") + esc(t("fullscreen")) + "</button>" : "") +
      rich(P.text) +
      '<div class="step-nav"><button type="button" class="btn btn-ghost" data-phase="' + (cur - 1) + '"' + (cur === 0 ? " disabled" : "") + ">" + icon("arrow", "flip") + esc(t("prev")) + "</button>" +
      '<button type="button" class="btn" data-phase="' + (cur + 1 >= ph.length ? 0 : cur + 1) + '">' + esc(cur + 1 >= ph.length ? t("restart") : t("next")) + icon(cur + 1 >= ph.length ? "restart" : "arrow", "dir") + "</button></div></div>";
  }

  /* ----- 8.5 Médiathèque ----- */
  var mediaState = { tab: "videos", cat: "all" };
  function mediaCard(v) {
    var m = parseMedia(v.url);
    var kind = (m.type === "audio" || m.audio) ? "headphones" : "play";
    var disabled = m.type === "none" || m.type === "pending";
    return '<article class="m-card">' +
      '<button type="button" class="m-thumb src-' + m.type + (m.audio ? " src-audio" : "") + '"' + (disabled ? " disabled" : ' data-play="' + esc(v.url) + '" data-title="' + esc(v.title) + '"') + ' aria-label="' + esc(t(m.type === "pending" ? "pending_doc" : disabled ? "no_media" : "watch") + " — " + v.title) + '">' +
      '<span class="m-play">' + icon(kind) + "</span>" +
      '<span class="m-src">' + esc(sourceLabel(v.url)) + "</span></button>" +
      '<div class="m-body"><h5>' + esc(v.title) + "</h5>" + (v.description ? "<p>" + inline(v.description) + "</p>" : "") +
      (EDITOR && m.type === "pending" && m.file ? '<p class="pending-file"><code dir="ltr">' + esc(m.file) + "</code></p>" : "") + "</div></article>";
  }
  function viewMediatheque() {
    var M = C.mediatheque;
    var s = C.settings.card_mediatheque || {};
    var tabs = [["videos", "film"], ["audios", "headphones"], ["images", "image"], ["documents", "doc"]].map(function (tb) {
      var n = (M[tb[0]] || []).length;
      var on = mediaState.tab === tb[0];
      return '<button type="button" class="tab' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-mtab="' + tb[0] + '">' + icon(tb[1]) + "<span>" + esc(t(tb[0])) + '</span><span class="count">' + n + "</span></button>";
    }).join("");
    var cats = [{ key: "all", label: t("all"), label_fr: t("all") }].concat(M.categories || []);
    var chips = '<div class="pills" role="group">' + cats.map(function (c) {
      var on = mediaState.cat === c.key;
      return '<button type="button" class="pill' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-mcat="' + esc(c.key) + '">' + esc(tr(c, "label")) + "</button>";
    }).join("") + "</div>";
    var items = (M[mediaState.tab] || []).filter(function (it) { return mediaState.cat === "all" || it.category === mediaState.cat; });
    var list;
    if (!items.length) list = '<p class="empty-note">' + esc(t("empty_list")) + "</p>";
    else if (mediaState.tab === "videos") list = '<div class="media-list">' + items.map(mediaCard).join("") + "</div>";
    else if (mediaState.tab === "audios") list = '<div class="audio-list">' + items.map(function (a) {
      return '<article class="audio-item"><h5>' + esc(a.title) + "</h5>" + mediaHTML(a.url, a.title) + "</article>";
    }).join("") + "</div>";
    else if (mediaState.tab === "images") list = '<div class="gallery">' + items.map(function (im) {
      return '<figure>' + imgHTML(im.image, im.caption) + (im.caption ? "<figcaption>" + esc(im.caption) + "</figcaption>" : "") + "</figure>";
    }).join("") + "</div>";
    else list = '<ul class="doc-list">' + items.map(function (d) {
      return '<li><span class="doc-ic">' + icon("doc") + '</span><span class="doc-text"><strong>' + esc(d.title) + "</strong>" + (d.description ? "<span>" + esc(d.description) + "</span>" : "") +
        "</span>" + (parseMedia(d.url).type === "pending" || !d.url
          ? '<span class="chip">' + esc(t("pending_doc")) + "</span>"
          : '<a class="btn btn-sm" href="' + attr(String(d.url).replace(/\/preview(#.*)?$/, "/view")) + '" target="_blank" rel="noopener">' + esc(t("open")) + icon("link") + "</a>") + "</li>";
    }).join("") + "</ul>";

    return pageHead(s.label || "Médiathèque", tr(M, "title"), tr(M, "intro"), "media", "film") +
      '<div class="page-body"><div class="tabs">' + tabs + "</div>" + chips + '<div id="mediaList">' + list + "</div></div>";
  }

  /* ---------------- 9. Interactions déléguées ---------------- */
  main.addEventListener("click", function (e) {
    var b;
    if ((b = e.target.closest("[data-lesson]"))) {
      var p = b.dataset.lesson.split(":"); parcoursState.lesson[p[0]] = +p[1]; rerenderPart(); return;
    }
    if ((b = e.target.closest("[data-step]"))) {
      var q = b.dataset.step.split(":"); parcoursState.step[q[0]] = Math.max(0, +q[1]); rerenderPart(b.closest(".stepper")); return;
    }
    if ((b = e.target.closest("[data-mode]"))) { parcoursState.mode = b.dataset.mode; rerenderPart(); return; }
    if ((b = e.target.closest("[data-station]"))) {
      var n = +b.dataset.station; if (n < 0) return;
      parcoursState.station = n; parcoursState.substep = 0; rerenderPart(document.querySelector(".adventure")); return;
    }
    if ((b = e.target.closest("[data-substep]"))) { parcoursState.substep = Math.max(0, +b.dataset.substep); rerenderPart(document.querySelector(".adventure")); return; }
    if ((b = e.target.closest("[data-subadvance]"))) {
      var fb = document.getElementById("subFeedback");
      var cur = +b.dataset.subadvance, last = b.dataset.last === "true", nxt = +b.dataset.nextstation;
      b.disabled = true;
      if (fb && fb.textContent.trim()) fb.hidden = false;
      setTimeout(function () {
        if (last) { parcoursState.station = nxt; parcoursState.substep = 0; }
        else parcoursState.substep = cur + 1;
        rerenderPart(document.querySelector(".adventure"));
      }, fb && fb.textContent.trim() ? 900 : 0);
      return;
    }
    if ((b = e.target.closest("[data-phase]"))) {
      var ph = +b.dataset.phase; if (ph < 0) return; parcoursState.classPhase = ph; rerenderPart(document.querySelector(".adventure")); return;
    }
    if ((b = e.target.closest("[data-mtab]"))) { mediaState.tab = b.dataset.mtab; render(false); return; }
    if ((b = e.target.closest("[data-mcat]"))) { mediaState.cat = b.dataset.mcat; render(false); return; }
  });

  main.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-quiz]");
    if (!form) return;
    e.preventDefault();
    var S = C.aventure.stations[+form.dataset.quiz];
    var sel = form.querySelector("input:checked");
    var fb = form.querySelector(".feedback");
    if (!sel) { fb.className = "feedback warn"; fb.textContent = t("choose_answer"); return; }
    var ok = S.quiz.options[+sel.value].correct;
    fb.className = "feedback " + (ok ? "ok" : "ko");
    fb.textContent = ok ? (S.quiz.success || "✓") : (S.quiz.error || "✗");
    if (ok) setTimeout(function () { parcoursState.station = +form.dataset.quiz + 1; rerenderPart(document.querySelector(".adventure")); }, 900);
  });

  main.addEventListener("change", function (e) {
    var inp = e.target.closest("[data-ml]");
    if (!inp || !inp.files || !inp.files[0]) return;
    var box = inp.closest(".ml-demo").querySelector(".ml-result");
    box.textContent = t("ml_running");
    setTimeout(function () { box.textContent = t("ml_result"); }, 1500);
  });

  // Re-rendu local (garde la position de défilement)
  function rerenderPart(anchor) {
    var y = window.scrollY;
    var top = anchor ? anchor.getBoundingClientRect().top : null;
    var body = document.getElementById("parcoursBody");
    var html = parcoursState.tab === "aventure" ? viewAventure() : viewSubject(parcoursState.tab);
    var swap = function () { body.innerHTML = html; hydrateIcons(body); };
    swap();
    if (anchor && top !== null) {
      var sel = anchor.classList.contains("stepper") ? '.stepper[data-uid="' + anchor.dataset.uid + '"]' : ".adventure";
      var again = document.querySelector(sel);
      if (again) {
        var newTop = again.getBoundingClientRect().top;
        window.scrollTo(0, y + (newTop - top));
        if (top < 0) again.scrollIntoView({ block: "start" });
      }
    } else window.scrollTo(0, y);
  }

  /* ---------------- 10. Routeur (hash) + transitions ---------------- */
  function route() {
    var h = (location.hash || "#/").replace(/^#\/?/, "");
    var parts = h.split("/");
    return { page: parts[0] || "", sub: parts[1] || "" };
  }
  var lastPage = null;
  function render(isNav) {
    var r = route();
    var html;
    switch (r.page) {
      case "pedagogie": html = viewPedagogie(); break;
      case "parcours": html = viewParcours(r.sub); break;
      case "mediatheque": html = viewMediatheque(); break;
      default: html = viewDashboard(); r.page = "";
    }
    var pageChanged = r.page !== lastPage;
    var update = function () {
      main.innerHTML = html;
      document.body.dataset.page = r.page || "dashboard";
      hydrateIcons(main);
      document.querySelectorAll("#topnav a").forEach(function (a) {
        if (a.dataset.route === r.page) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      var hb = document.getElementById("homeBtn");
      if (!r.page) hb.setAttribute("aria-current", "page"); else hb.removeAttribute("aria-current");
      if (isNav && pageChanged) window.scrollTo(0, 0);
    };
    var focusTitle = function () {
      if (!isNav) return;
      var h1 = main.querySelector(".page-title");
      if (h1) h1.focus({ preventScroll: true });
    };
    lastPage = r.page;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isNav && document.startViewTransition && !reduce) {
      var vt = document.startViewTransition(update);
      vt.finished.finally(focusTitle);
    } else { update(); focusTitle(); }
  }
  window.addEventListener("hashchange", function () { render(true); });

  /* ---------------- 11. Chargement du contenu ---------------- */
  function loadContent() {
    var fb = window.__FOSHET_FALLBACK__ || {};
    if (location.protocol === "file:") {
      // Ouverture par double-clic : les navigateurs bloquent fetch() → contenu embarqué
      return Promise.resolve(fb);
    }
    return Promise.all(CONTENT_FILES.map(function (name) {
      return fetch("content/" + name + ".json", { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .catch(function () { return fb[name]; })
        .then(function (data) { return [name, data]; });
    })).then(function (pairs) {
      var o = {}; pairs.forEach(function (p) { o[p[0]] = p[1] || {}; }); return o;
    });
  }

  hydrateIcons(document);
  var saved = "ar";
  try { saved = localStorage.getItem("foshet-lang") || "ar"; } catch (e) {}
  loadContent().then(function (data) {
    C = data;
    CONTENT_FILES.forEach(function (k) { C[k] = C[k] || {}; });
    applyLang(saved);
    renderChrome();
    render(false);
  });
})();
