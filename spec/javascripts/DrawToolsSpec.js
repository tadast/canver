describe("ToolRegister", function() {
  var tr;
  tr = new ToolRegister;
  it("gives FingerTool when you ask for a finger", function() {
    return expect(tr.toolFor('finger')).toEqual(FingerTool);
  });
  return it("gives DotTool when you ask for a dot", function() {
    return expect(tr.toolFor('dot')).toEqual(DotTool);
  });
});
describe("FingerTool", function() {
  it("responds to finger", function() {
    return expect(FingerTool.respondsTo('finger')).toBeTruthy();
  });
  return it("does not respond to toe", function() {
    return expect(FingerTool.respondsTo('toe')).toBeFalsy();
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