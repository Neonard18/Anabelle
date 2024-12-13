function scrollToLeft() {
    const element = document.getElementsByClassName("fp-grid")[0];
    // Scroll 300 pixels left
    element.scrollBy({
        top: 0,
        left: -290,
        behavior: 'smooth'  // Adds smooth scrolling effect
    });
}

function scrollToRight() {
    const element = document.getElementsByClassName("fp-grid")[0];
    // Scroll 300 pixels right
    element.scrollBy({
        top: 0,
        left: 290,
        behavior: 'smooth'  // Adds smooth scrolling effect
    });
}