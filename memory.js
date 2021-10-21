let gameover, started, selection
let turns, timer, start_time, size
let sizes = [
    { width: 4, height: 3 }, // 12
    { width: 4, height: 4 }, // 16
    { width: 6, height: 4 }, // 24
    { width: 6, height: 5 }, // 30
    { width: 7, height: 6 }, // 42
    { width: 10, height: 6 }, // 60
    { width: 12, height: 7 }, // 84
    { width: 10, height: 10 } // 100
]

// reset game
function reset() {
    // reset variables
    size = sizes[parseInt(slider_size.value)]
    gameover = started = false
    turns = 0
    selection = null
    if (timer) clearInterval(timer)
    label_turns.innerText = 'click a card to start'

    // clear board
    container.classList.remove('gameover')
    grid.querySelectorAll('*').forEach(e => e.remove())

    // generate card values
    let values = []
    for (let i = 0; i < (size.width * size.height) / 2; i++) {
        // make sure there are no duplicates
        let value
        do value = parseInt(Math.floor(Math.random() * 50))
        while (values.includes(value))

        values.push(value)
        values.push(value)
    }

    // inject cards
    for (let y = 0; y < size.height; y++) {
        let row = document.createElement('row')
        for (let x = 0; x < size.width; x++) {
            // container for card
            let container = document.createElement('container')

            // card
            let card = document.createElement('card')
            card.setAttribute('turned', false)
            card.addEventListener('click', e => turn(card))

            // random card value from matching pairs
            card.setAttribute('selection', values.splice(parseInt(Math.floor(Math.random() * values.length)), 1))

            // animation delay
            card.style.animationDelay = ((x / size.width) + (y / size.height)).toFixed(2) + 's'

            // back and frontside
            let backside = document.createElement('side')
            backside.className = 'back'
            let frontside = document.createElement('side')
            frontside.className = 'front'

            // append
            card.append(frontside, backside)
            container.append(card)
            row.append(container)
        }
        grid.append(row)
    }

    // reset timer text
    label_timer.innerText = '00:00:00'
}

// turn over a card
function turn(card) {
    if (gameover == false && card.getAttribute('turned') == 'false') {
        if (!started) {
            // start timer
            started = true
            start_time = new Date().getTime()
            timer = setInterval(() => {
                let t = new Date().getTime() - start_time
                let h = Math.floor(t / 3600000)
                h = h.toString().length == 1 ? '0' + h : h
                t -= h * 3600000
                let m = Math.floor(t / 60000)
                m = m.toString().length == 1 ? '0' + m : m
                t -= m * 60000
                let s = Math.floor(t / 1000)
                s = s.toString().length == 1 ? '0' + s : s
                t -= s * 1000

                label_timer.innerText = `${h}:${m}:${s}`
            }, 100)
        }

        if (!selection) {
            // turn first card of selection
            card.setAttribute('turned', true)
            selection = card
        } else {
            card.setAttribute('turned', true)
            if (selection.getAttribute('selection') != card.getAttribute('selection')) {
                let card_1 = selection
                setTimeout(() => {
                    card_1.setAttribute('turned', false)
                    card.setAttribute('turned', false)
                }, 700)
            }
            turns++
            label_turns.innerText = `${turns} turn${turns == 1 ? '' : 's'}`
            if (selection.getAttribute('selection') == card.getAttribute('selection') && document.querySelectorAll(`card[turned='false']`).length == 0) win()
            selection = null
        }
    }
}

// win
function win() {
    if (timer) clearInterval(timer)
    gameover = true
    container.classList.add('gameover')
    label_turns.innerText = `finished after ${turns} turn${turns == 1 ? '' : 's'}`
}

// timer label
let label_timer = document.querySelector('#label_timer')

// turns label
let label_turns = document.querySelector('#label_turns')

// reset btn
let btn_reset = document.querySelector('#reset')
btn_reset.addEventListener('click', reset)

// size slider
let slider_size = document.querySelector('#slider_size')
slider_size.addEventListener('input', e => document.querySelector('#label_size').innerText = `size: ${sizes[parseInt(slider_size.value)].width}x${sizes[parseInt(slider_size.value)].height}`)

// grid for injecting cards
let grid = document.querySelector('grid')

// main container
let container = document.querySelector('game')

// start
reset()