// without jQuery

// document.addEventListener('DOMContentLoaded', () => {
//   const templates = {};
//   const scripts = document.querySelectorAll('script[type="text/x-handlebars"]');
//   const form = document.querySelector('form');
//   const xhr = new XMLHttpRequest();
//   let photos;

//   Array.from(scripts).forEach(script => {
//     templates[script.id] = Handlebars.compile(script.innerHTML);
//     script.remove();
//   });

//   Handlebars.registerPartial('comment', templates.photo_comment);

//   const slideshow = {
//     buttons: document.querySelector('#slideshow ul'),
//     header: document.querySelector('section > header'),

//     getCurrentSlide() {
//       return this.figs.filter(fig => {
//         return getComputedStyle(fig).getPropertyValue('display') === 'block';
//       })[0];
//     },

//     updateDisplay(currentSlide, newSlide) {
//       currentSlide.style.display = 'none';
//       newSlide.style.display = 'block';
//     },

//     getAdjacent(current, e) {
//       return e.target.className === 'prev'
//         ? current.previousElementSibling || this.figs[this.figs.length - 1]
//         : current.nextElementSibling || this.figs[0];
//     },

//     changeSlide(e) {
//       const currentSlide = this.getCurrentSlide();
//       let newSlide = this.getAdjacent(currentSlide, e);
//       this.id = +newSlide.getAttribute('data-id');
//       this.updateDisplay(currentSlide, newSlide);
//     },

//     changeInfo() {
//       while (this.header.firstChild) this.header.removeChild(this.header.firstChild);
//       document.querySelector('[name="photo_id"]').setAttribute('value', this.id);
//       renderPhotoInformation(this.id);
//       getCommentsFor(this.id);
//     },

//     changeSlideAndInfo(e) {
//       e.preventDefault();
//       this.figs = Array.from(document.querySelectorAll('#slides figure'));
//       this.changeSlide(e);
//       this.changeInfo();
//     },

//     incrementPreference(e) {
//       e.preventDefault();
//       const path = e.target.getAttribute('href');
//       const action = e.target.getAttribute('data-property');
//       sendOpinion(this.id, path, action);
//     },

//     bind() {
//       this.buttons.addEventListener('click', this.changeSlideAndInfo.bind(this));
//       this.header.addEventListener('click', this.incrementPreference.bind(this));
//     },

//     init() {
//       this.figs = null;
//       this.id = 1;

//       this.bind();
//     },
//   };

//   xhr.open('GET', '/photos');
//   xhr.responseType = 'json';
//   xhr.addEventListener('load', () => {
//     photos = xhr.response;
//     renderPhotos();
//     renderPhotoInformation(1);
//     slideshow.init();
//     getCommentsFor(photos[0].id);
//   });

//   xhr.send();

//   function renderPhotos() {
//     const slides = document.querySelector('#slides');
//     slides.innerHTML = templates.photos({ photos: photos });
//   }

//   function renderPhotoInformation(id) {
//     const header = document.querySelector('section > header');
//     header.innerHTML = templates.photo_information(photos[id - 1]);
//   }

//   function getCommentsFor(id) {
//     const xhr = new XMLHttpRequest();

//     xhr.open('GET', `/comments?photo_id=${id}`);
//     xhr.responseType = 'json';
//     xhr.addEventListener('load', () => {
//       const comments = document.querySelector('#comments > ul');
//       comments.innerHTML = templates.photo_comments({ comments: xhr.response });
//     });

//     xhr.send();
//   }

//   function sendOpinion(id, path, action) {
//     const xhr = new XMLHttpRequest();
//     const currentPhoto = photos[id - 1];

//     xhr.open('POST', path);
//     xhr.responseType = 'json';
//     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//     xhr.addEventListener('load', () => {
//       const newTotal = xhr.response.total;
//       const btn = document.querySelector(`[data-property="${action}"]`);

//       btn.innerText = btn.innerText.replace(/\d+/, newTotal);
//       currentPhoto[action] = newTotal;
//     });

