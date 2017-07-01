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
    item: 'Sample Item TEST TO REMOVE',
    location: 'Sample Location',
    start: 560,
    end: 620
  },
  {
    item: 'Sample Item',
    location: 'Sample Location',
    start: 610,
    end: 670
  },
  {
    item: 'Sample TEST640',
    location: 'Sample Location',
    start: 640,
    end: 680
  },
  {
    item: 'Sample TEST600',
    location: 'Sample Location',
    start: 600,
    end: 720
  },
];

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

var Row = function() {
  this.start = null;
  this.end = null;
  this.eventIds = [];
  this.sharedWith = 1;
};

var checkForSharedRow = function(events, currIndex, currStart, currEnd) {
  var numEvents = 1;
  events.forEach(function(event, index) {
    if (index !== currIndex && event.end < currEnd && event.end > currStart) {
      ++numEvents;
    }
  });
  return numEvents;
};

var setEventRows = function(events) {
  var currEvent;
  var nextEvent;
  var rows = [];
  var currRow = new Row();
  for (var i = 0; i < events.length; i++) {
    currEvent = events[i];
    nextEvent = events[i + 1];
    // If it's the first event of each event row, establish # of events/row.
    if (currRow.eventIds.length < 1) {
      currRow.sharedWith = currRow.eventIds.length;
      // checkForSharedRow(events, i, currEvent.start,
      //   currEvent.end);
    }
    currRow.eventIds.push(i);
    currRow.start = currRow.start ? currRow.start : currEvent.start;
    currRow.end = currRow.end ? currRow.end : currEvent.end;
    if (nextEvent && nextEvent.start < currRow.end) {
      // Add to currRow at the top of the next iteration.
    } else {
      // Add currRow to rows array and create a new row object.
      rows.push(currRow);
      currRow = new Row();
    }
  }
  console.log(rows);
  return rows;
};

var eventAppearsInRow = function(eventId, currRow) {
  return currRow.eventIds.indexOf(eventId) > -1;
};

var layOutDay = function(events) {
  // Ensure events are sorted by start time, earliest to latest.
  var eventsCopy = events.sort(function(a, b) {
    return a.start - b.start;
  });
  var rows = setEventRows(eventsCopy);
  var event;
  var i;
  var rowDiv;
  var eventDiv;
  var itemDiv;
  var locationDiv;
  var itemText;
  var locationText;
  rows.forEach(function(row) {
    rowDiv = document.createElement("div");
    rowDiv.className = "event-row";
    rowDiv.style.cssText += 'top:' + row.start;
    for (i = 0; i < eventsCopy.length; i++) {
      event = eventsCopy[i];
      if (eventAppearsInRow(i, row)) {
        eventDiv = document.createElement("div");
        itemDiv = document.createElement("div");
        locationDiv = document.createElement("div");
        itemText = document.createTextNode(event.item);
        locationText = document.createTextNode(event.location);
        itemDiv.appendChild(itemText);
        eventDiv.className += 'event';
        eventDiv.style.cssText += 'margin-top:' + (event.start - row.start);
        itemDiv.className += 'item';
        locationDiv.className += 'location';
        locationDiv.appendChild(locationText);
        eventDiv.appendChild(itemDiv);
        eventDiv.appendChild(locationDiv);
        eventDiv.style.cssText += 'height:' + (event.end - event.start);
        eventDiv.style.cssText += 'top:' + event.start;
        eventDiv.style.cssText += 'width:' + (100/row.sharedWith) + '%';
        rowDiv.appendChild(eventDiv);
      }
    }
    document.getElementById('calendar-container').appendChild(rowDiv);
  });
};

window.onload = function() {
  getTimeIncrements(9);
  layOutDay(events);
};