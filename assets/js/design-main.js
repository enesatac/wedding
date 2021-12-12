function updateTimer() {
    future  = Date.parse("May 28, 2022 13:00:00");
    now     = new Date();
    diff    = future - now;
  
    days  = Math.floor( diff / (1000*60*60*24) );
    hours = Math.floor( diff / (1000*60*60) );
    mins  = Math.floor( diff / (1000*60) );
    secs  = Math.floor( diff / 1000 );
  
    d = days;
    h = hours - days  * 24;
    m = mins  - hours * 60;
    s = secs  - mins  * 60;
  
    document.getElementById("timer")
      .innerHTML =
        '<div>' + d + '<span>gün</span></div>' +
        '<div>' + h + '<span>saat</span></div>' +
        '<div>' + m + '<span>dakika</span></div>' +
        '<div>' + s + '<span>saniye</span></div>' ;
  }
  setInterval('updateTimer()', 1000 );
  