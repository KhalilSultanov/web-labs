document.addEventListener('DOMContentLoaded', () => {
    const $slider = $('.block_popular-cards');

    if ($slider.length) {
        $slider.slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            arrows: true,
            dots: true,
        });
    } else {
        console.warn('Слайдер не найден!');
    }
});
