# idleloopsrevamped
A remake/revamp of the classic Idle Loops, with a bunch of QOL features and streamlining. Idle Loops: https://lloyd-delacroix.github.io/omsi-loops/

# Game Story

The player is a peasant who lives in the woods as an apprentice woodsman. They come across a glade with a wooden stool in the middle of it. On the stool is a small letter. 

On opening the letter, the player experiences a warping of time and space. The leter is from a wizard, who has placed a spell on you to time loop forever. Follow his instructions to break free. 

The player completes task after tassk, increasingly in skills and knoweldge in the process. Each time, the wizard teleports them to a new location, with a new, even more impossible challenge. 

How will the player break free? Will they confront the wizard and win their freedom, or be doomed to loop forever, going slowly mad in the process. 


# Game Overview

An incremental game built in Vue, deployed to Github Pages. A time loop game where the player has finite time to get as much done as possible, before returning to the beginning. To advance, the player must continuously repeat loops, building up experience and levels in order to advance further each loop. 

The game is made of multiple areas. Each area has a series of actions you can perform: each action consumes some time to complete, and maybe other resources. Actions can reward you with resources, contributre to progress somewhere, or unlock other actions. 

Each area has a final action that completes the area: in most areas this starts unlocked, or is insurmountably difficult with the resources you have on hand. Some actions are locked, or completely hidden and must be discovered through experimentation. 

Gameplay is a mixture of puzzle solving and incremental progress, where the minite to minite gameplay is about finding the most efficient path to your goal, and goals change over time as you move through areas. 

Every area has a new set of actions, and a new overall goal. The conditions and goals change from area to area, mixing up gameplay. The overall goal is to get through all the areas and win the game, but that will take a LONG time. 

Gameplay should be a mix of short term experimentation with actions, before leaving the action queue for a while to grind levels in attribites, or to unlock specific things. 


# Action Queue

The main interactible object is the action queue, which sits next to a list of area actions. The player can click or drag and drop actions to add them in their queue: the actions will be executed from top to bottom. Actions can be rearranged in the queue by dragging and dropping, and removed by dragging them out. 

At the start of the game the queue is limited to 4 actions, forcing players to choose carefully. This can be increased later in the game. 

There are time controls at the top of the page: you can start time, pause time and reset to the beginning of a loop. 

# Attribites and EXP

Every action has one or more accociated attributes: when that action is completed, it rewards EXP for that attribute based on the difficulty of the action. This contributes to levelling up an attribute, providing a multiplier to action speed for any action that use that attribute. 

The main attributes are all mental, as physical attributes are not preserved on reset: your body is : 

* Willpower - actions that require persistance or pushing through pain and/or biredom
* Wisdom - actions that require good decisionmaking and common sense
* Intelligence - action that require calculations or logic
* Memory - actions that involve a lot of information 
* Reaction - actions that require speed and/or precsion
* Charisma - actiosn that involve interactions with others

TODO: decide if we want to incrporate physical attributes

Actions tend to use at least one and usually 2 or three of these: by performing actions in that category, the player can quickly level up that attribute, allowing them to tackle more difficult actions that use that attribute. This is a core gameplay mechanic, and many actions exist only to contribute EXP to a given attribute. 

When time resets, all attribute levels are reset. When this occurs, EXP is earned towards the Global level of that attribute: this is a multiplier on EXP earned during loops. This does **not** reset when a loop ends, meaning you can grind successive loops in a single attribute so that you get better in that attribute in successive runs. This is an important aspect of long term progress across the whole game

So there are two levels for every attribute: Loop level and Global level. Loop levels will increase rapidly, while Global level will build very slowly over time. 

# Skills, Items and Unlocks

Each area may have one more long term goals or tasks that can be contributed to. These are usually progressed by actions that take a long time or represent an element of chance, such reading a book, searching for an object or travelling a long distance.

Some actions do not progress a goal, but instead have a percentage chance to complete it. 

Skills represent your knoweldge of a specific task or domain, which is not lost between resets. Things like using speicifc tools, learning a language, the location of something or how to repair things represent skills that can be mastered over time, similar to Global attibite levels. 

Items, on the other hand, are aquired in an area and kept only in that loop. Some other actions may require items to start and complete, making order of operations important. 

If an action is attempted without the require

# Offline Progress

Time spent away from the game is collected as time shards, 1 for each second spent away, up to a maximum of 24 hours. Time shards can be used to speed up the game using controls on the time control bar: 1 per second to double time speed, or 4 per second to quadruple time speed. 

