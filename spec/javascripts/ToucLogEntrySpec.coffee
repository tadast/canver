describe "TouchLogEntry", ->
  entry = undefined
  beforeEach ->
    entry = new TouchLogEntry

  describe "constructor", ->
    it "has no current record initially", ->
      expect(entry.current).toBeUndefined()

    it "has no previous record initially", ->
      expect(entry.previous).toBeUndefined()
    
  describe "updateWith", ->
    it "has only current record when called once", ->
      entry.updateWith 1, 2
      expect(entry.current).toBeDefined()
      expect(entry.previous).toBeUndefined()
      
    it "has current and previous records when called twice", ->
      entry.updateWith 1, 2
      entry.updateWith 4, 5
      expect(entry.current).toBeDefined()
      expect(entry.previous).toBeDefined()
      
    it "has correct values", ->
      entry.updateWith 1, 2
      entry.updateWith 4, 5
      
      expect(entry.current).toEqual  {x: 4, y: 5}
      expect(entry.previous).toEqual {x: 1, y: 2}