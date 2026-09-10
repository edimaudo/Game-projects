## Persona: Web game developer
## Context: I would like to Build a fun 2D web game focused on fonts called fontWars  Use attached image as inspiration.  Key design elements 
- It should be web responsive
- It should have a light and dark mode, with light being the default setting.  Also when you change between the modes, the fonts and color should adapt
- font will be 
- It should be WCAG 2.1 accessible
- blue color scheme

## app design
- It should leverage the devvit template design user phaser (https://github.com/reddit/devvit-template-phaser) 

### App Setup
- Landing page
- About page
- Game setting page
- game page
- font library

- About page
 - It should have what the game is about and how to play the game
  - App Description
    Can you spot the differences between Arial and Helvetica? Times New Roman and Baskerville? Prove it.
    fontWars is a game of typographical skill that helps you level up. Flaunt your keen eye, obsess over your stats, and battle your way to the number one spot.
    WARNING: FontWars is insanely addictive. Please use responsibly.
     - Track your progress as you level up
    - Easily view your ranking
     - Slick web interface
    <!-- - Per-character stats|
   
    - Unlock new fonts as you reach higher levels
    - Unlock lowercase letters at level 40
    - Swipe the screen to skip a question without hurting your score -->
    - Train as you play: Typewar acts as multiplayer flash cards for improving your type-spotting acumen 

- Game Setting page
 - Will have to ability to change the theme (dark or light mode)
 - Will show your score

font library will have a list of fonts where you can learn about them.  It will also have a set of flash cards for you to improve type-spotting acumen.  It should have advice/explanations on which stylistic elements to key in on to improve your identification skills for each font shown.

- Game Page
It would have a game start button
Game play
  - the game should be in the center of the screen 
  - the font could be a either one of these (bold, italic, condensed)
  - It would show a font.  The font should be large and below it would be two answers with font names
  - There will be one correct answer and one incorrect answer.  They cannot be the same font name.  Also the font shown should match one of the answers generated. Provide a visible border and for the two answers style them like buttons
  - The question and the answers should be centered on the screen
  - If the user exits the app the game should end and no score collected
  - When the game starts there should be a timer that starts going and counts every second until the game ends.  If the user exits the app the timer should stop
  - There should be a question counter showing 0/10 when starting, it should update by 1 when the user gets the question right, if the user gets the question wrong it should not update
  - When the user has answered all the questions, the timer should stop and the total score and total time in minutes should be shown in a banner.  If the top score in the current game is higher than the current top score then the top score and time should be updated. When the game ends, the score and time should be shown in a modal box 
  - When the game is first played the top score and time should be zero.  After the first game play the top score and time should be updated

### Backend & Logic
- The game should have a library of at least 400 fonts, an even split between serif and san serif.  
- Build using https://developers.reddit.com/docs/capabilities/devvit-web/devvit_web_overview information



## Output
devvit phaser game file

## game feedback

Typefaces should not be bold/italic because usually only one or two options are actually bold/italic, which makes the game too easy (even on difficult) because it narrows down to two (and sometimes one) option. Also, the inclusion of worthless fonts such as curlz and jokerman give the game quite an amateur feel versus a game that only uses legitimate fonts.
I want to learn I'm frustrated. When I get a question wrong, it shows the right answer for a split second, but not barely long enough to read! (And I'm no geezer.) I want to learn typefaces better. Please show the answer for at least 100 milliseconds longer.
Almost This game stops just short if being really exceptional. What would really take it to the next level would be giving advice/explanations on which stylistic elements to key in on to improve your identification skills.
 The fonts (bold, italic, condensed) often give the answer though. I would only show the typefaces, and the fonts only when the game is finished. First time I played I made only 2 mistakes on the highest difficulty.

- 
- 
- 
- 
- 
- 
- 
- 









