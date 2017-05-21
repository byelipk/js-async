# Import file "search-box-mockup" (sizes and positions are scaled 1:2)
sketch = Framer.Importer.load("imported/search-box-mockup@2x")

scroll = ScrollComponent.wrap(sketch.App)

typeLetter = (letter, delay) ->
  Utils.delay (speed * delay), -> textBox.html += letter


sketch.resultsDropdown.opacity = 0
sketch.searchInput.opacity     = 0
sketch.searchBtnHover.opacity  = 0

sketch.searchBtn.states =
	show:
		opacity: 1
		display: "block"
	hide:
		opacity: 0
		display: "none"

sketch.searchBtnHover.states = 
	show:
		opacity: 1
		display: "block"
	hide:
		opacity: 0
		display: "none"

sketch.searchInput.states =
	show:
		opacity: 1
		display: "block"
	hide:
		opacity: 0
		display: "none"

sketch.searchBtn.onMouseOver (event, layer) ->
	sketch.
		searchBtnHover.
			stateSwitch("show")

sketch.searchBtn.onMouseOut (event, layer) ->
	sketch.
		searchBtnHover.
			stateSwitch("default")	

sketch.searchBtn.onClick (event, layer) ->
	layer.
		stateSwitch("hide")
	
	sketch.
		searchBtnHover.
			stateSwitch("hide")
	
	sketch.
		searchInput.
			stateSwitch("show")
	
sketch.closeBtn.onClick (event, layer) ->
	sketch.
		searchBtn.
			stateSwitch("show")
	
	sketch.
		searchBtnHover.
			stateSwitch("default")
	
	sketch.
		searchInput.
			stateSwitch("hide")	


		

		
		
		
	
		






