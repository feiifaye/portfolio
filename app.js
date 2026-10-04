const projects=window.ARTIST_PROJECTS;
const gallery=document.getElementById('gallery');
const dialog=document.getElementById('project-dialog');
let currentIndex=0;
const number=i=>String(i+1).padStart(2,'0');
projects.forEach((project,index)=>{
  const button=document.createElement('button');button.type='button';button.className='project';button.dataset.index=index;button.setAttribute('aria-label',`View ${project.title}`);
  const frame=document.createElement('span');frame.className='project-frame';frame.style.setProperty('--tone',project.tone);if(project.width&&project.height)frame.style.aspectRatio=`${project.width} / ${project.height}`;
  if(project.image){const img=document.createElement('img');img.src=project.image;img.alt=`Project ${number(index)}: ${project.title}`;img.width=project.width;img.height=project.height;img.loading=index?'lazy':'eager';frame.append(img);}else{const label=document.createElement('span');label.className='placeholder-label';label.textContent='Project image';const count=document.createElement('span');count.className='frame-number';count.textContent=number(index);frame.append(label,count);}
  const caption=document.createElement('span');caption.className='mobile-caption';const title=document.createElement('span');title.textContent=project.title;const year=document.createElement('span');year.textContent=`Project ${number(index)}`;caption.append(title,year);button.append(frame,caption);button.addEventListener('click',()=>openProject(index));button.addEventListener('mouseenter',()=>updateCaption(index));button.addEventListener('focus',()=>updateCaption(index));gallery.append(button);
});
function updateCaption(index){const project=projects[index];document.getElementById('current-title').textContent=project.title;document.getElementById('current-medium').textContent=`Project ${number(index)}`;}
let ticking=false;
function updateOnScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{if(!document.getElementById('work').hidden){const center=window.innerHeight*.5;let closest=0,distance=Infinity;gallery.querySelectorAll('.project').forEach((el,index)=>{const rect=el.getBoundingClientRect();const d=Math.abs(rect.top+rect.height/2-center);if(d<distance){distance=d;closest=index;}});updateCaption(closest);}ticking=false;});}
window.addEventListener('scroll',updateOnScroll,{passive:true});window.addEventListener('resize',updateOnScroll);
function renderProject(index){currentIndex=(index+projects.length)%projects.length;const p=projects[currentIndex];document.getElementById('project-title').textContent=p.title;document.getElementById('project-meta').textContent=[`Project ${number(currentIndex)}`,p.medium,p.year,p.location].filter(Boolean).join(' / ');document.getElementById('project-description').textContent=p.description;document.getElementById('project-count').textContent=`${number(currentIndex)} / ${number(projects.length-1)}`;const frame=document.getElementById('detail-image');frame.style.background=p.tone;frame.replaceChildren();if(p.image){const img=document.createElement('img');img.src=p.image;img.alt=p.title;frame.append(img);}else{const label=document.createElement('span');label.textContent='Project image';const count=document.createElement('span');count.textContent=number(currentIndex);frame.append(label,count);}}
function openProject(index){renderProject(index);document.body.classList.add('modal-open');dialog.showModal();}
document.getElementById('close-project').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));document.getElementById('previous-project').addEventListener('click',()=>renderProject(currentIndex-1));document.getElementById('next-project').addEventListener('click',()=>renderProject(currentIndex+1));
function navigate(){const page=['work','visual-design','info','research'].includes(location.hash.slice(1))?location.hash.slice(1):'work';document.querySelectorAll('.view').forEach(el=>el.hidden=el.id!==page);document.querySelectorAll('nav a').forEach(el=>{if(el.dataset.page===page)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});if(dialog.open)dialog.close();document.title=`${page==='work'?'Selected Work':page==='info'?'Info':page==='visual-design'?'Visual design':'Research'} — Faye Xi (Fei Xi)`;window.scrollTo({top:0,behavior:'instant'});updateOnScroll();}
window.addEventListener('hashchange',navigate);navigate();

const designSlideshow=document.getElementById('design-slideshow');
const designSlides=Array.from(designSlideshow.querySelectorAll('img'));
let designIndex=0;
function showDesignSlide(index){
  designIndex=(index+designSlides.length)%designSlides.length;
  designSlides.forEach((slide,i)=>{slide.hidden=i!==designIndex;});
  designSlideshow.setAttribute('aria-label',`${designSlides[designIndex].alt}. Image ${designIndex+1} of ${designSlides.length}. Show next image.`);
}
designSlideshow.addEventListener('click',()=>showDesignSlide(designIndex+1));
designSlideshow.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){
    event.preventDefault();
    showDesignSlide(designIndex+(event.key==='ArrowRight'?1:-1));
  }
});
