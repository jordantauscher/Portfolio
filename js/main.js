// elements

const screenEL = document.querySelector("#screen")
const navbarEL = document.querySelector("#navbar")
const homeLinkEL = document.querySelector("#navbar #home a")
const aboutLinkEL = document.querySelector("#navbar #about a")
const projectsMenuLinkEL = document.querySelector("#navbar #projects a")

const projectData = (async () => await getProjectData())()
// events

window.addEventListener("DOMContentLoaded", init)

homeLinkEL.addEventListener("click", () => moveElementOutOfView("#screen"))
aboutLinkEL.addEventListener("click", () => showAboutPage())
projectsMenuLinkEL.addEventListener("click", () => {
    Array.from(document.querySelectorAll("#navbar li a")).forEach(a =>{
        a.addEventListener("click", () => projectsMenuLinkEL.innerText = "projects")
    }) 
    showProjectMenu()
})

document.addEventListener("click", async e => {
    const ids = (await projectData).map(data => titleToID(data.title))
    if(ids.includes(e.target.id || e.target.parentElement.id) && e.target.className !== "project-title"){
        projectsMenuLinkEL.innerText = "back"
        showProject(e.target.id || e.target.parentElement.id)
    }
})

// functions

async function showAboutPage(){
    const html = createAboutPage()
    moveElementOutOfView("#screen").then(() => {
        screenEL.className = "about"
        replaceElementHTML(screenEL, html);
        moveElementIntoView("#screen");
    })
}

async function showProjectMenu(){
    const html = createProjectMenu(await projectData);
    moveElementOutOfView("#screen").then(() => {
        screenEL.className = "project-menu"
        replaceElementHTML(screenEL, html);
        moveElementIntoView("#screen");
    })
}

async function showProject(id){
    const data = (await projectData).find(project => titleToID(project.title) === id)
    const html = createProjectPage(data)
    await moveElementOutOfView("#screen").then(() => {
        screenEL.className = "project"
        replaceElementHTML(screenEL, html)
        moveElementIntoView("#screen")  
    })
}

function createAboutPage(){
    return `
    <h1 class="project-title">About</h1>
    <div class="project-content-wrapper">
        <div class="container">
            <h2 class="project-subtitle">Background</h2>
            <p class="project-description">Hi I'm Jordan, a self taught web developer based in the UK. I specialise in front-end development and am proficient in languages HTML, CSS, and JavaScript. I love programming creatively by building new modern and practical software that aims solve day to day issues faced by it's end users, I also have a passion for innovating on existing concepts to improve the quality of the technology and the user's experience as a whole.</p>
        </div>
        <div class="container">
            <h2 class="project-subtitle">Contact Me</h2>
            <p class="project-description">The best place to contact me is my personal email address <strong>jordantauscher@yandex.com</strong> or my
            <a href="https://www.linkedin.com/in/jordantauscherdev" target="_blank"><strong>linkedin</strong></a> page.</p>
        </div>
        <div class="social-icons">
            <a href="https://www.linkedin.com/in/jordantauscherdev" target="_blank">
                
                <i class="icon fa-brands fa-linkedin-in fa-2x" title="www.linkedin.com/in/jordantauscherdev"></i>
            </a>
            <a>
                <i class="icon fa-solid fa-envelope fa-2x" title="jordantauscher@yandex.com"></i>
            </a>
        </div>
    </div>`
}

function createProjectMenu(data){
    let html = "";
    data.forEach(project => html += createProjectMenuItem(project));
    return html

    function createProjectMenuItem(data){
        return `
        <div id="${titleToID(data.title)}" class="project-mini">
            <img class="project-icon" src="${data.images[0] || "/img/blank.png"}" alt=""></img>
            <div class="project-mini-title">${data.title}</div>
        </div>
        `
    }
}

function createProjectPage(data){
    
    return `
        <div id=${data.title.toLowerCase().replace(" ", "-")}>
            ${createProjectTitleElement(data)}
            <div class="project-content-wrapper">
                <div class="container">
                    ${createProjectDescriptionElement(data)}
                </div>
                <div class="container">
                    ${createTechnologyListElement(data)}
                </div>
                <div class="container">
                    ${createLinkListElement(data)}
                </div>
            </div>
        </div>
    `

    function createProjectTitleElement(data){
        return `
            <h1 class="project-title">${data.title}</div></h1>
        `
    }

    function createProjectDescriptionElement(data){
        return `
            <h2 class="project-subtitle">Purpose</h2>
            <div class="project-description">${data.description}</div>
        `
    }

    function createTechnologyListElement(data){
        const technology = document.createElement("div");
        
        const technologyTitle = document.createElement("h2");
        technologyTitle.classList.add("project-subtitle");
        technologyTitle.innerText = "Technology";
    
        const technologyList = document.createElement("ul")
        technologyList.id = "technology-list"
        data.technology.map(text => {
            const li = document.createElement("li");
            li.classList.add("button");
            li.innerText = text;
            return li
        }).forEach(li => {technologyList.appendChild(li)})
        
        technology.appendChild(technologyTitle);
        technology.appendChild(technologyList);

        return technology.innerHTML
    }

    function createLinkListElement(data){
        return `
            <h2 class="project-subtitle">Links</h2>
            <ul id="link-list">
                <li class="button"><a href="${data.links.source}" target="_blank">Source</li>
                <li class="button"><a href="${data.links.live}" target="_blank">Live</li>
            </ul>
        `
    }
}

// utils

async function init(){
    const initialDisplayStyle = screenEL.style.display
    screenEL.style.display = "hidden"
    centerElement(screenEL).then(() => {
        moveElementOutOfView("#screen", 100, 0);
        screenEL.style.display = initialDisplayStyle
    })
}

function moveElement(element, x, y, props={duration: 0, fill: "forwards"}){
    element.animate([{transform: `translate(${x}px, ${y}px)`}], props)
    return new Promise(resolve => setTimeout(resolve, props.duration))
}

async function moveElementOutOfView(id, pixelsFromEdge=200, duration=600){
    const element = document.querySelector(id);
    const n = window.innerHeight + pixelsFromEdge;
    [x, y] = getElementTransformValue(element);
    await moveElement(element, x , n, {duration, fill: "forwards"});
}

async function moveElementIntoView(id, duration=600){
    const element = document.querySelector(id);
    centerElement(element, {duration, fill: "forwards"})
}

function centerElement(element, props={duration:0, fill: "forwards"}){
    element.animate([{transform: `translate(-50%, -50%)`}], props)
    element.animate([{top: "50%"}], props)
    element.animate([{left: "50%"}], props)
    return new Promise(resolve => setTimeout(resolve, props.duration))
}

function getElementTransformValue(element){
    try {
        const prop = getComputedStyle(element).transform;
        const matrix = prop.replace(/[A-Za-z()\s]/g, "").split(",");
        const x = parseInt(matrix[4]) || 0, y = parseInt(matrix[5]);
        return [x, y];
    } catch (error) {
        console.error(`Error: ${element.id} does not possess a transform property\n`)
    }
}

async function getProjectData(){
    const response = await fetch('/fake-end/database.json');
    const data = await response.json();
    return data
}

function titleToID(string){
    return string.toLowerCase().replace(/\s/g, "-");
}

function replaceElementHTML(element, html){
    element.innerHTML = html
}