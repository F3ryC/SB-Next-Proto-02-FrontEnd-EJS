document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle")
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", () => {
      document.body.classList.toggle("menu-open")
    })
  }

  // Pricing toggle
  const billingToggle = document.getElementById("billing-toggle")
  if (billingToggle) {
    billingToggle.addEventListener("change", function () {
      document.body.classList.toggle("annual", this.checked)
    })
  }

  // Testimonial slider (simple version)
  const testimonialSlider = document.querySelector(".testimonial-slider")
  if (testimonialSlider) {
    let isDown = false
    let startX
    let scrollLeft

    testimonialSlider.addEventListener("mousedown", (e) => {
      isDown = true
      testimonialSlider.classList.add("active")
      startX = e.pageX - testimonialSlider.offsetLeft
      scrollLeft = testimonialSlider.scrollLeft
    })

    testimonialSlider.addEventListener("mouseleave", () => {
      isDown = false
      testimonialSlider.classList.remove("active")
    })

    testimonialSlider.addEventListener("mouseup", () => {
      isDown = false
      testimonialSlider.classList.remove("active")
    })

    testimonialSlider.addEventListener("mousemove", (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - testimonialSlider.offsetLeft
      const walk = (x - startX) * 2
      testimonialSlider.scrollLeft = scrollLeft - walk
    })
  }
})
