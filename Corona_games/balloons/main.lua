-- Balloons Physics Game
-- Developed by Carlos Yanez

-- Hide Status Bar

display.setStatusBar(display.HiddenStatusBar)

-- Physics

local physics = require('physics')
physics.start()

-- Graphics

-- [Background]

local bg = display.newImage('gameBg.png')

-- [Title View]

local titleBg
local playBtn
local creditsBtn
local titleView

-- [Credits]

local creditsView

-- [Game View]

local gCircle
local squirrel
local infoBar
local restartBtn

-- [TextFields]

local scoreTF
local targetTF
local acornsTF

-- Load Sound

local pop = audio.loadSound('pop.mp3')

-- Variables

local titleView
local credits
local acorns = display.newGroup()
local balloons = {}
local impulse = 0
local dir = 3

-- Functions

local Main = {}
local startButtonListeners = {}
local showCredits = {}
local hideCredits = {}
local showGameView = {}
local gameListeners = {}
local startCharge = {}
local charge = {}
local shot = {}
local onCollision = {}
local startGame = {}
local createBalloons = {}
local update = {}
local restartLvl = {}
local alert = {}
local restart = {}