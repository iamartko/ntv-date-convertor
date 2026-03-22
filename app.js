(function () {
  'use strict';

  var TRANSLATIONS = {
    ua: {
      title: 'Конвертер дат "Нові Темні Віки"',
      directionEarthToNtv: 'Земля → Марс',
      directionNtvToEarth: 'Марс → Земля',
      earthDate: 'Дата на Землі',
      ntvDate: 'Дата на Марсі',
      convert: 'Конвертувати',
      referenceTitle: 'Марсіанські місяці',
      thMonth: '#',
      thName: 'Назва',
      thSols: 'Соли',
      thStartSol: 'Початковий сол',
      footer: 'На основі календаря з серії «Нові Темні Віки» <a href="https://darkages.maxkidruk.com/" target="_blank" rel="noopener noreferrer">Макса Кідрука</a>',
      yearPlaceholder: 'Рік',
      dayPlaceholder: 'День',
      monthPlaceholder: 'Місяць',
      ntvYearPlaceholder: 'Рік марсіанський',
      solPlaceholder: 'Сол',
      ntvMonthPlaceholder: 'Місяць',
      notice: '* Розбіжність з датами у книгах може складати 1 сол через особливості обрахунку.',
      fillAllFields: 'Заповніть усі поля',
      warningPreEpoch: 'Ця дата передує епосі «Нові Темні Віки» (2057)',
      errNotNumbers: 'Рік, місяць і день мають бути числами',
      errNotIntegers: 'Рік, місяць і день мають бути цілими числами',
      errYearTooEarly: 'Рік має бути 1583 або пізніше (григоріанський календар)',
      errMonthOutOfRange: 'Місяць має бути від 1 до 12',
      errEarthDayOutOfRange: function (p) {
        return 'День має бути від 1 до ' + p.max + ' для місяця ' + p.month;
      },
      errNtvDayOutOfRange: function (p) {
        return 'Сол має бути від 1 до ' + p.max + ' для місяця ' + p.month + ' (' + p.monthData.nameUa + ')';
      },
      resultEarthToNtv: function (r) {
        return r.monthNameUa + ' ' + r.day + ', рік ' + r.ntvYear + ' (сол ' + r.sol + ')';
      },
      resultNtvToEarth: function (r) {
        var monthNames = ['', 'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
          'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
        return r.day + ' ' + monthNames[r.month] + ' ' + r.year;
      },
      earthMonths: ['', 'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень']
    },
    en: {
      title: '"New Dark Ages" Date Converter',
      directionEarthToNtv: 'Earth → Mars',
      directionNtvToEarth: 'Mars → Earth',
      earthDate: 'Earth Date',
      ntvDate: 'Mars Date',
      convert: 'Convert',
      referenceTitle: 'Mars Months',
      thMonth: '#',
      thName: 'Name',
      thSols: 'Sols',
      thStartSol: 'Start Sol',
      footer: 'Based on the calendar from <a href="https://darkages.maxkidruk.com/" target="_blank" rel="noopener noreferrer">Max Kidruk</a>\'s "New Dark Ages" series',
      yearPlaceholder: 'Year',
      dayPlaceholder: 'Day',
      monthPlaceholder: 'Month',
      ntvYearPlaceholder: 'Mars Year',
      solPlaceholder: 'Sol',
      ntvMonthPlaceholder: 'Month',
      notice: '* Conversion may differ from books dates by 1 sol due to the peculiarities of the calculation.',
      fillAllFields: 'Please fill in all fields',
      warningPreEpoch: 'This date precedes the "New Dark Ages" epoch (2057)',
      errNotNumbers: 'Year, month, and day must be numbers',
      errNotIntegers: 'Year, month, and day must be integers',
      errYearTooEarly: 'Year must be 1583 or later (Gregorian calendar)',
      errMonthOutOfRange: 'Month must be between 1 and 12',
      errEarthDayOutOfRange: function (p) {
        return 'Day must be between 1 and ' + p.max + ' for month ' + p.month;
      },
      errNtvDayOutOfRange: function (p) {
        return 'Day must be between 1 and ' + p.max + ' for month ' + p.month + ' (' + p.monthData.nameEn + ')';
      },
      resultEarthToNtv: function (r) {
        return r.monthNameEn + ' ' + r.day + ', year ' + r.ntvYear + ' (sol ' + r.sol + ')';
      },
      resultNtvToEarth: function (r) {
        var monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[r.month] + ' ' + r.day + ', ' + r.year;
      },
      earthMonths: ['', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    }
  };

  var currentLang = 'ua';
  var currentDirection = 'earthToNtv';

  function setLanguage(lang) {
    currentLang = lang;
    var t = TRANSLATIONS[lang];

    var i18nElements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nElements.length; i++) {
      var key = i18nElements[i].getAttribute('data-i18n');
      if (t[key]) {
        i18nElements[i].textContent = t[key];
      }
    }

    var i18nHtmlElements = document.querySelectorAll('[data-i18n-html]');
    for (var i = 0; i < i18nHtmlElements.length; i++) {
      var key = i18nHtmlElements[i].getAttribute('data-i18n-html');
      if (t[key]) {
        i18nHtmlElements[i].innerHTML = t[key];
      }
    }

    var earthMonth = document.getElementById('earth-month');
    var options = earthMonth.querySelectorAll('option[value]');
    for (var i = 0; i < options.length; i++) {
      var val = parseInt(options[i].value, 10);
      if (val && t.earthMonths[val]) {
        options[i].textContent = t.earthMonths[val];
      }
    }

    populateNtvMonths();

    document.getElementById('earth-year').placeholder = t.yearPlaceholder;
    document.getElementById('earth-day').placeholder = t.dayPlaceholder;
    document.getElementById('ntv-year').placeholder = t.ntvYearPlaceholder;
    document.getElementById('ntv-day').placeholder = t.solPlaceholder;

    var firstEarthOption = earthMonth.querySelector('option[value=""]');
    if (firstEarthOption) firstEarthOption.textContent = t.monthPlaceholder;

    setDirection(currentDirection);

    document.documentElement.lang = lang === 'ua' ? 'uk' : 'en';
    document.title = t.title;

    renderReferenceTable();

    localStorage.setItem('ntv-lang', lang);

    var langBtn = document.getElementById('lang-toggle');
    langBtn.textContent = lang === 'ua' ? 'UA / en' : 'ua / EN';
  }

  function initLanguage() {
    var stored = localStorage.getItem('ntv-lang');
    if (stored === 'ua' || stored === 'en') {
      currentLang = stored;
    }
    setLanguage(currentLang);
  }

  function getEffectiveTheme() {
    var stored = localStorage.getItem('ntv-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    var effective = (theme === 'light' || theme === 'dark') ? theme :
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    var icon = document.querySelector('#theme-toggle .theme-icon');
    if (icon) {
      icon.textContent = effective === 'dark' ? '🌙' : '☀️';
    }

    localStorage.setItem('ntv-theme', theme);
  }

  function initTheme() {
    var stored = localStorage.getItem('ntv-theme');
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme('system');
    }
  }

  function renderReferenceTable() {
    var months = NtvConverter.getMonths();
    var tbody = document.getElementById('months-tbody');
    tbody.innerHTML = '';

    for (var i = 0; i < months.length; i++) {
      var tr = document.createElement('tr');
      var tdNum = document.createElement('td');
      tdNum.textContent = months[i].month;
      var tdName = document.createElement('td');
      tdName.textContent = currentLang === 'ua' ? months[i].nameUa : months[i].nameEn;
      var tdSols = document.createElement('td');
      tdSols.textContent = months[i].sols;
      var tdStart = document.createElement('td');
      tdStart.textContent = months[i].startSol;
      tr.appendChild(tdNum);
      tr.appendChild(tdName);
      tr.appendChild(tdSols);
      tr.appendChild(tdStart);
      tbody.appendChild(tr);
    }
  }

  function populateNtvMonths() {
    var select = document.getElementById('ntv-month');
    var currentValue = select.value;
    var months = NtvConverter.getMonths();

    while (select.options.length > 1) {
      select.remove(1);
    }

    var firstOption = select.querySelector('option[value=""]');
    if (firstOption) {
      firstOption.textContent = TRANSLATIONS[currentLang].ntvMonthPlaceholder;
    }

    for (var i = 0; i < months.length; i++) {
      var opt = document.createElement('option');
      opt.value = months[i].month;
      opt.textContent = currentLang === 'ua' ? months[i].nameUa : months[i].nameEn;
      select.appendChild(opt);
    }

    if (currentValue) select.value = currentValue;
  }

  function setDirection(dir) {
    currentDirection = dir;
    var earthInputs = document.getElementById('earth-inputs');
    var ntvInputs = document.getElementById('ntv-inputs');
    var dirLabel = document.getElementById('direction-label');

    if (dir === 'earthToNtv') {
      earthInputs.style.display = '';
      ntvInputs.style.display = 'none';
      dirLabel.textContent = TRANSLATIONS[currentLang].directionEarthToNtv;
    } else {
      earthInputs.style.display = 'none';
      ntvInputs.style.display = '';
      dirLabel.textContent = TRANSLATIONS[currentLang].directionNtvToEarth;
    }

    hideResult();
    hideError();
  }

  var WARNING_KEYS = {
    pre_epoch: 'warningPreEpoch'
  };

  var ERROR_KEYS = {
    not_numbers: 'errNotNumbers',
    not_integers: 'errNotIntegers',
    year_too_early: 'errYearTooEarly',
    month_out_of_range: 'errMonthOutOfRange',
    earth_day_out_of_range: 'errEarthDayOutOfRange',
    ntv_day_out_of_range: 'errNtvDayOutOfRange'
  };

  function resolveError(result) {
    var key = ERROR_KEYS[result.messageKey];
    if (!key) return result.messageKey;
    var val = TRANSLATIONS[currentLang][key];
    return typeof val === 'function' ? val(result.params) : val;
  }

  function showResult(text, warning) {
    var card = document.getElementById('result-card');
    var content = document.getElementById('result-content');
    var warn = document.getElementById('result-warning');

    content.textContent = text;
    card.removeAttribute('hidden');

    if (warning) {
      var translationKey = WARNING_KEYS[warning];
      warn.textContent = translationKey ? TRANSLATIONS[currentLang][translationKey] : warning;
      warn.removeAttribute('hidden');
    } else {
      warn.setAttribute('hidden', '');
    }
  }

  function hideResult() {
    document.getElementById('result-card').setAttribute('hidden', '');
  }

  function showError(message) {
    var el = document.getElementById('error-message');
    el.textContent = message;
    el.removeAttribute('hidden');
  }

  function hideError() {
    document.getElementById('error-message').setAttribute('hidden', '');
  }

  function doConvert() {
    hideResult();
    hideError();

    if (currentDirection === 'earthToNtv') {
      var year = parseInt(document.getElementById('earth-year').value, 10);
      var month = parseInt(document.getElementById('earth-month').value, 10);
      var day = parseInt(document.getElementById('earth-day').value, 10);

      if (isNaN(year) || isNaN(month) || isNaN(day)) {
        showError(TRANSLATIONS[currentLang].fillAllFields);
        return;
      }

      var result = NtvConverter.earthToNtv(year, month, day);
      if (result.error) {
        showError(resolveError(result));
        return;
      }

      showResult(TRANSLATIONS[currentLang].resultEarthToNtv(result), result.warning);
    } else {
      var ntvYear = parseInt(document.getElementById('ntv-year').value, 10);
      var monthNum = parseInt(document.getElementById('ntv-month').value, 10);
      var dayStr = document.getElementById('ntv-day').value;
      var day = dayStr === '' ? NaN : parseInt(dayStr, 10);

      if (isNaN(ntvYear) || isNaN(monthNum) || isNaN(day)) {
        showError(TRANSLATIONS[currentLang].fillAllFields);
        return;
      }

      var result = NtvConverter.ntvToEarth(ntvYear, monthNum, day);
      if (result.error) {
        showError(resolveError(result));
        return;
      }

      showResult(TRANSLATIONS[currentLang].resultNtvToEarth(result), result.warning);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initLanguage();
    renderReferenceTable();
    populateNtvMonths();

    document.getElementById('lang-toggle').addEventListener('click', function () {
      setLanguage(currentLang === 'ua' ? 'en' : 'ua');
    });

    document.getElementById('theme-toggle').addEventListener('click', function () {
      var effective = getEffectiveTheme();
      setTheme(effective === 'light' ? 'dark' : 'light');
    });

    document.getElementById('swap-btn').addEventListener('click', function () {
      setDirection(currentDirection === 'earthToNtv' ? 'ntvToEarth' : 'earthToNtv');
    });

    document.getElementById('convert-btn').addEventListener('click', function () {
      doConvert();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      var stored = localStorage.getItem('ntv-theme');
      if (!stored || stored === 'system') {
        setTheme('system');
      }
    });
  });
})();
