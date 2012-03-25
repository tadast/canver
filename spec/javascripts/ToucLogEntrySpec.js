describe("TouchLogEntry", function() {
  var entry;
  entry = void 0;
  beforeEach(function() {
    return entry = new TouchLogEntry;
  });
  describe("constructor", function() {
    it("has no current record initially", function() {
      return expect(entry.current).toBeUndefined();
    });
    return it("has no previous record initially", function() {
      return expect(entry.previous).toBeUndefined();
    });
  });
  return describe("updateWith", function() {
    it("has only current record when called once", function() {
      entry.updateWith(1, 2);
      expect(entry.current).toBeDefined();
      return expect(entry.previous).toBeUndefined();
    });
    it("has current and previous records when called twice", function() {
      entry.updateWith(1, 2);
      entry.updateWith(4, 5);
      expect(entry.current).toBeDefined();
      return expect(entry.previous).toBeDefined();
    });
    return it("has correct values", function() {
      entry.updateWith(1, 2);
      entry.updateWith(4, 5);
      expect(entry.current).toEqual({
        x: 4,
        y: 5
      });
      return expect(entry.previous).toEqual({
        x: 1,
        y: 2
      });
    });
  });
});