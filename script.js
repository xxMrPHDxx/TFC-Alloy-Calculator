setTimeout(async (a,b)=>{
	function loadJSON(a){ return fetch(a).then(a=>a.json()); }
	function loadImage(a){ return new Promise((b,c)=>{const d=new Image(); d.onload=()=>b(d); d.onerror=c; d.src=a}); }
	function map(a,b,c,d,e){ return d+(e-d)*(a-b)/(c-b); }
	function minmax(a,b,c){ return Math.max(Math.min(a, c), b); }
	function clear(){ g.drawImage(i,0,0); }
	const [c, d] = await Promise.all(['alloys','items'].map(a=>loadJSON(`data/config/${a}.json`)));
	const e = b.querySelector('div#app');
	const f = b.createElement('canvas'), g = f.getContext('2d');
	f.width = f.height = 400; g.imageSmoothingEnabled = false;
	f.id = 'gui'; e.appendChild(f); 
	const h = await Promise.all(d.map(({icon})=>loadImage(icon)));
	const MAX_SCROLL = Math.ceil(h.length/9)-4;
	const i = await loadImage('data/gui/gui.png');

	/*
	for(let i=0; i<h.length;i++){
		const a = i%10, b = (i/10)|0, c=h[i];
		const d = a*(36), e = b*(36);
		g.drawImage(c,0,0,c.width,c.height,d,e,32,32);
	}*/

	function drawItems(a=0){
		clear();
		for(let b=0; b<4*9; b++){
			const c=b%9, d=a+(b/9)|0;
			const e=39+c*36, f=213+36*((b/9)|0);
			const i=h[d*9+c];
			if(i) g.drawImage(i,0,0,i.width,i.height,e,f,32,32);
		}
	}
	function onWheel(e){
		e.preventDefault();
		const a=e.offsetX, b=e.offsetY, c=e.target;
		if(a>37 && a<37+324 && b>211 && b<144+211){
			c.scrollY = minmax((!c.scrollY?0:c.scrollY)+e.deltaY*0.3, 0, MAX_SCROLL);
			drawItems(c.scrollRow = c.scrollY|0);
		}
	}
	f.addEventListener('wheel', onWheel.bind(g));
	for(let i=0; i<4; i++){
		for(let j=i+1; j<4; j++){
			const k = (Math.random()*20-10)|0;
			console.log(k, i, j, minmax(k, i, j))
		}
	}
	drawItems();
}, 0, window, document);