// JavaScript Document
// HTML5 Ad Template JS from DoubleClick by Google

"use strict"

// DOM Elements
let container = null
let content = null
let internalDiv = null
let bgExt = null
let btnClose = null
let scenes = null
let timer = null
let sound = null
let cta = null
let bounds = null
let instructions = null
let icons = {
    guitar: null,
    mic: null
}
let phs = {
    guitar: null,
    mic: null
}

// State
let currentTime = 15
let introTime = 8
let interacted = false
let isVertical = false
let score = 0

// Animations
let tl = null

// Timers
let introTimer = null
let gameTimer = null

// Images
let loadedImages = 0
let imageArray = new Array(
    "close.png",
    "dl_loading.gif",
    "images/background.jpg",
    "images/bus.png",
    "images/clock.png",
    "images/cta.png",
    "images/endcard_copyright.png",
    "images/endcard_product.png",
    "images/endcard_txt.png",
    "images/game_instructions.png",
    "images/game_message_great.png",
    "images/game_message_yeah.png",
    "images/guitar_bus.png",
    "images/guitar_cursor.png",
    "images/guitar_icon_1.png",
    "images/guitar_icon_2.png",
    "images/logo.png",
    "images/mic_cursor.png",
    "images/mic_icon_1.png",
    "images/mic_icon_2.png",
    "images/mic_bus.png",
    "images/stripe.png"
)

let uclass = {
    exists: function (elem, className) { let p = new RegExp("(^| )" + className + "( |$)"); return (elem.className && elem.className.match(p)) },
    add: function (elem, className) { if (uclass.exists(elem, className)) { return true } elem.className += " " + className },
    remove: function (elem, className) { let c = elem.className; let p = new RegExp("(^| )" + className + "( |$)"); c = c.replace(p, " ").replace(/  /g, " "); elem.className = c }
}

// Enabler.loadModule(studio.module.ModuleId.VIDEO, function () {
//   studio.video.Reporter.attach("video_1", video1)
// })

// Waits for the content to load and then starts the ad
window.onload = () => {
    if (Enabler.isInitialized()) {
        enablerInitHandler()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitHandler)
    }
}

// Checks if the creative is visible
const enablerInitHandler = () => {
    if (Enabler.isVisible()) {
        preloadImages()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, preloadImages)
    }
}

const preloadImages = () => {
    for (let i = 0; i < imageArray.length; i++) {
        let tempImage = new Image()
        tempImage.addEventListener("load", trackProgress, true)
        tempImage.src = imageArray[i]
    }
}

const trackProgress = () => {
    loadedImages++
    if (loadedImages == imageArray.length) {
        startAd()
    }
}




// START AD
const startAd = () => {
    document.querySelector("#loader-container").style.display = "none"
    // document.querySelector("#dc_bgImage").style.backgroundImage = "url(images/background_selection.jpg)"
    // Assign All the elements to the element on the page
    Enabler.setFloatingPixelDimensions(1, 1)

    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_START, expandHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START, collapseHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_EXPAND_FINISH, expandFinishHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_COLLAPSE_FINISH, collapseFinishHandler)
    Enabler.addEventListener(studio.events.StudioEvent.FULLSCREEN_SUPPORT, fullscreenHandler)

    container = document.querySelector("#dc_container")
    content = document.querySelector("#dc_content")

    internalDiv = document.querySelector("#internalDiv")
    bgExt = document.querySelector("#dc_background_exit")
    btnClose = document.querySelector("#dc_btnClose")
    scenes = document.querySelectorAll(".scene")
    timer = document.querySelector("#game_current_time")
    cta = document.querySelector("#cta_wrapper")
    bounds = document.querySelector("#bounds")
    instructions = document.querySelector('#instructions')
    Object.keys(icons).forEach(key => {
        icons[key] = document.querySelector(`#${key}_icon`)
    })
    Object.keys(phs).forEach(key => {
        phs[key] = document.querySelector(`#${key}_ph`)
    })

    setTimeout(onResize, 200)

    Draggable.create([phs.guitar, phs.mic], {
        type: "x, y",
        bounds: bounds,
        throwProps: true,
        onDragStart: (e) => {
            const id = e.target.id.split("_")[0]

            gsap.set(`#${id}_bus`, { opacity: 0 })
            gsap.set(`#${id}_ph`, { opacity: 1 })
        },
        onDragEnd: function (e) {
            const id = e.target.id.split("_")[0]
            const collision = checkCollisions(phs[id], icons[id])

            if (collision) {
                gsap.set(`#${id}_ph`, { opacity: 0, pointerEvents: "none" })
                gsap.to(`#${id}_icon`, 0.5, { opacity: 0 })
                gsap.to(`#${id}_icon_selected`, 0.5, { opacity: 1 })
                score++
                if (score === 2) endGame()
            } else {
                gsap.set(`#${id}_ph`, { opacity: 0, x: this.startX, y: this.startY })
                gsap.set(`#${id}_bus`, { opacity: 1 })
            }

        }
    })

    window.onresize = onResize
    onResize()

    addListeners()
    Enabler.queryFullscreenSupport()
    initAnimations()
    initTimers()

    window.onresize = onResize
    onResize()
}




