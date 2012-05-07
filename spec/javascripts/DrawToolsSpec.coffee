describe "ToolRegister", ->
  tr = new ToolRegister
  it "gives WetFeather when you ask for a finger", ->
    expect(tr.toolFor('wetFeather')).toEqual WetFeather

  it "gives DotTool when you ask for a dot", ->
    expect(tr.toolFor('dot')).toEqual DotTool

describe "WetFeather", ->
  it "responds to wetFeather", ->
    expect(WetFeather.respondsTo('wetFeather')).toBeTruthy()

  it "does not respond to toe", ->
    expect(WetFeather.respondsTo('toe')).toBeFalsy()

describe "DotTool", ->
  it "responds to dot", ->
    expect(DotTool.respondsTo('dot')).toBeTruthy()

  it "does not respond to line", ->
    expect(DotTool.respondsTo('line')).toBeFalsy()

describe "PencilTool", ->
  it "responds to pencil", ->
    expect(PencilTool.respondsTo('pencil')).toBeTruthy()

  it "does not respond to zomg", ->
    expect(PencilTool.respondsTo('zomg')).toBeFalsy()