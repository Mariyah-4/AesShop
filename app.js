(() => {
  const products = window.SOULSTACY_PRODUCTS || [];
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat("en-IN", {style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
  const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  let cart = safeRead("soulstacy-cart", []);
  let wishlist = safeRead("soulstacy-wishlist", []);
  let toastTimer;

  function save() {
    try { localStorage.setItem("soulstacy-cart", JSON.stringify(cart)); localStorage.setItem("soulstacy-wishlist", JSON.stringify(wishlist)); }
    catch { showToast("Your browser couldn't save changes. Check storage settings."); }
    updateCounts(); renderCart(); renderWishlist();
  }
  function showToast(message) {
    const el=$("#toast"); el.textContent=message; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove("show"),2800);
  }
  function productCard(p) {
    const loved=wishlist.includes(p.id);
    return `<article class="product-card">
      <div class="product-image-wrap"><button class="product-image-button" data-details="${p.id}" aria-label="View ${p.title} details"><img src="${p.image}" alt="${p.title} artwork preview" loading="lazy"><span class="quick-view">Quick view ↗</span></button>
      ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="heart-button ${loved?"is-loved":""}" data-wish="${p.id}" aria-label="${loved?"Remove from":"Add to"} favourites">${loved?"♥":"♡"}</button></div>
      <div class="product-meta"><span>${p.category}</span><span>${p.ratio}</span></div><button class="product-title" data-details="${p.id}">${p.title}</button>
      <div class="product-bottom"><strong>${money(p.price)}</strong><button class="add-mini" data-add="${p.id}" aria-label="Add ${p.title} to bag">＋ Add to bag</button></div>
    </article>`;
  }
  function renderGrid(list, target) { $(target).innerHTML=list.map(productCard).join(""); }
  function updateCounts() {
    $("#cartCount").textContent=cart.reduce((n,x)=>n+x.qty,0);
    $("#wishCount").textContent=wishlist.length;
    $("#drawerCount").textContent=`(${cart.reduce((n,x)=>n+x.qty,0)})`;
    $("#wishlistDrawerCount").textContent=`(${wishlist.length})`;
  }
  function renderCart() {
    const el=$("#cartItems");
    if (!cart.length) { el.innerHTML='<div class="empty-state"><span>♡</span><h3>Your bag is taking a breath.</h3><p>Add a piece that feels like you, and it will find its way here.</p><button class="text-link" data-close>Explore the collection ↗</button></div>'; $("#cartSubtotal").textContent=money(0); return; }
    el.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id); if(!p)return "";return `<div class="drawer-item"><img src="${p.image}" alt=""><div class="drawer-item-info"><b>${p.title}</b><small>${p.format}</small><strong>${money(p.price)}</strong><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">＋</button><button class="remove-item" data-remove="${p.id}">Remove</button></div></div></div>`}).join("");
    $("#cartSubtotal").textContent=money(cart.reduce((sum,item)=>sum+(products.find(p=>p.id===item.id)?.price||0)*item.qty,0));
  }
  function renderWishlist() {
    const el=$("#wishlistItems"), list=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);
    el.innerHTML=list.length?list.map(p=>`<div class="drawer-item"><img src="${p.image}" alt=""><div class="drawer-item-info"><b>${p.title}</b><small>${p.category}</small><strong>${money(p.price)}</strong><button class="add-mini" data-add="${p.id}">＋ Add to bag</button><button class="remove-item" data-wish="${p.id}">Remove favourite</button></div></div>`).join(""):'<div class="empty-state"><span>♡</span><h3>Keep the pieces you love close.</h3><p>Tap the little heart on any artwork to save it here.</p></div>';
  }
  function updateShop() {
    const query=$("#searchInput").value.trim().toLowerCase(), category=$("#categoryFilter").value, sort=$("#sortFilter").value;
    let list=products.filter(p=>(category==="All"||p.category===category)&&(!query||[p.title,p.category,p.description,p.tag].join(" ").toLowerCase().includes(query)));
    if(sort==="price-asc")list.sort((a,b)=>a.price-b.price);
    if(sort==="price-desc")list.sort((a,b)=>b.price-a.price);
    if(sort==="newest")list.sort((a,b)=>b.newest-a.newest);
    if(sort==="popular")list.sort((a,b)=>b.popularity-a.popularity);
    $("#resultCount").textContent=`${list.length} ${list.length===1?"piece":"pieces"}`;
    $("#noResults").classList.toggle("hidden",!!list.length); renderGrid(list,"#shopGrid");
  }
  function addToCart(id) {
    const found=cart.find(x=>x.id===id); if(found)found.qty++;else cart.push({id,qty:1});
    save(); showToast("A little beauty added to your bag.");
  }
  function toggleWish(id) {
    wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id]; save();
    renderGrid(products.filter(p=>p.popularity>=85),"#bestsellerGrid"); updateShop();
    showToast(wishlist.includes(id)?"Saved to your favourites.":"Removed from your favourites.");
  }
  function openDrawer(id) {
    closeAll(); $("#overlay").classList.add("visible"); $(id).classList.add("open"); $(id).setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll");
  }
  function closeAll() {
    $$(".side-drawer").forEach(d=>{d.classList.remove("open");d.setAttribute("aria-hidden","true")});
    $("#overlay").classList.remove("visible"); document.body.classList.remove("no-scroll");
  }
  function showProduct(id) {
    const p=products.find(x=>x.id===id); if(!p)return;
    const related=products.filter(x=>x.id!==p.id&&x.category===p.category).slice(0,2);
    $("#modalContent").innerHTML=`<div class="modal-product"><div class="modal-product-image"><img src="${p.image}" alt="${p.title} artwork preview"></div><div class="modal-product-copy"><p class="eyebrow">${p.category}</p><h2 id="modalTitle">${p.title}</h2><p class="modal-price">${money(p.price)}</p><p>${p.description}</p><div class="spec-list"><div><span>FILE FORMAT</span><b>${p.format}</b></div><div><span>RESOLUTION</span><b>${p.resolution}</b></div><div><span>ASPECT RATIO</span><b>${p.ratio}</b></div><div><span>LICENCE</span><b>Personal use only</b></div></div><p class="licence-note">Digital product only. No physical item will be shipped. Personal use means you may print or display this artwork for yourself; resale, redistribution, and commercial use are not included.</p><button class="button button-dark full-button" data-add="${p.id}">Add to bag — ${money(p.price)} ↗</button><button class="modal-wish" data-wish="${p.id}">${wishlist.includes(p.id)?"♥ Saved to favourites":"♡ Save to favourites"}</button>${related.length?`<div class="related-mini"><span>MORE IN THIS MOOD</span>${related.map(r=>`<button data-details="${r.id}">${r.title} ↗</button>`).join("")}</div>`:""}</div></div>`;
    $("#productModal").classList.add("visible"); $("#productModal").setAttribute("aria-hidden","false"); document.body.classList.add("no-scroll");
  }
  function closeModal(){ $("#productModal").classList.remove("visible");$("#productModal").setAttribute("aria-hidden","true");document.body.classList.remove("no-scroll"); }
  function init() {
    const categories=[...new Set(products.map(p=>p.category))].sort();
    $("#categoryFilter").insertAdjacentHTML("beforeend",categories.map(c=>`<option value="${c}">${c}</option>`).join(""));
    renderGrid(products.filter(p=>p.popularity>=85),"#bestsellerGrid"); updateShop(); save(); $("#year").textContent=new Date().getFullYear();
    ["input","change"].forEach(evt=>{$("#searchInput").addEventListener(evt,updateShop);$("#categoryFilter").addEventListener(evt,updateShop);$("#sortFilter").addEventListener(evt,updateShop)});
  }
  document.addEventListener("click",e=>{
    const add=e.target.closest("[data-add]"), wish=e.target.closest("[data-wish]"), details=e.target.closest("[data-details]"), qty=e.target.closest("[data-qty]"), remove=e.target.closest("[data-remove]"), close=e.target.closest("[data-close]");
    if(add){e.preventDefault();addToCart(add.dataset.add);if($("#productModal").classList.contains("visible"))closeModal();}
    if(wish){e.preventDefault();toggleWish(wish.dataset.wish);if($("#productModal").classList.contains("visible")){const id=wish.dataset.wish;showProduct(id);}}
    if(details){e.preventDefault();showProduct(details.dataset.details);}
    if(qty){const item=cart.find(x=>x.id===qty.dataset.qty);if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<1)cart=cart.filter(x=>x.id!==item.id);save();}}
    if(remove){cart=cart.filter(x=>x.id!==remove.dataset.remove);save();showToast("Removed from your bag.");}
    if(close)closeAll();
    const categoryLink=e.target.closest("[data-category]");
    if(categoryLink){$("#categoryFilter").value=categoryLink.dataset.category;updateShop();}
  });
  $("#cartToggle").addEventListener("click",()=>openDrawer("#cartDrawer"));
  $("#wishlistToggle").addEventListener("click",()=>openDrawer("#wishlistDrawer"));
  $("#overlay").addEventListener("click",closeAll);
  $("#modalClose").addEventListener("click",closeModal);
  $("#productModal").addEventListener("click",e=>{if(e.target===$("#productModal"))closeModal()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeAll();closeModal()}});
  $("#searchToggle").addEventListener("click",()=>{$("#shop").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#searchInput").focus(),450)});
  $("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("nav-open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").textContent=open?"×":"☰"});
  $$("#mainNav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("nav-open");$("#menuToggle").setAttribute("aria-expanded","false");$("#menuToggle").textContent="☰"}));
  $("#checkoutButton").addEventListener("click",()=>showToast("Demo checkout only — connect a secure payment provider before accepting orders."));
  $("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=$("#newsletterEmail").value.trim();if(!email||!email.includes("@")){$("#newsletterMessage").textContent="Please enter a valid email address.";return;}$("#newsletterMessage").textContent="Thank you — this demo form isn't connected to a mailing service yet.";e.target.reset();});
  $("#contactForm").addEventListener("submit",e=>{e.preventDefault();$("#contactMessage").textContent="Your message is validated, but this demo form is not connected to a server. Please email hello@soulstacystudio.example after replacing it with your real support address.";});
  init();
})();