// EVENT LISTENERS
const addListeners = () => {
    bgExt.addEventListener("touchend", clickBG, false)
    bgExt.addEventListener("click", clickBG, false)
    btnClose.addEventListener("touchend", clickClose, false)
    btnClose.addEventListener("click", clickClose, false)
    cta.addEventListener("touchend", clickCTA, false)
    cta.addEventListener("click", clickCTA, false)
    instructions.addEventListener("touchend", startGame, false)
    instructions.addEventListener("click", startGame, false)

    document.addEventListener('touchmove', preventBehavior, { passive: false })
}

const preventBehavior = (e) => {
    e.preventDefault()
}




// GAME
const checkCollisions = (player, object) => {
    const playerBox = player.getBoundingClientRect()
    const objectBox = object.getBoundingClientRect()

    if (
        objectBox
        && playerBox.x + playerBox.width * .25 < objectBox.x + objectBox.width
        && playerBox.x + playerBox.width * .75 > objectBox.x
        && playerBox.y < objectBox.y + objectBox.height * 0.85
        && playerBox.y + playerBox.height > objectBox.y
    ) {
        return true
    }
    return false
}




// ANIMATIONS
const initAnimations = () => {
    Enabler.counter("Lego-FinderObjects-GameStarted")
}




// TIMERS
const initTimers = () => {
    initIntroTimer()

}




// SIZE & DEVICES
const onResize = () => {
    internalDiv.style.display = "block"
    internalDiv.style.top = content.offsetHeight / 2 - internalDiv.offsetHeight / 2 + "px"
    internalDiv.style.left = content.offsetWidth / 2 - internalDiv.offsetWidth / 2 + "px"

    setTimeout(() => {
        checkRotation()
        checkIfTablet()
    }, 100)
}

const checkRotation = () => {
    const iDRect = internalDiv.getBoundingClientRect()

    isVertical = iDRect.height > iDRect.width

    if (iDRect.width < iDRect.height) {
        scenes.forEach(scene => {
            scene.style.width = iDRect.height + "px"
            scene.style.height = iDRect.width + "px"

            const ratio = 50 / (iDRect.width / iDRect.height)
            scene.style.transformOrigin = "center " + ratio + "%"
        })
    }
}

const checkIfTablet = () => {
    const iDRect = internalDiv.getBoundingClientRect()

    let min = iDRect.width
    let max = iDRect.height

    if (min > max) {
        max = iDRect.width
        min = iDRect.height
    }
    if (min / max >= 0.65) {
        internalDiv.className = "tablet"
    } else {
        internalDiv.className = ""
    }
}

const expandHandler = () => {
    container.style.display = "block"
    Enabler.finishFullscreenExpand()
}

const collapseHandler = () => {
    container.style.display = "none"
    Enabler.finishFullscreenCollapse()
}

const expandFinishHandler = () => {
}

const collapseFinishHandler = () => {
}

const fullscreenHandler = () => {
    Enabler.requestFullscreenExpand()
}




// TIMERS
const initIntroTimer = () => {
    if (introTimer === null || introTimer === undefined) {
        introTimer = setTimeout(() => {
            if (!interacted) {
                endGame()
            }
        }, introTime * 1000)
    }
}

const initGameTimer = () => {
    if (gameTimer === null || gameTimer === undefined) {
        gameTimer = setInterval(() => {
            currentTime--
            timer.innerHTML = `0:${("0" + currentTime).slice(-2)}`
            if (currentTime === 0) {
                clearInterval(gameTimer)
                endGame()
            }
        }, 1000)
    }
}




// AUDIO
const getAssetUrl = (filename) => {
    if (Enabler.isServingInLiveEnvironment()) {
        return Enabler.getUrl(filename)
    } else {
        return filename
    }
}

const createAudio = (source) => {
    const audio = document.createElement("audio")
    const audioSource = document.createElement("source")
    audioSource.src = getAssetUrl(source)
    audio.appendChild(audioSource)
    return audio
}




// EXITS
const clickBG = () => {
    if (isEnded) {
        Enabler.counter("Lego-FinderObjects-ClickBackground")
        Enabler.exit("HTML5_Background_Clickthrough", window.clickThrough)
        Enabler.requestFullscreenCollapse()
    }
}

const clickCTA = () => {
    Enabler.counter("Lego-FinderObjects-ClickCTA")
    Enabler.exit("HTML5_CTA_Clickthrough", window.clickThrough)
    Enabler.requestFullscreenCollapse()
}

const clickClose = () => {
    Enabler.counter("Lego-FinderObjects-ManuallyClosed")
    Enabler.reportManualClose()
    Enabler.requestFullscreenCollapse()
    Enabler.close()
}

const startGame = () => {
    Enabler.counter("Lego-FinderObjects-FirstInteraction")
    interacted = true

    gsap.to('#instructions', 0.5, { opacity: 0, pointerEvents: 'none' })
    gsap.to(['.icon_wrapper', '.bus_wrapper', '#game_timer'], 0.5, { opacity: 1, pointerEvents: 'all' })
    initGameTimer()
}

const endGame = () => {
    Enabler.counter("Lego-FinderObjects-GameEnded")
    clearInterval(gameTimer)
    clearTimeout(introTimer)
    setTimeout(() => {
        gsap.to(`#game`, 0.5, { pointerEvents: "none", opacity: 0 })
        gsap.to(`#endframe_scene`, 0.5, { pointerEvents: "all", opacity: 1 })
    }, 1500)
}




// HELPERS
const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min) // Maximum is exclusive and minimum is inclusive
}
