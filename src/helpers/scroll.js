

export const getCatalogLastScrollPosition = () => {
  let lastScrollY = sessionStorage.getItem("catalogLastScrollY")
  return lastScrollY || 0
}

export const setCatalogLastScrollPosition = (v) =>{
  sessionStorage.setItem("catalogLastScrollY", v)
}

export const scrollYTo = (height) =>{
  window.setTimeout(function () {
    window.scrollTo(0, height || 0);
  }, 2);
}