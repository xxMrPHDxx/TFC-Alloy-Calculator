setTimeout(async (a,b)=>{
	function loadJSON(a){ return fetch(a).then(a=>a.json()); }
	function loadImage(a){ return new Promise((b,c)=>{const d=new Image(); d.onload=()=>b(d); d.onerror=c; d.src=a}); }
	async function loadSheet(a,c,d){
		const h = await loadImage(a), i = [];
		for(let f=0; f<h.height; f+=d){
			for(let e=0; e<h.width; e+=c){
				const g=b.createElement('canvas').getContext('2d');
				g.canvas.width = c; g.canvas.height = d;
				g.imageSmoothingEnabled = !!0;
				g.drawImage(h,e,f,c,d,0,0,c,d);
				i.push(g.canvas);
			}
		}
		return i;
	}
	function map(a,b,c,d,e){ return d+(e-d)*(a-b)/(c-b); }
	function minmax(a,b,c){ return Math.max(Math.min(a, c), b); }
	function clear(){ g.drawImage(i,0,0); }
	const [c, d] = await Promise.all(['alloys','items'].map(a=>loadJSON(`data/config/${a}.json`)));
	const e = b.querySelector('div#app');
	const f = b.createElement('canvas'), g = f.getContext('2d');
	f.width = f.height = 400; g.imageSmoothingEnabled = !!0;
	f.id = 'gui'; e.appendChild(f); 
	const h = await Promise.all(d.map(({icon})=>loadImage(icon)));
	const MAX_SCROLL = Math.ceil(h.length/9)-4;
	const i = await loadImage('data/gui/gui.png');
	const j = await loadSheet('data/gui/overlay.png',32,32);
	function drawTextOverlay(ctx,text,x,y,color='black',size=8,font='minecraftfont') {
		const len = text.length, w = len*size, t = ctx.measureText(text);
		const tw = t.width, cols = Math.max(Math.ceil(w/32),3)|0;
		const pw = cols<<5, ph = 3<<5;
		function draw(a,b,c,d){ a.drawImage(b, x+c*32, y+d*32); }
		for(let i=0; i<cols; i++){
			for(let k=0; k<3; k++){
				const u=k===0,d=k===2,l=i===0,r=i===cols-1;
				const flag = [u,d,l,r].reduce((a,b)=>(a<<1)|(b?1:0),0);
				let idx;
				switch(flag){
					case 0:  idx=4; break; case 1:  idx=5; break; case 2:  idx=3; break; case 4:  idx=7; break; case 5:  idx=8; break;
					case 6:  idx=6; break; case 8:  idx=1; break; case 9:  idx=2; break; case 10: idx=0; break; default: continue;
				}
				draw(ctx, j[idx], i, k);
			}
		}
		ctx.font = `${size}px ${font}`;
		ctx.fillStyle = color;
		ctx.fillText(text, x+(pw-tw-size*(len%2==0?2:1))/2, y+(ph)/2);
	}
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
	drawItems();
	drawTextOverlay(g, 'Test', 60, 60, 'white', 16);
}, 0, window, document);