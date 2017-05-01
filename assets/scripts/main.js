(function (window) {
  'use strict';
  var COFFEEGRAM_FORM_SELECTOR = '[data-coffeegram="new-coffeegram"]';
  var $ = window.jQuery;
  var coffeegramForm = $(COFFEEGRAM_FORM_SELECTOR);
  const FileAPI = window.FileAPI;

  var imageProcessOpts = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.6,
    type: 'image/jpeg'
  };

  function processImage(file, opts, fn) {
    FileAPI.Image.transform(file, { hd: opts }, true,
      (error, img) => {
        img.hd.toBlob(blob => {
          blob.name = file.name;
          fn(blob);
        }, opts.type, opts.quality);
      });
  }

  coffeegramForm.on('submit', function (event) {
    event.preventDefault();

    var form = this;
    form.submit.disabled = true;
    var image = form.image;
    image.disabled = true;
    var formData = new FormData(form);
    image.disabled = false;
    var file = image.files[0];

    processImage(file, imageProcessOpts, blob => {
      formData.append('image', blob, blob.name);
      var promise = $.ajax(form.action, {
        dataType: 'json',
        method: form.method,
        data: formData,
        contentType: false,
        processData: false
      });

      promise.then((response) => {
        form.submit.disabled = false;
        window.location.href = response.next;
      });
      promise.catch(console.error);
    });
  });

})(window);
