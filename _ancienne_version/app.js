(function(){
  "use strict";

  /* ---------------- إدارة اللغة والاتجاه ---------------- */
  var body = document.body;
  var langBtn = document.getElementById('langBtn');
  var currentLang = 'ar'; // البدء الافتراضي باللغة العربية

  function applyLang(lang){
    currentLang = lang;
    body.setAttribute('data-lang', lang);
    body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }
  
  // تشغيل الوضع الافتراضي بالعربية
  applyLang('ar');

  if(langBtn){
    langBtn.addEventListener('click', function(){
      applyLang(currentLang === 'ar' ? 'fr' : 'ar');
    });
  }

  /* ---------------- تفعيل النوافذ المنبثقة للفضاء 1 (الإطار النظري والأغاني) ---------------- */
  var researchModal = document.getElementById('researchDetailsModal');
  var openResearchBtn = document.getElementById('openResearchModalBtn');
  var closeResearchBtn = document.getElementById('closeResearchModalBtn');

  if(researchModal && openResearchBtn){
    openResearchBtn.addEventListener('click', function(){ researchModal.showModal(); });
  }
  if(researchModal && closeResearchBtn){
    closeResearchBtn.addEventListener('click', function(){ researchModal.close(); });
  }

  var songsModal = document.getElementById('songsDetailsModal');
  var openSongsBtn = document.getElementById('openSongsModalBtn');
  var closeSongsBtn = document.getElementById('closeSongsModalBtn');

  if(songsModal && openSongsBtn){
    openSongsBtn.addEventListener('click', function(){ songsModal.showModal(); });
  }
  if(songsModal && closeSongsBtn){
    closeSongsBtn.addEventListener('click', function(){ songsModal.close(); });
  }

  // إغلاق النوافذ عند النقر في الخلفية المظلمة
  [researchModal, songsModal].forEach(function(m){
    if(m){
      m.addEventListener('click', function(e){
        if(e.target === m) m.close();
      });
    }
  });

  /* ---------------- تفعيل فتح وطي الأغاني (الأكورديون الجديد) ---------------- */
  document.querySelectorAll('.song-acc-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var body = btn.nextElementSibling;
      var icon = btn.querySelector('i.bi-chevron-down, i.bi-chevron-up');
      if(body){
        var isHidden = body.classList.toggle('hidden');
        if(icon){
          icon.classList.toggle('bi-chevron-down', isHidden);
          icon.classList.toggle('bi-chevron-up', !isHidden);
        }
      }
    });
  });

  /* ---------------- Lightbox للصور (تكبير الوثائق) ---------------- */
  window.openImageLightbox = function(src, caption){
    var modal = document.getElementById('imageLightboxModal');
    var img = document.getElementById('lightboxImg');
    var cap = document.getElementById('lightboxCaption');
    if(modal && img){
      img.src = src;
      if(cap) cap.textContent = caption || '';
      modal.showModal();
    }
  };

  /* ---------------- Plein Écran (Fullscreen Modal) pour Projet 2 ---------------- */
  window.openFullscreenMedia = function(type, containerId){
    var modal = document.getElementById('fullscreenMediaModal');
    var bodyContent = document.getElementById('fullscreenBodyContent');
    var sourceContainer = document.getElementById(containerId);
    
    if(modal && bodyContent && sourceContainer){
      bodyContent.innerHTML = '';
      var clone = sourceContainer.cloneNode(true);
      clone.style.width = '100%';
      clone.style.height = '100%';
      clone.classList.remove('aspect-video');
      bodyContent.appendChild(clone);
      modal.showModal();
    }
  };

  /* ---------------- Simulation Live Prediction Machine Learning ---------------- */
  window.simulateMLPrediction = function(inputElem){
    if(inputElem.files && inputElem.files[0]){
      var box = document.getElementById('mlResultBox');
      if(box){
        box.classList.remove('hidden');
        box.innerHTML = '🔄 جارٍ تحليل اللوحة بالذكاء الاصطناعي وتحويلها إلى مفهوم بيئي و Extrait Musical...';
        setTimeout(function(){
          box.innerHTML = '✨ النتيجة: تصنيف بيئي (Harmony) بنسبة 96% ➔ تم توليد Extrait Musical (موسيقى بيئية) بنجاح!';
        }, 1500);
      }
    }
  };

  /* ---------------- SPA navigation ---------------- */
  var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
  function showView(name){
    views.forEach(function(v){ v.classList.toggle('active', v.dataset.view === name); });
    window.scrollTo(0,0);
    if(history.replaceState){ history.replaceState(null, '', '#' + name); }
  }

  document.querySelectorAll('[data-nav]').forEach(function(el){
    el.addEventListener('click', function(){ showView(el.dataset.nav); });
  });

  /* ---------------- Piliers (Tabs) Espace 2 ---------------- */
  var pilierBtns = document.querySelectorAll('.pilier-btn');
  pilierBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      pilierBtns.forEach(function(b){ b.classList.remove('active'); });
      document.querySelectorAll('.pilier-content').forEach(function(c){ c.classList.remove('active'); });
      btn.classList.add('active');
      var targetId = 'pilier-' + btn.dataset.pilier;
      var targetContent = document.getElementById(targetId);
      if(targetContent){ targetContent.classList.add('active'); }
    });
  });

  /* ---------------- Gestion des Médias (Drive & YouTube) ---------------- */
  function getEmbedUrl(url){
    if(!url) return null;
    
    // Google Drive
    var mDrive = url.match(/\/d\/([a-zA-Z0-9_-]{10,})/) || url.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if(mDrive) return 'https://drive.google.com/file/d/' + mDrive[1] + '/preview';
    
    // YouTube
    var mYt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if(mYt) return 'https://www.youtube.com/embed/' + mYt[1];
    
    return null;
  }

  function handleMediaInputs(selector){
    document.querySelectorAll(selector).forEach(function(input){
      input.addEventListener('change', function(){
        var url = input.value.trim();
        var targetId = input.dataset.target;
        var container = document.getElementById(targetId);
        if(!url || !container) return;
        var embedUrl = getEmbedUrl(url);
        if(embedUrl){
          container.innerHTML = '<iframe src="' + embedUrl + '" allow="autoplay; fullscreen" allowfullscreen class="w-full h-full border-0"></iframe>';
        } else {
          container.innerHTML = '<div class="text-center p-4 text-rose-500 font-bold text-xs">⚠️ الرابط غير صالح (تأكد من رابط يوتيوب أو الدرايف)</div>';
        }
      });
    });
  }

  handleMediaInputs('.p1-media-input');
  handleMediaInputs('.p2-media-input');

  /* ---------------- إدارة لعبة المغامرة الكبرى (مشروع عدد 3) ---------------- */
  window.goToAventureStep = function(stepIndex){
    var panels = document.querySelectorAll('.step-panel');
    var dots = document.querySelectorAll('.step-dot');
    
    panels.forEach(function(p){
      p.classList.toggle('active', parseInt(p.dataset.stepPanel, 10) === stepIndex);
    });
    
    dots.forEach(function(d, idx){
      d.classList.toggle('active', idx === stepIndex);
      d.classList.toggle('done', idx < stepIndex);
    });

    var container = document.getElementById('pilier-aventure');
    if(container){
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.validateStep1 = function(){
    var selected = document.querySelector('input[name="challenge1"]:checked');
    var fb = document.getElementById('feedbackStep1');
    if(!selected){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-amber-100 text-amber-800 block';
      fb.innerHTML = '⚠️ الرجاء اختيار إجابة لمساعدة جاد على تجاوز الموقف!';
      return;
    }
    if(selected.value === 'correct'){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-emerald-100 text-emerald-800 block';
      fb.innerHTML = ' أحسنت! كسر قناع العنف يبدأ بالتهدئة والإصغاء لنبض القلب.';
      setTimeout(function(){ goToAventureStep(2); }, 900);
    } else {
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-rose-100 text-rose-800 block';
      fb.innerHTML = '❌ الصراخ يزيد الأمر سوءاً! فكر في مبدأ «اسمع قلبي».';
    }
  };

  window.validateStep2 = function(){
    var c1 = document.getElementById('inst1').checked;
    var c2 = document.getElementById('inst2').checked;
    var c3 = document.getElementById('inst3').checked;
    var c4 = document.getElementById('inst4').checked;
    var fb = document.getElementById('feedbackStep2');

    if(c1 && c2 && c3 && !c4){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-emerald-100 text-emerald-800 block';
      fb.innerHTML = ' إجابة رائعة! الآلات التراثية أعادت اللحمة لفرقة العلم.';
      setTimeout(function(){ goToAventureStep(3); }, 900);
    } else {
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-rose-100 text-rose-800 block';
      fb.innerHTML = '⚠️ تأكد من اختيار آلات التراث الثلاث واستبعاد مكبرات الصراخ!';
    }
  };

  window.validateStep3 = function(){
    var selected = document.querySelector('input[name="challenge3"]:checked');
    var fb = document.getElementById('feedbackStep3');
    if(!selected){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-amber-100 text-amber-800 block';
      fb.innerHTML = '⚠️ الرجاء اختيار طريقة بناء الوردة التشكيلية!';
      return;
    }
    if(selected.value === 'correct'){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-emerald-100 text-emerald-800 block';
      fb.innerHTML = ' ممتاز! الناتئ والغائر وتراكب الخامات يجسد روح الدرس الشاهد.';
      setTimeout(function(){ goToAventureStep(4); }, 900);
    } else {
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-rose-100 text-rose-800 block';
      fb.innerHTML = '❌ السطح الأحادي لا يعبر عن النمو؛ نحتاج لخامات وأبعاد مجسمة!';
    }
  };

  /* ---------------- إدارة مساري المغامرة الكبرى (لعبة + توثيق القسم) ---------------- */
  window.switchAventureMode = function(mode){
    var gameSec = document.getElementById('aventureGameSection');
    var classSec = document.getElementById('aventureClassSection');
    var btnGame = document.getElementById('btnModeGame');
    var btnClass = document.getElementById('btnModeClass');

    if(mode === 'game'){
      gameSec.classList.remove('hidden');
      classSec.classList.add('hidden');
      btnGame.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center gap-2';
      btnClass.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all text-gray-700 hover:bg-white flex items-center gap-2';
    } else {
      classSec.classList.remove('hidden');
      gameSec.classList.add('hidden');
      btnClass.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm bg-gradient-to-r from-rose-600 to-orange-500 text-white flex items-center gap-2';
      btnGame.className = 'px-5 py-2.5 rounded-xl font-black text-xs transition-all text-gray-700 hover:bg-white flex items-center gap-2';
    }
  };

  /* تنقل مراحل اللعبة التفاعلية */
  window.goToGameStep = function(stepIdx){
    var panels = document.querySelectorAll('.game-step-panel');
    var dots = document.querySelectorAll('#gameDots .step-dot');
    var badge = document.getElementById('gameStepBadge');

    panels.forEach(function(p){
      p.classList.toggle('hidden', parseInt(p.dataset.gstep, 10) !== stepIdx);
      p.classList.toggle('active', parseInt(p.dataset.gstep, 10) === stepIdx);
    });

    dots.forEach(function(d, i){
      d.classList.toggle('active', i === stepIdx);
      d.classList.toggle('done', i < stepIdx);
    });

    if(badge){ badge.textContent = 'المحطة ' + (stepIdx + 1) + ' من 4'; }
  };

  window.validateGameQ1 = function(){
    var q = document.querySelector('input[name="gameQ1"]:checked');
    var fb = document.getElementById('gameFb1');
    if(!q){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-amber-100 text-amber-900 block';
      fb.innerHTML = '⚠️ الرجاء اختيار إجابة لمساعدة جاد!';
      return;
    }
    if(q.value === 'yes'){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-emerald-100 text-emerald-800 block';
      fb.innerHTML = '✨ إجابة صحيحة! نبرة الهدوء والإصغاء هي القوة الحقيقية.';
      setTimeout(function(){ goToGameStep(2); }, 750);
    } else {
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-rose-100 text-rose-800 block';
      fb.innerHTML = '❌ الصراخ يزيد الأمر تأزماً؛ تذكر مبدأ «اسمع قلبي».';
    }
  };

  window.validateGameQ2 = function(){
    var q = document.querySelector('input[name="gameQ2"]:checked');
    var fb = document.getElementById('gameFb2');
    if(!q){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-amber-100 text-amber-900 block';
      fb.innerHTML = '⚠️ الرجاء اختيار طريقة بناء السطح التشكيلي!';
      return;
    }
    if(q.value === 'yes'){
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-emerald-100 text-emerald-800 block';
      fb.innerHTML = '✨ أحسنت! الناتئ والغائر وتراكب الخامات يجسد روح الدرس الشاهد.';
      setTimeout(function(){ goToGameStep(3); }, 750);
    } else {
      fb.className = 'text-xs font-bold p-2.5 rounded-xl bg-rose-100 text-rose-800 block';
      fb.innerHTML = '❌ السطح الرمادي لا يعبر عن النمو؛ نحتاج لخامات وأبعاد مجسمة!';
    }
  };

  /* تنقل مراحل التوثيق الصفي الميداني */
  window.goToClassStep = function(stepIdx){
    var panels = document.querySelectorAll('.class-step-panel');
    var dots = document.querySelectorAll('#classDots .step-dot');
    var badge = document.getElementById('classStepBadge');

    panels.forEach(function(p){
      p.classList.toggle('hidden', parseInt(p.dataset.cstep, 10) !== stepIdx);
      p.classList.toggle('active', parseInt(p.dataset.cstep, 10) === stepIdx);
    });

    dots.forEach(function(d, i){
      d.classList.toggle('active', i === stepIdx);
      d.classList.toggle('done', i < stepIdx);
    });

    if(badge){ badge.textContent = 'المرحلة ' + (stepIdx + 1) + ' من 3'; }
  };

  /* ---------------- إدارة خطوات ورشة الموسيقيين (المحطة 1) ---------------- */
  window.showMusicSubStep = function(stepNum){
    for(var i = 1; i <= 4; i++){
      var el = document.getElementById('mSubStep' + i);
      var dot = document.getElementById('mDot' + i);
      if(el){ el.classList.toggle('hidden', i !== stepNum); }
      if(dot){
        dot.className = (i === stepNum)
          ? 'w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-[11px] font-bold shadow'
          : (i < stepNum)
            ? 'w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold'
            : 'w-6 h-6 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center text-[11px] font-bold';
      }
    }
  };

  window.advanceMusicStep = function(currentStep){
    var fb = document.getElementById('mFeedback' + currentStep);
    if(fb){
      fb.classList.remove('hidden');
      setTimeout(function(){
        window.showMusicSubStep(currentStep + 1);
        fb.classList.add('hidden');
      }, 950);
    } else {
      window.showMusicSubStep(currentStep + 1);
    }
  };

  window.backMusicStep = function(targetStep){
    window.showMusicSubStep(targetStep);
  };

  window.completeMusicPillar = function(){
    var fb = document.getElementById('mFeedback4');
    if(fb){
      fb.classList.remove('hidden');
      setTimeout(function(){
        goToGameStep(2); // التوجه نحو المحطة الثانية
      }, 1200);
    } else {
      goToGameStep(2);
    }
  };

})();