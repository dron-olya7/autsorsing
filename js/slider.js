lightbox.option({
  resizeDuration: 200,
  wrapAround: true,
  albumLabel: "Изображение %1 из %2",
});
$(".owl-carousel-pisma").owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  dots: false,
  responsive: {
    0: {
      items: 1,
      dots: true,
    },
    600: {
      items: 1,
      dots: true,
    },
    900: {
      items: 3,
      dots: true,
    },
  },
});

$(document).ready(function () {
  $(".owl-person_outsourcing").trigger("destroy.owl.carousel");

  $(".owl-person_outsourcing").owlCarousel({
    items: 1,
    loop: true,
    margin: 0,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    smartSpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1200: {
        items: 1,
      },
    },
  });
  $(".custom-next").click(function () {
    $(".owl-person_outsourcing").trigger("next.owl.carousel");
  });

  $(".custom-prev").click(function () {
    $(".owl-person_outsourcing").trigger("prev.owl.carousel");
  });
});

$(document).ready(function () {
  $(".owl-provided-employees").trigger("destroy.owl.carousel");
  $(".owl-provided-employees").owlCarousel({
    items: 3.5,
    loop: true,
    margin: 20,
    nav: true,
    dots: true,
    autoplay: false,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    responsive: {
      0: {
        items: 1,
        margin: 10,
      },
      480: {
        items: 1.5,
        margin: 15,
      },
      768: {
        items: 2.5,
        margin: 15,
      },
      1200: {
        items: 3,
        margin: 20,
      },
      1400: {
        items: 3.5,
        margin: 20,
      },
    },
  });

  $(".custom-next-employees").click(function () {
    $(".owl-provided-employees").trigger("next.owl.carousel");
  });
});
