-- Black Square Puzzle Game
-- Developed by Carlos Yanez

-- Hide Status Bar

display.setStatusBar(display.HiddenStatusBar)

-- Graphics

-- [Background]

local bg = display.newImage('gameBg.png')

-- [Title View]

local title
local playBtn
local creditsBtn
local titleView

-- [Credits]

local creditsView

-- Color Squares

local r
local r2
local r3
local b
local squares

-- Instructions

local ins

--  Timer

local timeLeft

-- Alert

local alertView

-- Sounds

local tapSnd = audio.loadSound('tap.wav')
local wrongSnd = audio.loadSound('wrong.wav')
local loseSnd = audio.loadSound('lose.wav')

-- Variables

local leftTimer
local bonusTimer
local score = 0
local bonus = 50
local rotations = {0, 90, 180, 270}

-- Functions

local Main = {}
local startButtonListeners = {}
local showCredits = {}
local hideCredits = {}
local showGameView = {}
local gameListeners = {}
local onTap = {}
local updateTime = {}
local updateBonus = {}
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
	
	-- Add Squares
	
	r1 = display.newImage('red.png', 70, 210)
	r2 = display.newImage('red.png',130, 150)
	r3 = display.newImage('red.png',190, 210)
	b = display.newImage('black.png',130, 270)
	b.name = 'b'
	squares = display.newGroup(r1, r2, r3, b)
	squares:setReferencePoint(display.CenterReferencePoint)
	
	-- Instructions Message
	
	local ins = display.newImage('instructions.png', 160, 340)
	transition.from(ins, {time = 200, alpha = 0.1, onComplete = function() timer.performWithDelay(2000, function() transition.to(ins, {time = 200, alpha = 0.1, onComplete = function() display.remove(ins) ins = nil end}) end) end})
	
	-- Timer
	
	timeLeft = display.newText('0', 285, 7, 'Marker Felt', 16)
	timeLeft:setTextColor(153, 51, 51)
	
	gameListeners('add')
end

function gameListeners(action)
	if(action == 'add') then
		b:addEventListener('tap', onTap)
		r3:addEventListener('tap', onTap)
		r2:addEventListener('tap', onTap)
		r1:addEventListener('tap', onTap)
	else
		b:removeEventListener('tap', onTap)
		r3:removeEventListener('tap', onTap)
		r2:removeEventListener('tap', onTap)
		r1:removeEventListener('tap', onTap)
		timer.cancel(leftTimer)
		leftTimer = nil
		timer.cancel(bonusTimer)
		bonusTimer = nil
	end
end

function onTap(e)
	-- Start Timers if not started
	if(leftTimer == nil) then leftTimer = timer.performWithDelay(1, updateTime, 0) end
	if(bonusTimer == nil) then bonusTimer = timer.performWithDelay(3000, updateBonus, 0) end
	-- Get square tapped
	if(e.target.name == 'b') then
		-- Update timer
		timeLeft.text = tostring(tonumber(timeLeft.text) + bonus)
		-- Change squares position
		local rnd = math.floor(math.random() * 4) + 1 --number from 1 to 4
		squares.rotation = rotations[rnd]
		audio.play(tapSnd)
		score = score + 50
	else
		-- Reduce Time
		timeLeft.text = tostring(tonumber(timeLeft.text) - 10)
		audio.play(wrongSnd)
	end
end

function updateTime(e)
	timeLeft.text = tostring(tonumber(timeLeft.text) - 1)
	-- Time over
	if(tonumber(timeLeft.text) <= 0) then
		alert()
	end
end

function updateBonus(e)
	bonus = bonus - 10
	
	local msg = display.newText('LEVEL UP!', math.floor(math.random() * display.contentWidth), math.floor(math.random() * display.contentHeight), 'Marker Felt', 15)
	msg:setTextColor(255, 255, 255)
	transition.from(msg, {time = 200, alpha = 0.1, onComplete = function() timer.performWithDelay(800, function() transition.to(msg, {time = 200, alpha = 0.1, onComplete = function() display.remove(msg) msg = nil end}) end) end})
end

function alert(action)
	timeLeft.text = 0
	audio.play(loseSnd)
	gameListeners('rmv')
	alertView = display.newImage('alert.png', 90, 352)
	transition.from(alertView, {time = 200, alpha = 0.1})
	local scoreTF = display.newText(tostring(score), 185, 353, 'Marker Felt', 14)
	scoreTF:setTextColor(153, 51, 51)
end

Main()