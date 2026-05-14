const toggle=document.getElementById('toggle');

const menu=document.getElementById('menu');

if(toggle){

  toggle.addEventListener('click',()=>{

    menu.classList.toggle('show');

  });

}

const counters=document.querySelectorAll('.mini-card h3');

counters.forEach(counter=>{

  const target=+counter.innerText;

  let count=0;

  const update=()=>{

    const increment=target/50;

    if(count<target){

      count+=increment;

      counter.innerText=Math.ceil(count);

      requestAnimationFrame(update);

    }

    else{

      counter.innerText=target;

    }

  }

  update();

});