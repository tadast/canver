describe("ToolRegister", function() {
  var tr;
  tr = new ToolRegister;
  it("gives WetFeather when you ask for a finger", function() {
    return expect(tr.toolFor('wetFeather')).toEqual(WetFeather);
  });
  return it("gives DotTool when you ask for a dot", function() {
    return expect(tr.toolFor('dot')).toEqual(DotTool);
  });
});
describe("WetFeather", function() {
  it("responds to wetFeather", function() {
    return expect(WetFeather.respondsTo('wetFeather')).toBeTruthy();
  });
  return it("does not respond to toe", function() {
    return expect(WetFeather.respondsTo('toe')).toBeFalsy();
  });
});
describe("DotTool", function() {
  it("responds to dot", function() {
    return expect(DotTool.respondsTo('dot')).toBeTruthy();
  });
  return it("does not respond to line", function() {
    return expect(DotTool.respondsTo('line')).toBeFalsy();
  });
});
describe("PencilTool", function() {
  it("responds to pencil", function() {
    return expect(PencilTool.respondsTo('pencil')).toBeTruthy();
  });
  return it("does not respond to zomg", function() {
    return expect(PencilTool.respondsTo('zomg')).toBeFalsy();
  });
});