# Areas
Below is a list of areas and their goals. we will full spec out the first as a template, others to follow in more detail once we have nailed the core mechanics. 

## Glade
You find yourself in a clearing in the woods. This is a basic tutorial area to teach the concept of unlocking progress and grinding skills. The player must spend time searching for both the honey and waterfall: but even once found, they cannot complete both actions within the time limit. They musy traing the neccesary attributes in order to complete both in time. 

There are also very obviously tasks that are impossible with the current attribites: this plants the seed early that the player must level up elsewhere and return to unlock more. 

Task: Collect some honey and bring it to a cave next to a waterfall
Time: 2 minutes

Unlocks: 
Explore Woods: Multiplies base chance to find Bees and find Waterfall by ( Explore Woods percent * 5 )%
Waterfall

Items:
Bees: 3 max.

Actions: 
Study Surroundings: Unlocked :  10 seconds : Memory : Does nothing, just for training
Contemplate Situation: Study Surroundings 10 times: 30 seconds: Wisdom : Does nothing just for training
Scream and Kick Trees: Contemplate Situation 100 times: 2 minutes : Charisma, Reaction : 2X EXP earned
Search Woods: Unlocked:  1 minute : Memory : +1% to Explore Woods. 0.5% Chance to unlock Find Bees.
Collect Honey: Unlocked on Find Bees:  1 minute : Wisdom, Reaction, Willpower : Gives 1 honeycomb
Look for Waterfall: Unlocked: 2 minutes: Memory, Willpower : +1% to Explore Woods. 2% Chance to unlock Find Waterfall.
Listen for Waterfall: 30 seconds : Willpower :  Doubles the effects of Look for Waterfall. 
Offer Honey: Unlocked on Find Waterfall. Requires 1 Honey: 1 minite seconds : Memory : Lose all Honey, Unlock next Area. 

Search Deep Woods: 75% progress on Expolre Woods: 4 minutes: Memory, Reaction, Wisdom: 5% chance to find Hut. 
Meditate: 5 minutes : Wisdom, Memory : 5X EXP earned


## Village
You find yourself in the square of a small village. The clothes, houses and language spoken are all unfamiliar. This is a more advanced area that introduces currency: you can aquire, buy and sell items here, as well as interact with people. This is an initially simple area with many possible things to do: this introduces the concept of multiple ways to acheive goals, some faster than others. There are lots of quests to complete with localsWe also are introduced to Time Dilation, where due to the amount of time allowed, we need time to move a little faster. 

Task: Aquire 100 gold coins and place it in the Wizard's hiding place. 
Time: 30 minutes
Time Dilation: 10X

Actions: 
Talking to locals, learning their language, exploring the village. Choices to steal, buy and sell items to aqure gold. Need to find the Wizard's hiding place throughout the village. 

## Ancient Temple
The wizard is impressed: if you reached this point, you have potential and may be considered for apprenticeship. Navigate the temple and touch the glowing orb: if it doesn't kill you, you will aquire Mana, an important resource that lets you extend the time of the loop, cast spells and do other things.  

The temple introduces the concept of statuses and health: we need to avoid being injured or killed to progress. Being injured applies penalties to attribites, effecting future actions, and being killed resets the loop. An example of when its neccesary to brute force RNG to progress. 

Task: Touch the Orb
Time: 5 minutes

## Wizard Tower

An interlude area where there is not much to do. The Door to the tower is locked, and you must aquire 3 amulets to open it. You can spend your small reserve of mana to eleport to new areas. The player will return here after completing all 3 areas, reinforcing the concept of returning to areas to progress. 

## Mana Cave

You find yourself in a cave filled with glowing mushrooms. The area has a very short time franme, so extending youyr time with Mana is essential. 

Task: Find the Red Amulet
Time: 1 minute

## Desert

You find yourself in an endless desert, under the hot sun. Here you have a whole day, so time dilation is a major factor. The area is seperated into day and night, with different effects: players will bake and tire in the sun, then freeze at night. There are unique penalties for different action
Due to time dilation, mana does not matter for extending your time. 

Task: Find the Yellow Amulet
Time: 1 Day
Time Dilation: 1000X

## Underwater

You are underwater. In this area there is no time limit, other than your ability to hold your breath. Every second you gain a mounting penalty and and a chance to give up and drown. Teahces the player than time is not the only resource

Task: Find the Blue Amulet
Time: None - end on death
