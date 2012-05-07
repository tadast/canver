describe("TouchLogEntry", function() {
  var entry;
  entry = void 0;
  beforeEach(function() {
    return entry = new TouchLogEntry;
  });
  describe("constructor", function() {
    it("defaults to maxSize 3", function() {
      return expect(entry.maxSize).toEqual(3);
    });
    it("has no current record initially", function() {
      return expect(entry.current()).toBeUndefined();
    });
    return it("has no previous record initially", function() {
      return expect(entry.previous()).toBeUndefined();
    });
  });
  describe("updateWith", function() {
    it("has only current record when called once", function() {
      entry.updateWith(1, 2);
      expect(entry.current()).toBeDefined();
      return expect(entry.previous()).toBeUndefined();
    });
    it("has current and previous records when called twice", function() {
      entry.updateWith(1, 2);
      entry.updateWith(4, 5);
      expect(entry.current()).toBeDefined();
      return expect(entry.previous()).toBeDefined();
    });
    it("has correct values", function() {
      entry.updateWith(1, 2);
      entry.updateWith(4, 5);
      expect(entry.current()).toEqual({
        x: 4,
        y: 5
      });
      return expect(entry.previous()).toEqual({
        x: 1,
        y: 2
      });
    });
    it("does not exceed the size", function() {
      entry.maxSize = 2;
      entry.updateWith(1, 1);
      entry.updateWith(2, 2);
      entry.updateWith(3, 3);
      return expect(entry.length()).toEqual(2);
    });
    return it("removes the oldest record if needed", function() {
      entry.maxSize = 2;
      entry.updateWith(1, 1);
      entry.updateWith(2, 2);
      entry.updateWith(3, 3);
      return expect(entry.all).toEqual([
        {
          x: 3,
          y: 3
        }, {
          x: 2,
          y: 2
        }
      ]);
    });
  });
  return describe("distance", function() {
    it("is 0 if there is only one point", function() {
      entry.updateWith(3, 0);
      return expect(entry.distance()).toEqual(0);
    });
    it("is 2 when x has moved left by 2 points", function() {
      entry.updateWith(5, 0);
      entry.updateWith(3, 0);
      return expect(entry.distance()).toEqual(2);
    });
    return it("is 3 when x has moved right by 3 points", function() {
      entry.updateWith(5, 0);
      entry.updateWith(8, 0);
      return expect(entry.distance()).toEqual(3);
    });
  });
});