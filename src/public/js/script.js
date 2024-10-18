const hireBtn = document.querySelector(".hireBtn");
const extraOptions = document.querySelector(".extraOptions");
if (hireBtn) {
    hireBtn.addEventListener('click', (evt) => {
        if(extraOptions.classList.contains("hidden")){
            extraOptions.classList.remove("hidden")
        }else{
            extraOptions.classList.add("hidden")
        }
    });
} else {
    console.error("Element with class .hireBtn not found");
}