//     xhr.send(`photo_id=${id}`);
//   }

//   form.addEventListener('submit', e => {
//     e.preventDefault();
//     const xhr = new XMLHttpRequest();
//     const keysAndValues = [];

//     for (let i = 0; i < form.elements.length; i++) {
//       const element = form.elements[i];
//       let key;
//       let value;

//       if (element.type !== 'fieldset' && element.type !== 'submit') {
//         key = encodeURIComponent(element.name);
//         value = encodeURIComponent(element.value);
//         keysAndValues.push(key + '=' + value);
//       }
//     }

//     const data = keysAndValues.join('&');

//     xhr.open(form.method, form.action);
//     xhr.responseType = 'json';
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhr.addEventListener('load', () => {
//       const comments = document.querySelector('#comments > ul');
//       comments.innerHTML += templates.photo_comment(xhr.response);
//       form.reset();
//     });

//     xhr.send(data);
//   });
// });

// with jquery

$(() => {
  const templates = {};
  let photos;

  $('script[type="text/x-handlebars"]').each(function() {
    $script = $(this).remove();
    templates[$script.attr('id')] = Handlebars.compile($script.html());
  });

  Handlebars.registerPartial('comment', templates.photo_comment);

  const slideshow = {
    $buttons: $('#slideshow ul'),
    duration: 500,

    updateDisplay($currentSlide, $newSlide) {
      $currentSlide.fadeOut(this.duration);
      $newSlide.fadeIn(this.duration);
    },

    getPrev($current) {
      return !$current.prev().length ? this.$figs.last() : $current.prev();
    },

    getNext($current) {
      return !$current.next().length ? this.$figs.first() : $current.next();
    },

    getAdjacent($current, e) {
      return e.target.className === 'prev'
        ? this.getPrev($current)
        : this.getNext($current);
    },

    changeSlide(e) {
      const $currentSlide = this.$figs.filter('figure:visible');
      const $newSlide = this.getAdjacent($currentSlide, e);
      this.id = +$newSlide.attr('data-id');
      this.updateDisplay($currentSlide, $newSlide);
    },

    changeSlideAndInfo(e) {
      e.preventDefault();
      this.$figs = $('#slides figure');
      this.changeSlide(e);
      $('[name="photo_id"]').val(this.id);
      renderPhotoInformation(this.id);
      getCommentsFor(this.id);
    },

    bind() {
      this.$buttons.on('click', this.changeSlideAndInfo.bind(this));
    },

    init() {
      this.id = 1;
      this.$figs = null;

      this.bind();
    },
  };

  $.ajax({
    url: '/photos'
  }).done(json => {
    photos = json;
    renderPhotos();
    renderPhotoInformation(1);
    slideshow.init();
    getCommentsFor(photos[0].id);
  });

  function renderPhotos() {
    $('#slides').html(templates.photos({ photos: photos }));
  }

  function renderPhotoInformation(id) {
    $('section > header').html(templates.photo_information(photos[id - 1]));
  }

  function getCommentsFor(id) {
    $.ajax({
      url: '/comments',
      data: `photo_id=${id}`,
    }).done(json => {
      $('#comments > ul').html(templates.photo_comments({ comments: json }));
    });
  }

  $('section > header').on('click', '.actions a', e => {
    e.preventDefault();
    const $action = $(e.target);
    const currentPhoto = photos[slideshow.id - 1];

    $.ajax({
      url: $action.attr('href'),
      type: 'post',
      data: `photo_id=${$action.attr('data-id')}`,
    }).done(json => {
      $action.text((_, oldTxt) => oldTxt.replace(/\d+/, json.total));
      currentPhoto[$action.attr('data-property')] = json.total;
    });
  });

  $('form').on('submit', function(e) {
    e.preventDefault();
    const $f = $(this);

    $.ajax({
      url: $f.attr('action'),
      type: $f.attr('method'),
      data: $f.serialize(),
    }).done(json => {
      $('#comments > ul').append(templates.photo_comment(json));
      $f[0].reset();
    });
  });
});
