describe "TouchLogEntry", ->
  entry = undefined
  beforeEach ->
    entry = new TouchLogEntry

  describe "constructor", ->
    it "defaults to maxSize 3", ->
      expect(entry.maxSize).toEqual 3

    it "has no current record initially", ->
      expect(entry.current()).toBeUndefined()

    it "has no previous record initially", ->
      expect(entry.previous()).toBeUndefined()

  describe "updateWith", ->
    it "has only current record when called once", ->
      entry.updateWith 1, 2
      expect(entry.current()).toBeDefined()
      expect(entry.previous()).toBeUndefined()

    it "has current and previous records when called twice", ->
      entry.updateWith 1, 2
      entry.updateWith 4, 5
      expect(entry.current()).toBeDefined()
      expect(entry.previous()).toBeDefined()

    it "has correct values", ->
      entry.updateWith 1, 2
      entry.updateWith 4, 5

      expect(entry.current()).toEqual  {x: 4, y: 5}
      expect(entry.previous()).toEqual {x: 1, y: 2}

    it "does not exceed the size", ->
      entry.maxSize = 2
      entry.updateWith 1, 1
      entry.updateWith 2, 2
      entry.updateWith 3, 3
      expect(entry.length()).toEqual 2

    it "removes the oldest record if needed", ->
      entry.maxSize = 2
      entry.updateWith 1, 1
      entry.updateWith 2, 2
      entry.updateWith 3, 3
      expect(entry.all).toEqual [{x:3, y:3}, {x:2, y:2}]

  describe "distance", ->
    it "is 0 if there is only one point", ->
      entry.updateWith(3, 0)
      expect(entry.distance()).toEqual 0

    it "is 2 when x has moved left by 2 points", ->
      entry.updateWith(5, 0)
      entry.updateWith(3, 0)
      expect(entry.distance()).toEqual 2

    it "is 3 when x has moved right by 3 points", ->
      entry.updateWith(5, 0)
      entry.updateWith(8, 0)
      expect(entry.distance()).toEqual 3