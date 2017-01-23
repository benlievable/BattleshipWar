/* 
This project is created by:
Benjamin Oh Ren Hao
A0125515M
NM2207 Final Project
*/

require(
   // Use this library to "fix" some annoying things about Raphel paper and graphical elements:
    //     a) paper.put(element) - to put an Element created by paper back on a paper after it has been removed
    //     b) call element.addEventListener(...) instead of element.node.addEventListner(...)
    ["../jslibs/raphael.lonce"],  // include a custom-built library
    function () {
            
        console.log("yo, I'm alive!");

        var paper = new Raphael(document.getElementById("mySVGCanvas"));
        //var pWidth = paper.canvas.offsetWidth;
        //var pHeight = paper.canvas.offsetHeight;
        var pWidth = paper.width;
        var pHeight = paper.height;
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);
        
        //bgimage for the paper
        var bgimg = paper.image("images/coolbackground.jpg", 0, 0, pWidth, pHeight);

//---------------------------------------------------------------------------------


/*
--[Directory]--
Initial Settings
MATH Function

Switch Player Turn Function
Switch Ship Orientation Function

SetBattleShip_PlayerGrid - Grid layout arrangement

Reveal Hidden Ship Function
Pre-Battlemode Grid Setup
Computer Set Battleship Function
SetBattleShip: Change Attribute Function
SetBattleShip: Legal Check Function

Battle Mode: Check and Shoot

Grid Event Listener Function
Grid Creation
Grid Blockers

Raphael Text: Player's Total Hits
Total Hits Update Function

Raphael Image and Buttons: Under Curtain
Opening and Closing Curtain
Raphael Image and Buttons: Over Curtain
Raphael Image and Buttons Event Listener

Restart Settings: Main Menu
Mode Settings: Battle Mode
Mode Settings: Game Ended

Audio

*/


//---------------------------------------------------------------------------------
//                           Initial Settings
//---------------------------------------------------------------------------------

        var gamemode="setBattleShips";   //setBattleShips || BattleMode || gameEnded  
        
        //orientation modes:
        var leftright = true;
        var topdown = false;
        
        //to determine type of ship to place:
        var numberofships=3;
        
        // counters
        var player1totalhit = 0;
        var player2totalhit = 0;
        var AItotalhit = 0;
        var AImode = false;

        // turn determiners
        var player1turn = true;
        var player2turn = false;
        var AIturn = false;

        //mouseclick status holder
        var mouseClick= false;

//---------------------------------------------------------------------------------
//                           MATH Function
//---------------------------------------------------------------------------------

        // Function is created to generate a random number between a range within the function
        function randomnumber(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


//---------------------------------------------------------------------------------
//                        Switch Player Turn Function
//---------------------------------------------------------------------------------

        // Function is used to alternate between players/AI turns through using "if" statements
        // In addition, respective animation and and screenblocks are added here

        var switchPlayer = function(){
            if (gamemode=="battleMode"){ //to prevent switching of player turn if it's not battlemode (i.e. end of game)
                if (AImode){
                    if (player1turn){
                        player1turn=false;
                        AIturn=true;
                        leftGridBlock.hide();
                        rightGridBlock.show();
                        console.log("It is Computer's turn now");
                    }
                    else if (AIturn){
                        player1turn=true;
                        AIturn=false;
                        leftGridBlock.show();
                        rightGridBlock.hide();
                        console.log("It is User's turn now");
                        bannerForPlayer1Turn();
                    }

                }
                else {
                    if (player1turn){
                        player1turn=false;
                        player2turn=true;
                        leftGridBlock.hide();
                        rightGridBlock.show();
                        console.log("It is Player 2's turn now");
                        bannerForPlayer2Turn();
                    }
                    else if (player2turn) {
                        player1turn=true;
                        player2turn=false;
                        leftGridBlock.show();
                        rightGridBlock.hide();
                        console.log("It is Player 1's turn now");
                        bannerForPlayer1Turn();
                    }
                }
            }
        }


//---------------------------------------------------------------------------------
//                    Switch Ship Orientation Function
//---------------------------------------------------------------------------------
        
        // Function is used to alternate orientation between leftright and topdown
        var switchOrientationFunction = function(){
            if (leftright){
                leftright=false;
                topdown=true;
            }
            else {
                leftright=true;
                topdown=false;
            }
        }


//---------------------------------------------------------------------------------
//             SetBattleShip_PlayerGrid - Grid layout arrangement
//---------------------------------------------------------------------------------

        var setBattleship_PlayerGrid = function(){
            for (i=0; i<totalRect*2; i++){
                grid[i].hide(); // all grids are hidden first, before being shown depending on the next "if" statements
            }
                if (player1turn){  //depending on player turn, the grids to be shown will be different
                    for (i=0; i<totalRect; i++){
                        grid[i].show();
                    } 
                    player1SetShipNotice.show(); //notice to tell player it is their turn to setships

                }
                else if(player2turn){
                    for (i=totalRect; i<(2*totalRect); i++){
                        grid[i].show();
                    }
                    player2SetShipNotice.show();
                }
        }


//---------------------------------------------------------------------------------
//                      Reveal Hidden Ship Function
//---------------------------------------------------------------------------------

        //Used to show all grids that are marked and not yet hit by Player1/2/AI (at end of game)
        var showAllMarkedShips = function(){
            for (i=0;i<(totalRect*2);i++){
                if (grid[i].marked){
                    if(!grid[i].hit){
                        grid[i].attr({'fill': "url('images/unhitships.jpg')"});
                    }
                }
            console.log("All Hidden ships shown!");
            }
        }

//---------------------------------------------------------------------------------
//                        Pre-Battlemode Grid Setup
//---------------------------------------------------------------------------------
        
        // Used to show all grids and ensure that previously set/marked ships do not appear by
        // setting all fill of the grid back to the original grid.jpg
        var prebattleModeSetup = function(){
            for (i=0;i<(totalRect*2);i++){ //using of for loops to change attributes of all grids
                grid[i].attr({'fill': "url('images/grid.jpg')"}).show();
            }
            
            gamemode="battleMode"; // mode will be switched to battleMode (for mouse events)
            console.log("Gamemode switched to battleMode")
        }


//---------------------------------------------------------------------------------
//                          Computer Set Battleship Function
//---------------------------------------------------------------------------------
    
        var AIsetBattleShip = function(){
            while (!numberofships==0){ //while loop used to ensure all 3 ships are set before it can exit function
                switchOrientationFunction(); //always change to allow for alternate orientations
                var randomship= randomnumber(totalRect,(totalRect*2-1)); //random point to set
                mouseClick=true; //to allow for AI to set ships in next function
                SetBattleShip_Function(randomship,"url('images/ship.jpg')"); //function used to check and set poisition if conditions are met
            }
        }


//---------------------------------------------------------------------------------
//                           SetBattleShip: Change Attribute Function
//---------------------------------------------------------------------------------

        var SetBattleShip_changeGridAttribute = function (obj,fillurl){ // this function is used to set attr
            i=0;
                while(i < obj.length){ // this allows us to know how many objects inside array and to run the function for all of them
                    obj[i].attr({'fill': fillurl});
                    
                    if (mouseClick){   // this allows us to know user has clicked the grid, to set the grid as marked (and result in mouseout event not triggering)
                        obj[i].marked=true;                      

                        // "if" statements used to check if all grids (inside array) within the loop are marked.
                        // if so, it decreases the next number of ships to set by 1 to prepare for the next ship the player will set
                        if(i==(numberofships-1)){ 
                            numberofships--;
                        }                        
                    }
                    
                    i++;
                }
            mouseClick=false;   //sets mouseClick back to false to prevent false clicking after while loop is completed
        }


//---------------------------------------------------------------------------------
//                         SetBattleShip: Legal Check Function
//---------------------------------------------------------------------------------
        
        // a series of checks are used to determine if the ships could be placed.
        var SetBattleShip_Function = function(i,fillurl) {   // function is designed to be reused for mouagain seover/mouseout too
            if (numberofships==3){ // checks the number of ships to be placed
                if(leftright){ // checks for orientation
                    // an oncoming series of if checks to determine if legal move for function to run
                    if((i%rootOftotalRect)<(rootOftotalRect-2)){ // mod function to check if mouse is on grid that would allow user to set ships. 
                        if(!grid[i].marked){                     // (i.e. if the mouse is on the 4th column, 3 ships cant be placed)
                            if(!grid[i+1].marked){ // further checks if grid(s) depending on ship size is previously marked
                                if(!grid[i+2].marked){
                                    var gridsArray = [grid[i], grid[i+1], grid[i+2]];  // creates array to be passed in to set attribute
                                    SetBattleShip_changeGridAttribute(gridsArray,fillurl); // function that sets attribute(s)
                                }
                            }
                        }
                    }
                }
                else if(topdown){ // checks for orientation
                    if ( (i<totalRect-2*rootOftotalRect) || ( (i>totalRect-1)&&(i<((2*totalRect)-(2*rootOftotalRect))) ) ){ // || (or) is used to check either or conditions for ships to be placed vertically
                        // an oncoming series of if checks to determine if legal move for function to run                   // this is done by checking the rows the mouse is on
                        if(!grid[i].marked){                                                                                
                            if(!grid[i+rootOftotalRect].marked){
                                if(!grid[i+(2*rootOftotalRect)].marked){
                                    var gridsArray = [grid[i], grid[i+rootOftotalRect], grid[i+(2*rootOftotalRect)]];
                                    SetBattleShip_changeGridAttribute(gridsArray,fillurl);
                                }
                            }
                        }
                    }
                }                        
            }

            else if(numberofships==2){ // checks the number of ships to be placed
                if (leftright){ // checks for orientation
                    // an oncoming series of if checks to determine if legal move for function to run
                    if((i%rootOftotalRect)<(rootOftotalRect-1)){
                        if(!grid[i].marked){
                            if(!grid[i+1].marked){
                                var gridsArray = [grid[i], grid[i+1]]; 
                                SetBattleShip_changeGridAttribute(gridsArray,fillurl);
                            }
                        }
                    }
                }
                else if(topdown){ // checks for orientation
                    // an oncoming series of if checks to determine if legal move for function to run
                    if ( (i<totalRect-rootOftotalRect) || ( (i>totalRect-1)&&(i<((2*totalRect)-rootOftotalRect)) ) ){
                        if(!grid[i].marked){
                            if(!grid[i+rootOftotalRect].marked){
                                var gridsArray = [grid[i], grid[i+rootOftotalRect]];
                                SetBattleShip_changeGridAttribute(gridsArray,fillurl);
                            }
                        }
                    }
                }
            }
            
            else if(numberofships==1){ // checks the number of ships to be placed
                // there are lesser checks since placing 1 ships has lesser conditions to check for as compared to 2 and 3
                if(!grid[i].marked){
                    var gridsArray = [grid[i]];
                    SetBattleShip_changeGridAttribute(gridsArray,fillurl);
                }
            }      
                
        }
 

//---------------------------------------------------------------------------------
//                     Battle Mode: Check and Shoot
//---------------------------------------------------------------------------------

        // hit = refers to if the spot has been previously aimed/shot at
        // marked = refers to if there is an exisiting ship that user/AI has placed

        var BattleMode_Shooting = function(i){
            // a series of "if" statements are used to check for the conditions to determine if grid
            // selected is marked with a ship. If so, it will add on to the shoot count and trigger image fills and sound.
            if (!grid[i].hit){
                if (grid[i].marked){
                    grid[i].attr({'fill': "url('images/shiphit.jpg')"});
                    grid[i].hit=true;
                        if (player1turn){
                            playBombSound();
                            player1totalhit++;
                                if (player1totalhit==6){ // if total hit is at 6, game would end
                                    // setTimeout is purposely used so that ship fill is set before alert is shown
                                    setTimeout(function(){alert("Player 1 has won!");},100);                                  
                                    gameEnded();
                                }
                        }
                        else if (player2turn){
                            playBombSound();
                            player2totalhit++;
                                if (player2totalhit==6){ // if total hit is at 6, game would end
                                    // setTimeout is purposely used so that ship fill is set before alert is shown
                                    setTimeout(function(){alert("Player 2 has won!");},100);
                                    gameEnded();
                                }
                        }
                        else if (AIturn){
                            AItotalhit++;
                                if (AItotalhit==6){
                                    // setTimeout is purposely used so that ship fill is set before alert is shown
                                    setTimeout(function(){alert("Computer has won!");},100);
                                    gameEnded();
                                }
                        }
                
                }

                // if conditions are not met (i.e. target is not marked with ship), the grid will
                // just mark the grid as hit, but not hit on target.
                else { 
                    grid[i].attr({'fill': "url('images/nothinghit.jpg')"});
                    grid[i].hit=true;
                }
                
                switchPlayer(); // After which, player/AI turn will be switched here.
                
                }

            else {
                // this caters for AI turn to reselect and run code again if previous randomnumber is a previously hit mark
                if (AIturn){
                    i = randomnumber(0,totalRect-1);
                    console.log("Previous grid selected by computer has already been picked. New grid selected: " + i);
                    BattleMode_Shooting(i);
                }
            }

        }


//---------------------------------------------------------------------------------
//                              Grid Event Listener Function
//---------------------------------------------------------------------------------
    
        // This function is used to add all the respective mouse listeners.
        // This is done so as to avoid the messy codes when drawing the grids

        // In the respective mouse event listeners, "if" statements are used to check which state
        // the game is in so as to avoid wrong intended actions/events.

        var setGridEventListeners = function(i){
       
            // [MOUSEOVER EVENT LISTENER]
            grid[i].addEventListener('mouseover', function(){
                if (gamemode=="setBattleShips"){ // game mode check
                    SetBattleShip_Function(i,"url('images/ship.jpg')"); // function used to change grid fill to ships with user mousemove after checks and conditions met
                }

                else if (gamemode=="battleMode"){ // game mode check
                    if (!grid[i].hit){ // conditions requires grid which had not previously been hit/aimed at
                        grid[i].attr({'fill': "url('images/aim.jpg')"}); // changes grid to fill of aiming image on mouseover
                    }
                }
            });


            // [MOUSE OUT EVENT LISTENER]
            grid[i].addEventListener('mouseout', function(){
                if (gamemode=="setBattleShips"){ // game mode check
                    SetBattleShip_Function(i,"url('images/grid.jpg')"); //revert back to original fill after checks
                }

                else if (gamemode=="battleMode"){ // game mode check
                    if (!grid[i].hit){ // conditions requires grid which had not previously been hit/aimed at
                        grid[i].attr({'fill': "url('images/grid.jpg')"}); //revert back to original fill
                    }                    
                }
            });



            // [MOUSE CLICK EVENT LISTENER]
            grid[i].addEventListener('click', function(){
                if (gamemode=="setBattleShips"){ // game mode check
                    if (player1turn){
                        mouseClick=true; // so that SetBattleShip_changeGridAttribute can activate to change attr
                        SetBattleShip_Function(i,"url('images/ship.jpg')");

                        if (numberofships==0){ // to check if player has finish setting all ships
                            player1turn=false; // to allow for transition into other player's turn
                            closecurtain();
                                if (AImode){ // used to check if AImode is enabled; if so, run the below codes
                                    console.log("AI will set the ships now!");
                                    numberofships=3;
                                    AIsetBattleShip();
                                    setTimeout(function(){  // used to delay showing of buttons for better visual effects
                                        battleButton.show();
                                        allShipsAreSet.show();
                                    },600); 
                                }
                                else {
                                    player2turn=true; // if AI mode not enable, it will move on to player 2 turn
                                    setTimeout(function(){  // used to delay showing of buttons/images for better visual effects
                                        startSetShipButton.show();
                                        itisPlayer2TurnToSetShip.show();
                                        numberofships=3; // to allow player 2 to set the ships
                                        leftright = true; // reset to original settings
                                        topdown = false; // reset to original settings
                                        player1SetShipNotice.hide(); // reset to original settings
                                        player2SetShipNotice.hide(); // reset to original settings
                                    },600);
                                }
                            
                        }
                    }
                    else if (player2turn){ //starting of player 2's turn to set ships
                        mouseClick=true;
                        SetBattleShip_Function(i,"url('images/ship.jpg')");
                        if (numberofships==0){
                            closecurtain();
                            setTimeout(function(){  // used to delay showing of buttons for better visual effects
                                battleButton.show();
                                allShipsAreSet.show();
                            },600);
                        }
                    }
                }

                else if (gamemode=="battleMode"){ // game mode check
                        BattleMode_Shooting(i);
                        if (AIturn){ // this allows for AI to automatically aim and hit ships right after user has clicked
                            if (player1totalhit<6){ // to prevent AI from selecting anymore if player 1 already hit 6 ships
                                var randomgrid = randomnumber(0, totalRect-1); //used to generate random number for user to hit grid
                                console.log("AI has picked a random grid: " + randomgrid);
                                BattleMode_Shooting(randomgrid);
                            }
                        }
                        battleModeHitUpdates(); // to update the scores                                   
                }
            });


        }

//---------------------------------------------------------------------------------
//                                Grid Creation
//---------------------------------------------------------------------------------
        var grid =[]
        var totalRect = 36; //total grid per side that needs to be created (must be root-able)
        var rootOftotalRect = Math.sqrt(totalRect)

        console.log("Number of Squares on the Length/Breadth: " + rootOftotalRect);
        // using "for" loop to create the grids that adjusts dynamically
        for (i=0; i<rootOftotalRect; i++){
            for (k=0; k<rootOftotalRect; k++){
                // all grids are intially hidden
                grid[(i*rootOftotalRect)+k] = paper.rect(30+(40*k),55+(40*i),40,40).attr({'fill': "url('images/grid.jpg')"}).hide();
                setGridEventListeners((i*rootOftotalRect)+k);  
            } 
        }  

        // using "for" loop to create the grids that adjusts dynamically
        for (i=rootOftotalRect; i<(2*rootOftotalRect); i++){
            for (k=0; k<rootOftotalRect; k++){
                // all grids are intially hidden
                grid[(i*rootOftotalRect)+k] = paper.rect(330+(40*k),55+(40*(i-rootOftotalRect)),40,40).attr({'fill': "url('images/grid.jpg')"}).hide();
                setGridEventListeners((i*rootOftotalRect)+k);    
            }
        }

//---------------------------------------------------------------------------------
//                             Grid Blockers 
//---------------------------------------------------------------------------------

        // Grid Blockers are created to block/prevent player clicks on grid when switching turns

        var leftGridBlock = paper.rect(30,55,40*rootOftotalRect,40*rootOftotalRect).attr({'fill': 'black', 'fill-opacity':'0.5'}).hide();
        var rightGridBlock = paper.rect(330,55,40*rootOftotalRect,40*rootOftotalRect).attr({'fill': 'black','fill-opacity':'0.5'}).hide();


//---------------------------------------------------------------------------------
//                         Raphael Text: Player's Total Hits
//---------------------------------------------------------------------------------

        var player1hittext = paper.text(450,320,"Player 1 has sunk : " + player1totalhit + " ships").attr({'fill': 'white', 'font-size': 20, 'font-weight': 'bold'}).hide();
        var player2hittext = paper.text(150,320,"Player 2 has sunk : " + player2totalhit + " ships").attr({'fill': 'white', 'font-size': 20, 'font-weight': 'bold'}).hide();
        var AIhittext = paper.text(150,320,"Computer has sunk : " + AItotalhit + " ships").attr({'fill': 'white', 'font-size': 20, 'font-weight': 'bold'}).hide();


//---------------------------------------------------------------------------------
//                          Total Hits Update Function  
//---------------------------------------------------------------------------------

        // Function is used to update the hit counts each time the player/AI has hit a ship (depending on mode).
        var battleModeHitUpdates = function(){
            if (AImode){
                player1hittext.attr({text: "Player 1 has sunk : " + player1totalhit + " ship(s)"}).show();
                AIhittext.attr({text: "Computer has sunk : " + AItotalhit + " ship(s)"}).show();
            }
            else{ 
                player1hittext.attr({text: "Player 1 has sunk : " + player1totalhit + " ship(s)"}).show();
                player2hittext.attr({text: "Player 2 has sunk : " + player2totalhit + " ship(s)"}).show();
                }
        }



//---------------------------------------------------------------------------------
//                     Raphael Image and Buttons: Under Curtain
//---------------------------------------------------------------------------------

        
        var switchOrientation = paper.image("images/buttons/rotatebutton.png", 255,305,90,40).hide();

        var revealAllMarkedButton = paper.image("images/buttons/revealButtons.png", 300,350,120,40).hide();
        var mainMenuButton = paper.image("images/buttons/mainmenubutton.png", 200,350,90,40).hide();

        var instructionsfor1player = paper.image("images/1playermode.png", 25, 1, 550, 350).hide();
        var instructionsfor2player = paper.image("images/2playermode.png", 25, 1, 550, 350).hide();
        var confirmInstructionButton = paper.image("images/buttons/confirmbutton.png", 250,350,90,40).hide();
        var exitButton = paper.image("images/buttons/exitbutton.png", 20,350,90,40).hide();

        var playerturnbanner = paper.image("images/topbanner.png", 1, 0, 1200, 42).hide();

        // animation for player 1 turn banner: 
        var bannerForPlayer1Turn = function(){     
            playerturnbanner.animate({x:1},600);
        }

        // animation for player 2 turn banner: 
        var bannerForPlayer2Turn = function(){
            playerturnbanner.animate({x:-599},600);
        }

        var player1SetShipNotice = paper.image("images/setshipnotice.png", 282,75,300,180).hide();
        var player2SetShipNotice = paper.image("images/setshipnotice.png", 12,75,300,180).hide();
        var gameHasEndedNotice = paper.image("images/gamehasended.png", 1,0,600,42).hide();
        

//---------------------------------------------------------------------------------
//                                 Opening and Closing Curtain
//---------------------------------------------------------------------------------       

        var toppiece = paper.image("images/toppiece.png", 1, 0, 600, 253);
        var bottompiece = paper.image("images/bottompiece.png", 1, 179, 600, 221);

        // animation for curtain opening:
        var opencurtain = function(){
            playSlidingSound()
            toppiece.animate({y:-260},600);
            bottompiece.animate({y:420},600);
        }

        // animation for curtain closing:
        var closecurtain = function(){
            playSlidingSound()
            toppiece.animate({y:0},600);
            bottompiece.animate({y:179},600);
        }


//---------------------------------------------------------------------------------
//                        Raphael Image and Buttons: Over Curtain
//---------------------------------------------------------------------------------
        // buttons/images are created here so that they will be hidden behind curtain (i.e. reveal when curtain open)

        var battleButton = paper.image("images/buttons/battlebutton.png", 260,325,90,40).hide();
        var letsPlayAIMode = paper.image("images/buttons/1playerbutton.png", 200,270,90,40).hide();
        var letsPlay2PlayerMode = paper.image("images/buttons/2playerbutton.png", 310,270,90,40).hide();
        
        var startSetShipButton = paper.image("images/buttons/setshipsbutton.png", 500,320,90,40).hide();
           
        var itisAIturnToSetShip = paper.image("images/player1andAI.png", 140, 260, 320, 120).hide();
        var itisPlayer1TurnToSetShip = paper.image("images/player1turn.png", 140, 260, 320, 120).hide();
        var itisPlayer2TurnToSetShip = paper.image("images/player2turn.png", 140, 260, 320, 120).hide();
        
        var allShipsAreSet = paper.image("images/allshipsareset.png", 150, 260, 300, 60).hide();
        
        var howToPlayButton = paper.image("images/buttons/howtoplaybutton.png", 240,320,120,40).hide();
        var instructionsForGame = paper.image("images/instructionsforgame.png", 25,15, 550,350).hide();
        var closeinstructionsForGame = paper.image("images/buttons/okaygotit.png",240,340, 120,40).hide();

//---------------------------------------------------------------------------------
//                          Raphael Image and Buttons Event Listener
//---------------------------------------------------------------------------------
       
        battleButton.addEventListener('click',function(){
            gameStart_BattleMode();
            opencurtain();
            playerturnbanner.show();
            player1SetShipNotice.hide();
            player2SetShipNotice.hide();
            allShipsAreSet.hide();
        });

        exitButton.addEventListener('click', function(){
            closecurtain();
            setTimeout(mainMenu,600); //used setTimeout so that button only appear after curtain animation over
        });

        mainMenuButton.addEventListener('click', function(){
            closecurtain();
            setTimeout(mainMenu,600); //used setTimeout so that button only appear after curtain animation over
        });


        revealAllMarkedButton.addEventListener('click',showAllMarkedShips);
        switchOrientation.addEventListener('click',switchOrientationFunction);

       letsPlayAIMode.addEventListener('click',function(){
            letsPlay2PlayerMode.hide();
            letsPlayAIMode.hide();
            howToPlayButton.hide();
            AImode=true; // enables computer to play with user (i.e. single player)
            opencurtain();
            instructionsfor1player.show();
            confirmInstructionButton.show();
            exitButton.show();
        });

        letsPlay2PlayerMode.addEventListener('click',function(){
            letsPlay2PlayerMode.hide();
            letsPlayAIMode.hide();
            howToPlayButton.hide();
            opencurtain();
            instructionsfor2player.show();
            confirmInstructionButton.show();
            exitButton.show();
        });

       confirmInstructionButton.addEventListener('click',function(){
            confirmInstructionButton.hide();
            closecurtain();
            setTimeout(function(){
                startSetShipButton.show();
                if (AImode){
                    itisAIturnToSetShip.show();
                }
                else {
                    itisPlayer1TurnToSetShip.show();
                }
            },600);
       });

       startSetShipButton.addEventListener('click',function(){
            gamemode="setBattleShips";
            switchOrientation.show();       
            setBattleship_PlayerGrid();
            opencurtain();
            startSetShipButton.hide();
            itisAIturnToSetShip.hide();
            itisPlayer1TurnToSetShip.hide();
            itisPlayer2TurnToSetShip.hide();
            instructionsfor1player.hide();
            instructionsfor2player.hide();
       });


       howToPlayButton.addEventListener('click',function(){
            instructionsForGame.show();
            closeinstructionsForGame.show();

       });

       closeinstructionsForGame.addEventListener('click', function(){
            instructionsForGame.hide();
            closeinstructionsForGame.hide();
       })


//---------------------------------------------------------------------------------
//                            Restart Settings: Main Menu
//---------------------------------------------------------------------------------

        var mainMenu = function(){
            letsPlayAIMode.show();
            letsPlay2PlayerMode.show();
            mainMenuButton.hide();
            leftGridBlock.hide();
            rightGridBlock.hide();
            switchOrientation.hide();
            numberofships=3;
            leftright = true;
            topdown = false;
            AImode=false;
            player1turn = true;
            player2turn = false;
            AIturn = false;
            player1totalhit=0;
            player2totalhit=0;
            AItotalhit=0;
            player1hittext.hide();
            player2hittext.hide();
            AIhittext.hide();
            battleButton.hide(); 
            startSetShipButton.hide();   
            instructionsfor1player.hide();
            instructionsfor2player.hide();
            confirmInstructionButton.hide(); 
            itisAIturnToSetShip.hide();
            itisPlayer1TurnToSetShip.hide();
            itisPlayer2TurnToSetShip.hide();
            playerturnbanner.hide();
            player1SetShipNotice.hide();
            player2SetShipNotice.hide();
            allShipsAreSet.hide();
            revealAllMarkedButton.hide();
            howToPlayButton.show();
            closeinstructionsForGame.hide();
            gameHasEndedNotice.hide();


            // used to set grid back to original fill and settings
            for (i=0; i<totalRect*2; i++){ 
                grid[i].attr({'fill': "url('images/grid.jpg')"});
                grid[i].marked=false;
                grid[i].hit=false;
                grid[i].hide();
            }
        }

        // run to ensure all setting are consistent
        mainMenu();

//---------------------------------------------------------------------------------
//                            Mode Settings: Battle Mode
//---------------------------------------------------------------------------------

        var gameStart_BattleMode = function(){
            prebattleModeSetup();
            leftGridBlock.show();
            rightGridBlock.hide();
            battleButton.hide();
            switchOrientation.hide()
            player1turn=true;
            bannerForPlayer1Turn();
            player2turn=false;
            AIturn=false;
            battleModeHitUpdates();            
        }

//---------------------------------------------------------------------------------
//                            Mode Settings: Game Ended
//---------------------------------------------------------------------------------  

    var gameEnded = function(){
        mainMenuButton.show();
        gamemode="gameEnded";
        playerturnbanner.hide();
        leftGridBlock.show();
        rightGridBlock.show();
        revealAllMarkedButton.show();
        exitButton.hide();
        gameHasEndedNotice.show();
    }


//---------------------------------------------------------------------------------
//                                    Audio
//---------------------------------------------------------------------------------

        // sound for curtain: (triggered in function)
        var slidingSound = new Audio('sounds/slidingaudio.wav')

        var playSlidingSound = function(){ // function used as .play() is unable to playback same file when it's already playing
            if (slidingSound.paused) {
                slidingSound.play(); // plays if it's not playing the audio
            }
            else{
                slidingSound.currentTime = 0 // this resets the playback time to 0, allowing it to playback "instantly"
            }
        }

        // background music:
        var bgmusic = new Audio('sounds/waves.wav')
        bgmusic.play(); // start playing
        bgmusic.loop = true; // + loop


        // sound for ship hit: (triggered in function)
        var bombSound = new Audio('sounds/bomb.wav')

        var playBombSound = function(){ // function used as .play() is unable to playback same file when it's already playing
            if (bombSound.paused) {
                bombSound.play(); // plays if it's not playing the audio
            }
            else{
                bombSound.currentTime = 0 // this resets the playback time to 0, allowing it to playback "instantly"
            }
        }

        
        // HTML + Javascript for muting all sound:
        var muteButton = document.getElementById("mute");

        muteButton.addEventListener('change', function(){
            if (muteButton.checked){ // checks if checkbox is checked
                bombSound.muted = true;
                bgmusic.muted = true;
                slidingSound.muted = true;
            }
            else {
                bombSound.muted = false;
                bgmusic.muted = false;
                slidingSound.muted = false;
            }
        })


        

// do not add any code below                              
    }
);
