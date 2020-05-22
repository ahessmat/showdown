//UPDATE CANVAS CODE START
var cvs = document.getElementById("canvas");
cvs.width = window.innerWidth;
//cvs.height = window.innerHeight;
//UPDATE CANVAS CODE END

//COUNTDOWN CLOCK START

//COUNTDOWN CLOCK END


//WHEEL CODE START
var stage = new createjs.Stage("canvas");
createjs.Ticker.timingMode = createjs.Ticker.RAF;
createjs.Ticker.on("tick", tick);

var c = new createjs.Container(),
		s = new createjs.Shape();
    
//segments should be increments of 4 to look best
//default drawing
var segments = 24,
	size = 250,
	angle = Math.PI*2/segments;

//red notch
var notch = new createjs.Shape();

//COUNTDOWN CLOCK
var clock = new createjs.Container();
clock.x = size*3;
clock.y = 20;
clock.time = 20.0;

//orange backdrop
var clockBG = new createjs.Shape();
clockBG.graphics.beginFill("orange").drawRoundRect(0,0,300,200,25);

//grey clockface
var clockFace = new createjs.Shape();
clockFace.graphics.beginFill("grey").drawRoundRect(10,40,280,150,25);

//numbers
var clockNums = new createjs.Text("20.0", "bold 140px Arial", "#fff")
    .set({x: 15, y: 50, textAlign:"left"});

//clock title
var clockTitle = new createjs.Text("Timer", "bold 40px Arial", "#fff")
    .set({x: 150, y: 5, textAlign: "center"});

//add all the clock parts together
clock.addChild(clockBG,clockFace,clockNums,clockTitle);

// The text for the challenge that will be performed
var challenge_text = new createjs.Text("TEST testing testing TEST testing", "50px Arial", "#000")
    .set({x: size*3, y: size, textAlign:"left", lineWidth: 1000});
    
//this updates the clock timer
function updateTime(){
  clock.time = 20.0;
  var timeLeft = clock.time;
  var countD = setInterval(decrement, 100); //every tenth of a second, update clock
  
  function decrement(){
    document.addEventListener("keypress",pauseTime);
    if (timeLeft <= 0){
      clearInterval(countD); //stop setInterval()
      clockNums.text = 0;
      stage.update();
    } else {
      timeLeft = parseFloat((Math.round((timeLeft-0.1)*10) / 10).toFixed(1));
      clockNums.text = timeLeft;
      stage.update();
    }

    //checks if spacebar is hit
    function pauseTime(e){
      if (e.keyCode == 32){
        clearInterval(countD);
        clockNums.text = timeLeft;
        stage.update();
      }
    }
  } 
}



function updated(segs){

    c.removeAllChildren();
    segments = segs;
    angle = Math.PI*2/segs;

    // Draw a wheel  
    for (var i=0, l=segs; i<l; i++) {
    	s.graphics.f((i%2==0)?"#bbb":"#ddd")
      	.mt(0,0)
      	.lt(Math.cos(angle*i)*size, Math.sin(angle*i)*size)
    		.arc(0,0,size, i*angle, i*angle+angle)
        .lt(0,0);

      // Add text child
      var num = new createjs.Text(i,(size/8)+"px Arial Black", "#888")
    		.set({textAlign:"center", regY:size-5, rotation:angle*180/Math.PI * (i+0.5)});
      c.addChild(num);
    }

    c.addChildAt(s, 0);
    c.x = c.y = size + 20; 
    c.cache(-size,-size,size*2,size*2);


    c.rotation = -360/segs/2; // Rotate by 1/2 segment to align at 0

    // reset red notch
    notch.x = c.x;
    notch.y = c.y-size;
    notch.graphics.f("red").drawPolyStar(0,0,12,3,2,90);
}


updated(segments);

// Where the wheel should land
var newNum = new createjs.Text("", "50px Arial", "#000")
	.set({x:c.x, y: c.y+size+10, textAlign:"center"});



//Adding all elements to stage
stage.addChild(c,notch,newNum,challenge_text,clock);

// Mode. 0=stopped, 1=moving, 2=stopping
c.mode = 0;

// When clicked, cycle mode.
c.on("click", function(e) {
	if (c.mode == 0) {
  	c.mode = 1;
  } else if (c.mode == 1) {
  	c.mode = 2;
    
    // Slow down. Find the end angle, and tween to it
    var num = Math.random() * segments | 0, // Choose a number,
    	angleR = angle * 180/Math.PI, // Angle in degrees
     	adjusted = (c.rotation - 360),	// Add to the current rotation
      numRotations = Math.ceil(adjusted/360)*360 - num*angleR - angleR/2; // Find the final number.
    
    
    
    createjs.Tween.get(c)
        .to({rotation:numRotations}, 3000, createjs.Ease.cubicOut)
        
      //THIS IS THE CODE FOR WHEN THE WHEEL STOPS  
      .call(function() { 
          c.mode = 0; 
          newNum.text = num; // Show the end number
          challenge_text.text = arr[num];  //show what the challenge is
          updateTime();
    });
  }
});


function tick(event) {
	if (c.mode == 1) {
  	c.rotation -= 10; // Rotate if mode 1
  }
	stage.update(event);
}
//WHEEL CODE END




//FILE UPLOAD CODE START
var arr = [];

const output = document.getElementById('output');
if (window.FileList && window.File) {
    document.getElementById('file-selector').addEventListener('change', event => {
        output.innerHTML = '';
    
        const reader = new FileReader();

        //when a file is uploaded...
        reader.addEventListener('load', (event) => {
            
            //empty the last array
            arr = [];

            const text = event.target.result;
            //...parse each line
            const allLines = text.split(/\r\n|\n/);
            //...and add each line to the array
            allLines.forEach((line) => {
                arr.push(line);
            });

            //update the wheel
            updated(arr.length);
        });

        reader.readAsText(document.getElementById('file-selector').files[0]);

    });

    
    
}



//FILE UPLOAD CODE END