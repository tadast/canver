describe "ToolRegister", ->
  tr = new ToolRegister
  it "gives FingerTool when you ask for a finger", ->
    expect(tr.toolFor('finger')).toEqual FingerTool

  it "gives DotTool when you ask for a dot", ->
    expect(tr.toolFor('dot')).toEqual DotTool


describe "FingerTool", ->
  it "responds to finger", ->
    expect(FingerTool.respondsTo('finger')).toBeTruthy()
    
  it "does not respond to toe", ->
    expect(FingerTool.respondsTo('toe')).toBeFalsy()
    
describe "DotTool", ->
  it "responds to dot", ->
    expect(DotTool.respondsTo('dot')).toBeTruthy()
    
  it "does not respond to line", ->
    expect(DotTool.respondsTo('line')).toBeFalsy()
    
describe "FeatherTool", ->
  it "responds to feather", ->
    expect(FeatherTool.respondsTo('feather')).toBeTruthy()
    
  it "does not respond to zomg", ->
    expect(FeatherTool.respondsTo('zomg')).toBeFalsy()