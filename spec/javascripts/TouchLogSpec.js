describe("TouchLog", function() {
  describe("(size)", function() {
    it("defaults to size 3", function() {
      var touchLog;
      touchLog = new TouchLog;
      return expect(touchLog.size).toEqual(3);
    });
    it("has a size of 5 if set so", function() {
      var touchLog;
      touchLog = new TouchLog(5);
      return expect(touchLog.size).toEqual(5);
    });
    return it("forwards maxSize to each logEntry", function() {
      var entry, touchLog;
      touchLog = new TouchLog(13);
      entry = touchLog.findOrNew('someid');
      return expect(entry.maxSize).toEqual(13);
    });
  });
  return describe("(operations)", function() {
    var touchLog;
    touchLog = void 0;
    beforeEach(function() {
      return touchLog = new TouchLog;
    });
    it("has an empty log initailly", function() {
      return expect(touchLog.log).toEqual({});
    });
    describe("findOrNew", function() {
      it("finds a log by id if exists", function() {
        touchLog.log['123'] = "LogEventStub";
        return expect(touchLog.findOrNew('123')).toEqual("LogEventStub");
      });
      return it("creates a new log event if id does not exist", function() {
        return expect(touchLog.findOrNew('123')).toEqual(new TouchLogEntry(3));
      });
    });
    describe("logEvent", function() {
      return it("logs the event", function() {
        var event, touch1;
        touch1 = {
          identifier: 'event1',
          clientX: 3,
          clientY: 4
        };
        event = {
          touches: [touch1]
        };
        touchLog.logEvent(event);
        return expect(touchLog.log['event1'].current()).toEqual({
          x: 3,
          y: 4
        });
      });
    });
    return describe("clear", function() {
      return it("removes the event entirely", function() {
        touchLog.log['event1'] = {};
        touchLog.clear('event1');
        return expect(touchLog.log['event1']).toBeUndefined();
      });
    });
  });
});