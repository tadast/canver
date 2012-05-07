describe "TouchLog", ->
  describe "(size)", ->
    it "defaults to size 3", ->
      touchLog = new TouchLog
      expect(touchLog.size).toEqual 3

    it "has a size of 5 if set so", ->
      touchLog = new TouchLog 5
      expect(touchLog.size).toEqual 5

    it "forwards maxSize to each logEntry", ->
      touchLog = new TouchLog 13
      entry = touchLog.findOrNew 'someid'
      expect(entry.maxSize).toEqual 13

  describe "(operations)", ->
    touchLog = undefined
    beforeEach ->
      touchLog = new TouchLog

    it "has an empty log initailly", ->
      expect(touchLog.log).toEqual {}

    describe "findOrNew", ->
      it "finds a log by id if exists", ->
        touchLog.log['123'] = "LogEventStub"
        expect(touchLog.findOrNew('123')).toEqual "LogEventStub"

      it "creates a new log event if id does not exist", ->
        expect(touchLog.findOrNew('123')).toEqual new TouchLogEntry 3

    describe "logEvent", ->
      it "logs the event", ->
        touch1 =
          identifier: 'event1'
          clientX: 3
          clientY: 4
        event =
          touches: [touch1]

        touchLog.logEvent event
        expect(touchLog.log['event1'].current()).toEqual {x: 3, y: 4}

    describe "clear", ->
      it "removes the event entirely", ->
        touchLog.log['event1'] = {}

        touchLog.clear 'event1'

        expect(touchLog.log['event1']).toBeUndefined()