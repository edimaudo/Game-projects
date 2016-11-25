-- Bullets Game
-- Developed by Carlos Yanez

-- Hide Status Bar

display.setStatusBar(display.HiddenStatusBar)

-- Physics

local physics = require('physics')
physics.start()
physics.setGravity(0, 0)
--physics.setDrawMode('hybrid')

-- Graphics

-- [Background]

local gameBg = display.newImage('gameBg.png')

-- [Title View]

local titleBg
local playBtn
local creditsBtn
local titleView

-- [Credits]

local creditsView

-- TextFields

local scoreTF

-- Instructins Message

local ins

-- Bullets

local bulletsLeft
local bullets
local exploBullets = {}

-- Turret

local turret

-- Enemy

local enemies

-- Alert

local alertView

-- Sounds

local bgMusic = audio.loadStream('POL-hard-corps-short.mp3')
local shootSnd = audio.loadSound('shoot.wav')
local exploSnd = audio.loadSound('explo.wav')

-- Variables

local timerSrc
local yPos = {58, 138, 218}
local speed = 3
local targetX
local targetY

-- Functions

local Main = {}
local startButtonListeners = {}
local showCredits = {}
local hideCredits = {}
local showGameView = {}
local gameListeners = {}
local createEnemy = {}
local shoot = {}
local update = {}
local onCollision = {}
local addExBullets = {}
local alert = {}

-- Main Function

function Main()
	titleBg = display.newImage('title.png')
	playBtn = display.newImage('playBtn.png', 212, 163)
	creditsBtn = display.newImage('creditsBtn.png', 191, 223)
	titleView = display.newGroup(titleBg, playBtn, creditsBtn)
	
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
	creditsView = display.newImage('credits.png', -110, display.contentHeight-80)
	transition.to(creditsView, {time = 300, x = 55, onComplete = function() creditsView:addEventListener('tap', hideCredits) end})
end

function hideCredits:tap(e)
	playBtn.isVisible = true
	creditsBtn.isVisible = true
	transition.to(creditsView, {time = 300, y = display.contentHeight+creditsView.height, onComplete = function() creditsView:removeEventListener('tap', hideCredits) display.remove(creditsView) creditsView = nil end})
end

function showGameView:tap(e)
	transition.to(titleView, {time = 300, x = -titleView.height, onComplete = function() startButtonListeners('rmv') display.remove(titleView) titleView = nil gameBg:addEventListener('tap', shoot) end})
	
	-- [Add GFX]
	
	-- Instructions Message
	
	ins = display.newImage('ins.png', 135, 255)
	transition.from(ins, {time = 200, alpha = 0.1, onComplete = function() timer.performWithDelay(2000, function() transition.to(ins, {time = 200, alpha = 0.1, onComplete = function() display.remove(ins) ins = nil end}) end) end})
	
	-- Bullets Left
	
	bullets = display.newGroup()
	bulletsLeft = display.newGroup()
	for i = 1, 5 do
		local b = display.newImage('bullet.png', i*12, 12)
		bulletsLeft:insert(b)
	end
	
	-- TextFields
	
	scoreTF = display.newText('0', 70, 23.5, 'Courier Bold', 16)
	scoreTF:setTextColor(239, 175, 29)
	
	-- Turret
	
	turret = display.newImage('turret.png', 220, 301)
	
	enemies = display.newGroup()
	gameListeners('add')
	audio.play(bgMusic, {loops = -1, channel = 1})
end

function gameListeners(action)
	if(action == 'add') then
		timerSrc = timer.performWithDelay(1200, createEnemy, 0)
		Runtime:addEventListener('enterFrame', update)
	else
		timer.cancel(timerSrc)
		timerSrc = nil
		Runtime:removeEventListener('enterFrame', update)
		gameBg:removeEventListener('tap', shoot)
	end
end

function createEnemy()
	local enemy
	local rnd = math.floor(math.random() * 4) + 1
	enemy = display.newImage('enemy.png', display.contentWidth, yPos[math.floor(math.random() * 3)+1])
	enemy.name = 'bad'
	-- Enemy physics
	physics.addBody(enemy)
	enemy.isSensor = true
	enemy:addEventListener('collision', onCollision)
	enemies:insert(enemy)
end

function shoot()
	audio.play(shootSnd)
	local b = display.newImage('bullet.png', turret.x, turret.y)
	physics.addBody(b)
	b.isSensor = true
	bullets:insert(b)
	-- Remove Bullets Left
	bulletsLeft:remove(bulletsLeft.numChildren)
	-- End game 4 seconds after last bullet
	if(bulletsLeft.numChildren == 0) then
		timer.performWithDelay(4000, alert, 1)
	end
end

function update()
	-- Move enemies
	if(enemies ~= nil)then
		for i = 1, enemies.numChildren do
			enemies[i].x = enemies[i].x - speed
		end
	end
	-- Move Shoot bullets
	if(bullets[1] ~= nil) then
		for i = 1, bullets.numChildren do
			bullets[i].y = bullets[i].y - speed*2
		end
	end
	-- Move Explosion Bullets
	if(exploBullets[1] ~= nil) then
		for j = 1, #exploBullets do
			if(exploBullets[j][1].y ~= nil) then exploBullets[j][1].y = exploBullets[j][1].y + speed*2 end
			if(exploBullets[j][2].y ~= nil) then exploBullets[j][2].y = exploBullets[j][2].y - speed*2 end
			if(exploBullets[j][3].x ~= nil) then exploBullets[j][3].x = exploBullets[j][3].x + speed*2 end
			if(exploBullets[j][4].x ~= nil) then exploBullets[j][4].x = exploBullets[j][4].x - speed*2 end
		end
	end
end

function onCollision(e)
	audio.play(exploSnd)
	targetX = e.target.x
	targetY = e.target.y
	timer.performWithDelay(100, addExBullets, 1)
	-- Remove Collision Objects
	display.remove(e.target)
	e.target = nil
	display.remove(e.other)
	e.other = nil
	-- Increase Score
	scoreTF.text = tostring(tonumber(scoreTF.text) + 50)
	scoreTF.x = 90
end

function addExBullets()
	-- Explosion bullets
	local eb = {}
	local b1 = display.newImage('bullet.png', targetX, targetY)
	local b2 = display.newImage('bullet.png', targetX, targetY)
	local b3 = display.newImage('bullet.png', targetX, targetY)
	local b4 = display.newImage('bullet.png', targetX, targetY)
	physics.addBody(b1)
	b1.isSensor = true
	physics.addBody(b2)
	b2.isSensor = true
	physics.addBody(b3)
	b3.isSensor = true
	physics.addBody(b4)
	b4.isSensor = true
	table.insert(eb, b1)
	table.insert(eb, b2)
	table.insert(eb, b3)
	table.insert(eb, b4)
	table.insert(exploBullets, eb)
end

function alert()
	audio.stop(1)
	audio.dispose()
	bgMusic = nil
	gameListeners('rmv')
	alertView = display.newImage('alert.png', 160, 115)
	transition.from(alertView, {time = 300, xScale = 0.5, yScale = 0.5})
	
	local score = display.newText(scoreTF.text, (display.contentWidth * 0.5) - 18, (display.contentHeight * 0.5) + 5, 'Courier Bold', 18)
	score:setTextColor(44, 42, 49)
	
	-- Wait 100 ms to stop physics
	timer.performWithDelay(1000, function() physics.stop() end, 1)
end

Main()