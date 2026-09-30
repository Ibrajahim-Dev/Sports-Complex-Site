const b=document.querySelector(".burger"),n=document.querySelector(".nav");
b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)};
document.getElementById("yr").textContent=new Date().getFullYear();
const f=document.getElementById("bk");if(f)f.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(f));
const m=`Booking request%0AName: ${v.n}%0AGame: ${v.g}%0ADate: ${v.d}%0ATime: ${v.t}%0APlayers: ${v.p}`;
window.open("https://wa.me/923000000000?text="+m,"_blank")};