describe "TouchLog", ->
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
      expect(touchLog.findOrNew('123')).toEqual new TouchLogEntry
      
  describe "logEvent", ->
    it "logs the event", ->
      touch1 = 
        identifier: 'event1'
        clientX: 3
        clientY: 4
      event =
        touches: [touch1]

      touchLog.logEvent event      
      expect(touchLog.log['event1'].current).toEqual {x: 3, y: 4}
      
  describe "clear", ->
    it "removes the event entirely", ->
      touchLog.log['event1'] = {}
    
      touchLog.clear 'event1'
    
      expect(touchLog.log['event1']).toBeUndefined()
        