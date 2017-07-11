var events = [
  {
    item: 'Sample Item',
    location: 'Sample Location',
    start: 30,
    end: 150
  },
  {
    item: 'Sample Item',
    location: 'Sample Location',
    start: 540,
    end: 600
  },
  {
    item: 'Sample Item',
    location: 'Sample Location',
    start: 560,
    end: 620
  },
  {
    item: 'Sample Item',
    location: 'Sample Location',
    start: 610,
    end: 670
  }
];

// Calendar times
var getTwelveHourClockTime = function(num) {
  var hour;
  var meridiem = 'AM';
  if (typeof num === 'number') {
    if (num >= 12) {
      meridiem = 'PM'
      hour = (num === 12) ? 12 : (num - 12);
    } else {
      hour = num;
    }
    return [hour.toString(), meridiem];
  } else {
    return null;
  }
};

var getTimeIncrements = function(startTime) {
  var startTime = startTime || 9;
  var endTime = startTime + 12;
  var hourIncrements = [];
  var timeData;
  var i = startTime;
  while (i <= endTime) {
    timeData = getTwelveHourClockTime(i);
    if (timeData) {
      hourIncrements.push(timeData);
    }
    ++i;
  }
  hourIncrements.forEach(function(hour, index) {
    var div = document.createElement('div');
    var hourDiv = document.createElement('div');
    var halfHourDiv = document.createElement('div');
    var hourSpan = document.createElement('span');
    var halfHourSpan = document.createElement('span');
    var meridiemSpan = document.createElement('span');
    var hourText = document.createTextNode(hour[0] + ':00 ');
    var halfHourText = document.createTextNode(hour[0] + ':30 ');
    var meridiemText = document.createTextNode(hour[1]);
    hourDiv.className += 'half-hour-increment';
    halfHourDiv.className += 'half-hour-increment';
    hourSpan.className += 'hour';
    halfHourSpan.className += 'half-hour';
    meridiemSpan.className += 'meridiem';
    meridiemSpan.appendChild(meridiemText);
    hourSpan.appendChild(hourText);
    hourSpan.appendChild(meridiemSpan);
    halfHourSpan.appendChild(halfHourText);
    hourDiv.appendChild(hourSpan);
    halfHourDiv.appendChild(halfHourSpan);
    document.getElementById('time-container').appendChild(hourDiv);
    if (index !== hourIncrements.length - 1) {
      document.getElementById('time-container').appendChild(halfHourDiv);
    } else {
      hourDiv.className += ' last';
    }
  });
};

// Calendar events
var CAL_WIDTH = 600;
var columns = [];
var lastEventEnding = null;
var populateEvents = function(columns, calWidth) {
  var numEvents = columns.length;
  for (var i = 0; i < columns.length; i++) {
    var col = columns[i];
    for (var j = 0; j < col.length; j++) {
      var event = col[j];
        eventDiv = document.createElement("div");
        itemDiv = document.createElement("div");
        locationDiv = document.createElement("div");
        itemText = document.createTextNode(event.item);
        locationText = document.createTextNode(event.location);
        itemDiv.appendChild(itemText);
        eventDiv.className += 'event';
        itemDiv.className += 'item';
        locationDiv.className += 'location';
        locationDiv.appendChild(locationText);
        eventDiv.appendChild(itemDiv);
        eventDiv.appendChild(locationDiv);
        eventDiv.style.cssText += 'height:' + (event.end - event.start);
        eventDiv.style.cssText += 'top:' + event.start;
        eventDiv.style.cssText += 'left:' + (10 + ((i/numEvents) * 600)) + 'px';
        eventDiv.style.cssText += 'width:' + (calWidth/numEvents) + 'px';
        document.getElementById('calendar-container').appendChild(eventDiv);
    }
  }
};
var collidesWith = function(a, b) {
  return a.end > b.start && a.start < b.end;
};

var layOutDay = function(events) {
  // Ensure events are sorted by start time, earliest to latest, and then sorted
  // by ending time.
  events.sort(function(e1, e2) {
    if (e1.start < e2.start) return -1;
    if (e1.start > e2.start) return 1;
    if (e1.end < e2.end) return -1;
    if (e1.end > e2.end) return 1;
    return 0;
  });
  events.forEach(function(e, index) {
    var col;
    var addedToCal;
    if (lastEventEnding !== null && e.start >= lastEventEnding) {
      populateEvents(columns, CAL_WIDTH);
      columns = [];
      lastEventEnding = null;
    }
    addedToCal = false;
    for (var i = 0; i < columns.length; i++) {
      col = columns[i];
      if (!collidesWith(col[col.length - 1], e)) {
        col.push(e);
        addedToCal = true;
        break;
      }
    }
    if (!addedToCal) {
      // create a new column with the event positioned within it.
      columns.push([e]);
    }
    if (lastEventEnding === null || e.end > lastEventEnding) {
      lastEventEnding = e.end;
    }
  });
  if (columns.length > 0) {
    populateEvents(columns, CAL_WIDTH);
  }
};

window.onload = function() {
  getTimeIncrements(9);
  layOutDay(events);
};