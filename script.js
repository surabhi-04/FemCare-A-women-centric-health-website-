const container = document.querySelector('.container')
const text = document.querySelector('#text')

const totalTime = 7500
const breatheTime = (totalTime/5)*2
const holdTime = totalTime / 5

breatheAnimation()

function breatheAnimation () {
    text.innerHTML = 'Breathe In!'
    container.className = 'container grow'

    setTimeout(() => {
        text.innerText = 'Hold'

        setTimeout(()=> {
            text.innerText = 'Breathe Out!'
            container.className = 'container shrink'
        }, holdTime)
    }, breatheTime)
}

setInterval(breatheAnimation, totalTime)
document.addEventListener('DOMContentLoaded', (event) => {
    const inputField = document.querySelector('.input-area input');

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Add your CSS class or perform any action here
            document.querySelector('.chat-window').style.display = 'flex';
        }
    });
});
