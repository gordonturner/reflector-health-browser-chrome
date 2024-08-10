
// Add a listener to call ready function when document is loaded (DOMContentLoaded).
document.addEventListener("DOMContentLoaded", ready);

function ready() {
console.log('ready() called')

installId = 'XXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XXXX'
enableDarkMode = false;

chrome.storage.sync.get(
    { installId: installId, enableDarkMode: enableDarkMode },
    (items) => {
      installId = items.installId;
      enableDarkMode = items.enableDarkMode;
      console.log("installId: " + installId);
      console.log("enableDarkMode: " + enableDarkMode);
      updatePage();
    }
);

// Called after the storage sync, commenting out
// updatePage()
//   1000  1 sec
//  10000 10 sec
// 120000  2 min
// 300000  5 min
const intervalID = setInterval( updatePage, 120000 );
}

function updatePage() {
console.log('updatePage() called')

if ( enableDarkMode ) {
    document.body.style.backgroundColor = "black";
    document.getElementById("fitnessMoveTitle").style.color = "white";
    document.getElementById("fitnessExerciseTitle").style.color = "white";
    document.getElementById("fitnessStandTitle").style.color = "white";
} else {
    document.body.style.backgroundColor = "white";
    document.getElementById("fitnessMoveTitle").style.color = "black";
    document.getElementById("fitnessExerciseTitle").style.color = "black";
    document.getElementById("fitnessStandTitle").style.color = "black";
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

fetch("https://api.reflectorhealth.com/v2/activity/".concat(installId).concat("/now"))
.then((response) => response.json())
.then((data) => {

    console.log( data.activityMoveMode + '' );
    console.log( data.appleMoveTime + '/' + data.appleMoveTimeGoal );
    console.log( data.activeEnergyBurned + '/' + data.activeEnergyBurnedGoal );
    console.log( data.appleExerciseTime + '/' + data.appleExerciseTimeGoal );
    console.log( data.appleStandHours + '/' + data.appleStandHoursGoal );

    // activityMoveMode, either calories burned or time moving flag
    // 0 = appleMoveTime
    // 1 = activeEnergyBurned
    var fitnessMove;
    var fitnessMoveGoal;
    var fitnessMoveUnit;
    if ( data.activityMoveMode == 0 ) {
    console.log( 'Setting fitnessMove to appleMoveTime/appleMoveTimeGoal' );
    fitnessMove = data.appleMoveTime;
    fitnessMoveGoal = data.appleMoveTimeGoal;
    fitnessMoveUnit = 'MIN';
    } else {
    console.log( 'Setting fitnessMove to activeEnergyBurned/activeEnergyBurnedGoal' );
    fitnessMove = data.activeEnergyBurned;
    fitnessMoveGoal = data.activeEnergyBurnedGoal;  
    fitnessMoveUnit = 'CAL';
    }

    document.getElementById("fitnessMove").innerHTML = fitnessMove + '/' + fitnessMoveGoal;
    document.getElementById("fitnessMoveUnit").innerHTML = fitnessMoveUnit;
    document.getElementById("fitnessExercise").innerHTML = data.appleExerciseTime + '/' + data.appleExerciseTimeGoal ;
    document.getElementById("fitnessStand").innerHTML = data.appleStandHours + '/' + data.appleStandHoursGoal;
});
}

// Search functionality

var shiftDown = false;

$(function() {

    console.log('loading functions');

    $('#search-form input').keydown(function(e) {

        console.log('search-form');
        
        if (e.keyCode == 13) {
        e.preventDefault();
        var query = $('#search-form input').val();

        console.log('search for: ' + query);

        query = query.replace(/ /g, '+', query);
        var url = 'https://google.com/search?q=' + query;

        $('<a>').attr('href', url).attr('target', '_blank')[0].click();
        
        $('#search-form input').val("");
        }
    });

});

// Extension Configuration

document.querySelector('#go-to-options').addEventListener('click', function() {
    window.open(chrome.runtime.getURL('options.html'));
});
