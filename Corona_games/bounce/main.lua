-- Bounce Game
-- Developed by Carlos Yanez

-- Hide Status Bar

display.setStatusBar(display.HiddenStatusBar)

-- Physics

local physics = require('physics')
physics.start()
--physics.setDrawMode('hybrid')

-- Graphics

-- [Background]

local bg = display.newRect(0, 0, display.contentWidth, display.contentHeight)
bg:setFillColor(52, 46, 45)

-- [Title View]

local title
local playBtn
local creditsBtn
local titleView

-- [Credits]

local creditsView

-- Color Circles

local circles = display.newGroup()

-- Bar

local bar

-- Walls 

local left
local right
local bottom

-- Instructions

local ins

--  Score

local score

-- Alert

local alertView

-- Sounds

local bounceSnd = audio.loadSound('bounce.wav')
local loseSnd = audio.loadSound('lose.wav')

-- Variables

local circleTimer
local colors = {{71, 241, 255},{255, 204, 0},{245, 94, 91},{0, 255, 204},{250, 140, 254},}

-- Functions

local Main = {}
local startButtonListeners = {}
local showCredits = {}
local hideCredits = {}
local showGameView = {}
local gameListeners = {}
local moveBar = {}
local addCircle ={}
local onCollision = {}
local alert = {}

-- Main Function

function Main()
	title = display.newImage('title.png')
	playBtn = display.newImage('playBtn.png', 130, 248)
	creditsBtn = display.newImage('creditsBtn.png', 125, 316)
	titleView = display.newGroup(title, playBtn, creditsBtn)
	
	startButtonListeners('add')
end

function startButtonListeners(action)
	if(action == 'add') then
		playBtn:addEventListener('tap', showGameView)
		creditsBtn:addEventListener('tap', showCredits)
	else
		playBtn:removeEventListener('tap', showGameView)
		creditsBtn:removeEventListener('tap', showCredits)
	end
end

function showCredits:tap(e)
	playBtn.isVisible = false
	creditsBtn.isVisible = false
	creditsView = display.newImage('credits.png', 0, display.contentHeight)
	
	transition.to(creditsView, {time = 300, y = display.contentHeight - (creditsView.height - 40), onComplete = function() creditsView:addEventListener('tap', hideCredits) end})
end

function hideCredits:tap(e)
	transition.to(creditsView, {time = 300, y = display.contentHeight + 40, onComplete = function() creditsBtn.isVisible = true playBtn.isVisible = true creditsView:removeEventListener('tap', hideCredits) display.remove(creditsView) creditsView = nil end})
end


function showGameView:tap(e)
	transition.to(titleView, {time = 300, x = -titleView.height, onComplete = function() startButtonListeners('rmv') display.remove(titleView) titleView = nil end})
	
	-- [Add GFX]
	
	-- Add Bar
	
	bar = display.newRoundedRect(70, 340, 160, 10, 3)
	bar.name = 'bar'
	
	-- Instructions Message
	
	local ins = display.newImage('ins.png', 160, 355)
	transition.from(ins, {time = 200, alpha = 0.1, onComplete = function() timer.performWithDelay(2000, function() transition.to(ins, {time = 200, alpha = 0.1, onComplete = function() display.remove(ins) ins = nil end}) end) end})
	
	-- Walls
	
	left = display.newLine(0, 240, 0, 720)
	left.isVisible = false
	right = display.newLine(320, 240, 320, 720)
	right.isVisible = false
	bottom = display.newLine(160, 480, 480, 480)
	bottom.isVisible = false
	
	-- Score
	
	score = display.newText('0', 300, 0, 'Futura', 15)
	
	-- Physics
	physics.addBody(bar, 'static', {filter = {categoryBits = 4, maskBits = 7}})
	
	physics.addBody(left, 'static', {filter = {categoryBits = 4, maskBits = 7}})
	physics.addBody(right, 'static', {filter = {categoryBits = 4, maskBits = 7}})
	physics.addBody(bottom, 'static', {filter = {categoryBits = 4, maskBits = 7}})
	
	gameListeners('add')
end

function gameListeners(action)
	if(action == 'add') then
		bg:addEventListener('touch', moveBar)
		circleTimer = timer.performWithDelay(2000, addCircle, 5)
		bar:addEventListener('collision', onCollision)
		bottom:addEventListener('collision', alert)
	else
		bg:removeEventListener('touch', moveBar)
		timer.cancel(circleTimer)
		circleTimer = nil
		bar:removeEventListener('collision', onCollision)
		bottom:removeEventListener('collision', alert)
	end
end

function moveBar(e)
	if(e.phase == 'moved') then
		bar.x = e.x
		bar.y = e.y - 40
	end
	-- Keep bar 1/3 from the top
	if(bar.y < 160) then
		bar.y = 160
	end
end

function addCircle()
	local r = math.floor(math.random() * 12) + 13
	local c = display.newCircle(0, 0, r)
	c.x = math.floor(math.random() * (display.contentWidth - (r * 2)))
	c.y =  - (r * 2)
	-- Circle color
	local color = math.floor(math.random() * 4) + 1
	c.c1 = colors[color][1]
	c.c2 = colors[color][2]
	c.c3 = colors[color][3]
	c:setFillColor(c.c1, c.c2, c.c3)
	physics.addBody(c, 'dynamic', {radius = r, bounce = 0.95, filter = {categoryBits = 2, maskBits = 4}})
	circles:insert(c)
	--Move Horizontally
	local dir
	if(r < 18) then dir = -1 else dir = 1 end
	c:setLinearVelocity((r*2) * dir, 0 )
end

function onCollision(e)
	audio.play(bounceSnd)
	bar:setFillColor(e.other.c1, e.other.c2, e.other.c3)
	score.text = tostring(tonumber(score.text) + 50)
	score:setTextColor(e.other.c1, e.other.c2, e.other.c3)
	score.x = 300
end

function alert()
	audio.play(loseSnd)
	gameListeners('rmv')
	alertView = display.newImage('alert.png', 90, 200)
	transition.from(alertView, {time = 200, alpha = 0.1})
	local scoreTF = display.newText(score.text, 145, 253, 'Futura', 17)
	scoreTF:setTextColor(255, 255, 255)
	-- Wait 100 ms to stop physics
	timer.performWithDelay(100, function() physics.stop() end, 1)
end

Main()