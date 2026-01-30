describe "ToolRegister", ->
  tr = new ToolRegister
  it "gives PencilTool when you ask for pencil", ->
    expect(tr.toolFor('pencil')).toEqual PencilTool

  it "gives DotTool when you ask for a dot", ->
    expect(tr.toolFor('dot')).toEqual DotTool

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